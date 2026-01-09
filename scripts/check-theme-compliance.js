/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const FORBIDDEN_PATTERNS = [
    // Tailwind default colors that should be avoided in favor of semantic tokens
    /text-(blue|green|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{3}/,
    /bg-(blue|green|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{3}/,
    /border-(blue|green|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{3}/,

    // Hardcoded white/black
    /text-white/,
    /text-black/,
    /bg-white/,
    /bg-black/,

    // Hex codes
    /#[0-9a-fA-F]{3,6}/,
];

const IGNORED_FILES = [
    'node_modules/**',
    '.next/**',
    'dist/**',
    'build/**',
    'coverage/**',
    'public/**',
    'scripts/check-theme-compliance.js', // Ignore self
    'app/globals.css', // Defines the variables
    'tailwind.config.ts', // Config
    'tailwind.config.js',
];

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const errors = [];

    content.split('\n').forEach((line, index) => {
        FORBIDDEN_PATTERNS.forEach((pattern) => {
            const match = line.match(pattern);
            if (match) {
                // Skip comments somewhat naively
                if (line.trim().startsWith('//') || line.trim().startsWith('/*')) return;

                errors.push({
                    line: index + 1,
                    match: match[0],
                    pattern: pattern.toString()
                });
            }
        });
    });

    return errors;
}

function run() {
    console.log('🔍 Checking for non-semantic color usage...');

    const files = glob.sync('**/*.{tsx,ts,jsx,js,css}', {
        ignore: IGNORED_FILES,
    });

    let totalErrors = 0;

    files.forEach((file) => {
        const errors = checkFile(file);
        if (errors.length > 0) {
            console.log(`\n❌ ${file}:`);
            errors.forEach((err) => {
                console.log(`  Line ${err.line}: Found forbidden pattern "${err.match}"`);
            });
            totalErrors += errors.length;
        }
    });

    if (totalErrors > 0) {
        console.log(`\n💥 Found ${totalErrors} theme violations.`);
        console.log('Please use semantic variables (text-foreground, bg-primary, etc.) instead of hardcoded colors.');
        process.exit(1);
    } else {
        console.log('\n✅ No theme violations found. Great job!');
    }
}

run();
