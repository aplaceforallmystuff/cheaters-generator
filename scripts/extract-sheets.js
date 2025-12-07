#!/usr/bin/env node
/**
 * Extract sheets from existing main.js into individual files
 * One-time migration script for upgrading from monolithic to modular architecture
 *
 * Usage:
 *   node scripts/extract-sheets.js [cheaters-dir]
 *
 * Examples:
 *   node scripts/extract-sheets.js                    # Uses ~/Dev/claude-code-cheaters/
 *   node scripts/extract-sheets.js ~/my-cheaters      # Custom directory
 */

const fs = require('fs');
const path = require('path');

// Configuration - customize to your cheaters location
const DEFAULT_DIR = path.join(process.env.HOME, 'Dev', 'claude-code-cheaters');
const cheatersDir = process.argv[2] || DEFAULT_DIR;
const inputFile = path.join(cheatersDir, 'javascripts', 'main.js');
const outputDir = path.join(cheatersDir, 'sheets');

// Read the main.js file
const content = fs.readFileSync(inputFile, 'utf8');

// Extract sheetMeta
const metaMatch = content.match(/const sheetMeta = \{([\s\S]*?)\n\};/);
let sheetMeta = {};
if (metaMatch) {
    try {
        // Parse the object - this is a bit hacky but works for simple objects
        const metaStr = '{' + metaMatch[1] + '}';
        // Convert to valid JSON by fixing single quotes and unquoted keys
        const jsonStr = metaStr
            .replace(/'/g, '"')
            .replace(/(\w+):/g, '"$1":')
            .replace(/,\s*}/g, '}')
            .replace(/,\s*,/g, ',');
        sheetMeta = JSON.parse(jsonStr);
    } catch (e) {
        console.warn('Could not parse sheetMeta:', e.message);
    }
}

// Find the sheets object
const sheetsMatch = content.match(/const sheets = \{([\s\S]*?)\n\};[\s\S]*?\/\/ Load sheet content/);
if (!sheetsMatch) {
    console.error('Could not find sheets object in main.js');
    process.exit(1);
}

const sheetsStr = sheetsMatch[1];

// Extract individual sheets using regex
// Pattern: 'sheet-id': `content`
const sheetPattern = /^\s*'([^']+)':\s*`([\s\S]*?)`\s*(?=,\s*$|$)/gm;

let match;
let count = 0;

// Create output directory
fs.mkdirSync(outputDir, { recursive: true });

// Process each sheet
const allMatches = [];
let lastIndex = 0;

// Split by the pattern `    'sheet-id': ``
const sheetParts = sheetsStr.split(/\n\n?\s{4}'/);

for (let i = 1; i < sheetParts.length; i++) {
    const part = sheetParts[i];
    const idEndIndex = part.indexOf("':");
    if (idEndIndex === -1) continue;

    const sheetId = part.substring(0, idEndIndex);

    // Find content between backticks
    const contentStart = part.indexOf('`') + 1;
    let contentEnd = part.lastIndexOf('`');

    // Handle trailing comma
    if (contentEnd === -1) contentEnd = part.length;

    let sheetContent = part.substring(contentStart, contentEnd);

    // Unescape the content
    sheetContent = sheetContent
        .replace(/\\`/g, '`')
        .replace(/\\\$/g, '$')
        .replace(/\\\\/g, '\\');

    // Get metadata for this sheet
    const meta = sheetMeta[sheetId] || { updatedAt: new Date().toISOString(), hasNew: false };

    // Add meta comment at top
    const metaComment = `<!-- meta: ${JSON.stringify(meta)} -->\n`;
    const fullContent = metaComment + sheetContent.trim();

    // Write to file
    const outputFile = path.join(outputDir, `${sheetId}.html`);
    fs.writeFileSync(outputFile, fullContent);
    console.log(`Extracted: ${sheetId} (${(fullContent.length / 1024).toFixed(1)} KB)`);
    count++;
}

console.log(`\nExtracted ${count} sheets to ${outputDir}`);
