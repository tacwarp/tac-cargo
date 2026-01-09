/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Read the issues JSON
const issuesPath = 'sonar_issues.json';
if (!fs.existsSync(issuesPath)) {
    console.error('sonar_issues.json not found!');
    process.exit(1);
}

const issues = JSON.parse(fs.readFileSync(issuesPath, 'utf8'));

Object.keys(issues).forEach(filePath => {
    // Correct file path for Windows if needed (report uses forward slashes, assuming consistent with fs)
    const absolutePath = path.resolve(filePath.replace('app/.../', 'app/').replace('.../', ''));
    // The report truncates paths with '...', so we need to be careful.
    // Actually, looking at the JSON, some keys are "app/.../dashboard/..."
    // We need to resolve these to real paths.
    // A simple heuristic: find the file in the project directory that matches the ending of the path.
    // For now, let's try to act only on paths we can reliably resolve or just try standard resolution.

    // Better approach: Use the 'file' property from the issue object, which might be cleaner?
    // In the JSON view, 'file' property was also truncated in some cases? 
    // JSON line 87: "file": "app/.../exceptions/_components/exceptions-client.tsx"
    // We need to find the real file.

    let realPath = filePath;
    if (filePath.includes('...')) {
        // Search logic needed, but for now let's skip ambiguous paths or try to find them if easy.
        // Actually, I can use a glob pattern or `find` logic.
        // But wait, I have a `run_command` tool, I am writing a node script.
        // I can implement a recursive find in this script to locate the file.
        console.log(`Skipping ambiguous path for now: ${filePath}`);
        return;
    }

    if (!fs.existsSync(realPath)) {
        // Try relative to root?
        const relativeToRoot = path.join(process.cwd(), filePath);
        if (fs.existsSync(relativeToRoot)) {
            realPath = relativeToRoot;
        } else {
            console.log(`File not found: ${filePath}`);
            return;
        }
    }

    let content = fs.readFileSync(realPath, 'utf8');
    let originalContent = content;
    const fileIssues = issues[filePath];

    // Sort issues by line number descending so we don't mess up line numbers when editing (though replacements don't change line count usually)
    fileIssues.sort((a, b) => b.line - a.line);

    fileIssues.forEach(issue => {
        const lineIdx = issue.line - 1;
        const lines = content.split('\n');
        if (lineIdx >= lines.length) return;

        let line = lines[lineIdx];

        // 1. Unused Imports
        if (issue.description.startsWith("Remove this unused import of '")) {
            const match = issue.description.match(/'([^']+)'/);
            if (match) {
                const importName = match[1];
                // Regex to find import
                // Case 1: import { X, Y } from 'z' -> remove X
                // Case 2: import X from 'z' -> remove line

                if (line.includes(`{`) && line.includes(`}`)) {
                    // Named import
                    // Remove "ImportName," or ", ImportName" or "ImportName"
                    // Be careful with spacing
                    const regex = new RegExp(`\\b${importName}\\b,?\\s*`, 'g');
                    let newLine = line.replace(regex, '').replace(/,\s*}/, ' }').replace(/{\s*,/, '{ ');

                    // If simple removal left empty braces "import { } from ...", remove line
                    if (newLine.match(/import\s*{\s*}\s*from/)) {
                        lines.splice(lineIdx, 1);
                    } else {
                        lines[lineIdx] = newLine;
                    }
                } else if (line.includes(importName)) {
                    // Default import or namespace import, likely remove whole line
                    // Warning: "import X, { Y } from" -> removing X leaves "{ Y }"
                    // For now, if it looks like a default import line, remove it.
                    lines.splice(lineIdx, 1);
                }
            }
        }

        // 2. parseInt -> Number.parseInt
        else if (issue.description.includes("Prefer `Number.parseInt` over `parseInt`")) {
            lines[lineIdx] = line.replace(/\bparseInt\(/g, 'Number.parseInt(');
        }

        // 3. parseFloat -> Number.parseFloat
        else if (issue.description.includes("Prefer `Number.parseFloat` over `parseFloat`")) {
            lines[lineIdx] = line.replace(/\bparseFloat\(/g, 'Number.parseFloat(');
        }

        // 4. replace -> replaceAll
        else if (issue.description.includes("Prefer `String#replaceAll()` over `String#replace()`")) {
            // Only safe if the first arg is a string or a global regex.
            // Sonar is usually smart, but auto-fixing might break if regex is not global.
            // However, "replaceAll" with a string is usually what is wanted.
            // If it's a regex without /g, replaceAll throws.
            // Let's assume Sonar knows what it's doing, OR be conservative.
            // Safer: Only replace if it looks like a string replace: .replace('foo', 'bar')

            if (line.match(/\.replace\(['"`]/)) {
                lines[lineIdx] = line.replace(/\.replace\(/, '.replaceAll(');
            }
        }

        // 5. window -> globalThis
        else if (issue.description.includes("Prefer `globalThis` over `window`") || issue.description.includes("Prefer `globalThis.window` over `window`")) {
            lines[lineIdx] = line.replace(/\bwindow\b/, 'globalThis');
        }

        content = lines.join('\n');
    });

    if (content !== originalContent) {
        console.log(`Fixing ${realPath}`);
        fs.writeFileSync(realPath, content);
    }
});
