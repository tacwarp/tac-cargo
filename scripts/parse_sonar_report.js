/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = 'c:/tac-saas/tac-cargo/docs/SonarScanner-Analysis-Complete.md';

const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

let currentFile = '';
const issues = [];

let i = 0;
while (i < lines.length) {
    let line = lines[i].trim();

    // Detect filenames (heuristic: contains / or ends with .ts/.tsx/.js/.sql)
    // The report format puts filename on a line by itself, usually after a block of metadata.
    if ((line.includes('/') || line.includes('.')) && !line.includes(' ') && line.length > 4) {
        // Double check it looks like a file path
        if (!line.startsWith('Step') && !line.startsWith('Select')) {
            currentFile = line;
        }
    }

    // Detect Issue Description
    // It usually appears after some metadata or blank lines.
    // In this specific format, the description often follows the filename or a metadata block.
    // Actually, looking at the pattern:
    // [FILENAME]
    // [BLANK]
    // [BLANK]
    // [ISSUE DESCRIPTION]

    // Or
    // [METADATA]
    // [FILENAME]
    // ...

    // Let's rely on the structure:
    // After a file line, we often see the issue description nearby.
    // However, the file name serves as a header for a block sometimes.

    // Let's simplify. I want to extract "Issue Description" and "File", and "Line Number".
    // I see "L[Number]" lines like "L4", "L17".
    // I see "Refactor...", "Remove...", "Define..." descriptions.

    // Let's just collect ALL descriptions and pair them with the most recent filename seen.

    if (line.match(/^L\d+$/)) {
        const lineNumber = parseInt(line.substring(1));

        // The issue description is usually a few lines BEFORE the L-number block, 
        // OR it was the text that appeared before the metadata block.
        // Let's look backwards from the line number to find the description.
        // The block usually ends with "Code Smell" "Minor/Critical" etc.
        // The format is:
        // [Description]
        // [Category]
        // [Category]
        // [Severity Number]
        // [Severity Text]
        // [Tags...]
        // +
        // Open
        // [Assignee]
        // L[Number]

        // So about 8-15 lines back is the description.
        // Let's crawl back until we find a line that looks like a description (long sentence, starts with uppercase).

        let descIndex = i - 1;
        let description = "";

        // Scan back up to 20 lines
        for (let j = 1; j < 20; j++) {
            const prev = lines[i - j];
            if (!prev) continue;
            const prevTrim = prev.trim();
            if (prevTrim === '' || prevTrim === '+' || prevTrim === 'Open' || prevTrim === 'Not assigned' ||
                prevTrim === 'tacwarp' || prevTrim.match(/^\d+min effort$/) || prevTrim.match(/^\d+ days ago$/) ||
                prevTrim.match(/^\d+ minutes ago$/) || prevTrim.match(/^[a-z-]+$/) // tags like "es2015"
            ) {
                continue;
            }

            // If we hit a number like "4" or "2", it's severity.
            if (prevTrim.match(/^\d+$/)) continue;
            if (prevTrim === 'High' || prevTrim === 'Low' || prevTrim === 'Medium' || prevTrim === 'Critical') continue;
            if (prevTrim === 'Code Smell' || prevTrim === 'Bug' || prevTrim === 'Vulnerability') continue;
            if (prevTrim === 'Intentionality' || prevTrim === 'Maintainability' || prevTrim === 'Adaptability' || prevTrim === 'Consistency') continue;

            // If we found the filename, stop.
            if (prevTrim === currentFile) break;

            // If we found "Select issues" etc, stop.
            if (prevTrim === 'Select issues') break;

            // Potential description
            if (prevTrim.length > 10) {
                description = prevTrim;
                break;
            }
        }

        if (description) {
            issues.push({
                file: currentFile,
                line: lineNumber,
                description: description
            });
        }
    }

    i++;
}

// Group by file
const grouped = {};
issues.forEach(issue => {
    if (!grouped[issue.file]) grouped[issue.file] = [];
    grouped[issue.file].push(issue);
});

// Remove duplicates (same file, same line, same description)
Object.keys(grouped).forEach(f => {
    const unique = [];
    grouped[f].forEach(curr => {
        if (!unique.find(x => x.line === curr.line && x.description === curr.description)) {
            unique.push(curr);
        }
    });
    grouped[f] = unique;
});

console.log(JSON.stringify(grouped, null, 2));
