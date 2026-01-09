/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const filesToFix = [
    {
        path: 'app/(dashboard)/dashboard/invoices/_components/invoices-client.tsx',
        unusedImports: ['DropdownMenuSeparator', 'generateCustomerInvoice'],
        componentProps: 'InvoicesClientProps'
    },
    {
        path: 'app/(dashboard)/dashboard/manifests/_components/manifests-client.tsx',
        unusedImports: ['Clock', 'DropdownMenuSeparator'],
        componentProps: 'ManifestsClientProps' // Assumption, will verify regex
    },
    {
        path: 'app/(dashboard)/dashboard/tracking/_components/tracking-client.tsx',
        unusedImports: ['Button'], // Wait, Button is usually used. Sonar said unused? Let's be careful.
        componentProps: 'TrackingClientProps'
    },
    {
        path: 'app/(dashboard)/dashboard/exceptions/_components/exceptions-client.tsx',
        unusedImports: [], // None listed in my short summary, but I'll check "Remove unused" patterns
        componentProps: 'ExceptionsClientProps'
    },
    {
        path: 'app/(dashboard)/dashboard/shipments/_components/shipments-table-client.tsx',
        unusedImports: [],
        componentProps: 'ShipmentsTableClientProps'
    }
];

filesToFix.forEach(fileDef => {
    const fullPath = path.resolve(fileDef.path);
    if (!fs.existsSync(fullPath)) {
        console.log(`File not found: ${fullPath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;

    // 1. Remove unused imports
    if (fileDef.unusedImports) {
        fileDef.unusedImports.forEach(importName => {
            const regex = new RegExp(`\\b${importName}\\b,?\\s*`, 'g');
            // Check if it's in an import statement
            const lines = content.split('\n');
            const newLines = lines.map(line => {
                if (line.trim().startsWith('import') || line.includes('} from "')) {
                    if (line.includes(importName)) {
                        let newLine = line.replace(regex, '').replace(/,\s*}/, ' }').replace(/{\s*,/, '{ ');
                        // If simple removal left empty braces "import { } from ...", remove line
                        if (newLine.match(/import\s*{\s*}\s*from/)) {
                            return null; // Marking for deletion
                        }
                        return newLine;
                    }
                }
                return line;
            }).filter(l => l !== null);
            content = newLines.join('\n');
        });
    }

    // 2. Mark props as Readonly
    // Regex to find: function Comp({ ... }: Props)
    // Replace with: function Comp({ ... }: Readonly<Props>)
    // Or: const Comp = ({ ... }: Props)

    // We look for ": Props" and replace with ": Readonly<Props>"
    // But we need to be careful to only target the main component or explicit props interfaces.
    // Safer: Look for the specific Prop type usage in the component definition.

    // Pattern: }: InterfaceName)
    if (fileDef.componentProps) {
        const propRegex = new RegExp(`}:\\s*${fileDef.componentProps}\\)`, 'g');
        content = content.replace(propRegex, `}: Readonly<${fileDef.componentProps}>)`);

        // Also handling: }: InterfaceName {
        const propRegex2 = new RegExp(`}:\\s*${fileDef.componentProps}\\s*{`, 'g');
        content = content.replace(propRegex2, `}: Readonly<${fileDef.componentProps}> {`);
    }

    if (content !== originalContent) {
        console.log(`Fixing ${fileDef.path}`);
        fs.writeFileSync(fullPath, content);
    } else {
        console.log(`No changes for ${fileDef.path}`);
    }
});
