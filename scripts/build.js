#!/usr/bin/env node
/**
 * Cheaters Build Script
 *
 * Compiles individual sheet files from sheets/ directory into main.js
 *
 * Usage:
 *   node scripts/build.js [output-dir]
 *
 * Examples:
 *   node scripts/build.js                           # Uses default ~/Dev/claude-code-cheaters/
 *   node scripts/build.js ~/my-cheaters             # Custom output directory
 *   node scripts/build.js /path/to/cheaters-output  # Absolute path
 */

const fs = require('fs');
const path = require('path');

// Configuration - customize DEFAULT_OUTPUT to your preferred location
const DEFAULT_OUTPUT = path.join(process.env.HOME, 'Dev', 'claude-code-cheaters');
const outputDir = process.argv[2] || DEFAULT_OUTPUT;
const sheetsDir = path.join(outputDir, 'sheets');
const outputFile = path.join(outputDir, 'javascripts', 'main.js');

// Sheet ordering for navigation
const SHEET_ORDER = [
    // Core
    { id: 'builtin-commands', section: 'Core', label: 'Built-in Commands' },
    { id: 'custom-skills', section: 'Core', label: 'Custom Skills' },
    { id: 'custom-agents', section: 'Core', label: 'Custom Agents' },
    // Plugin Packs - detected dynamically
    // MCP Servers - detected dynamically
];

/**
 * Read all sheet files from sheets/ directory
 */
function readSheets() {
    const sheets = {};
    const sheetMeta = {};

    if (!fs.existsSync(sheetsDir)) {
        console.error(`Sheets directory not found: ${sheetsDir}`);
        console.log('Creating empty sheets directory...');
        fs.mkdirSync(sheetsDir, { recursive: true });
        return { sheets, sheetMeta };
    }

    const files = fs.readdirSync(sheetsDir).filter(f => f.endsWith('.html'));

    for (const file of files) {
        const sheetId = file.replace('.html', '');
        const filePath = path.join(sheetsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract metadata from HTML comments at top of file
        // Format: <!-- meta: {"updatedAt": "2025-12-07", "hasNew": true} -->
        const metaMatch = content.match(/<!--\s*meta:\s*({.*?})\s*-->/);
        let meta = { updatedAt: new Date().toISOString(), hasNew: false };
        if (metaMatch) {
            try {
                meta = { ...meta, ...JSON.parse(metaMatch[1]) };
            } catch (e) {
                console.warn(`Invalid meta in ${file}:`, e.message);
            }
        }

        // Remove meta comment from content
        const cleanContent = content.replace(/<!--\s*meta:\s*{.*?}\s*-->\n?/, '').trim();

        sheets[sheetId] = cleanContent;
        sheetMeta[sheetId] = meta;
    }

    return { sheets, sheetMeta };
}

/**
 * Build navigation structure from sheets
 */
function buildNavStructure(sheetIds) {
    const sections = {
        'Core': [],
        'Plugin Packs': [],
        'MCP Servers': []
    };

    for (const id of sheetIds) {
        if (id === 'builtin-commands' || id === 'custom-skills' || id === 'custom-agents') {
            sections['Core'].push(id);
        } else if (id.startsWith('mcp-')) {
            sections['MCP Servers'].push(id);
        } else {
            sections['Plugin Packs'].push(id);
        }
    }

    return sections;
}

/**
 * Generate the main.js file
 */
function generateMainJs(sheets, sheetMeta) {
    const timestamp = new Date().toISOString();

    // Build sheets object as string
    const sheetsStr = Object.entries(sheets)
        .map(([id, content]) => {
            // Escape backticks and ${} in content
            const escaped = content
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(/\$\{/g, '\\${');
            return `    '${id}': \`\n${escaped}\n    \``;
        })
        .join(',\n\n');

    // Build sheetMeta object
    const metaStr = Object.entries(sheetMeta)
        .map(([id, meta]) => `    '${id}': ${JSON.stringify(meta)}`)
        .join(',\n');

    const js = `// Claude Code Cheatsheet - Navigation & Content Loading
// AUTO-GENERATED - Do not edit directly. Edit sheets/*.html and run build.

// Generation metadata - updated when cheaters is regenerated
const generatedAt = '${timestamp}';

// Per-sheet metadata for timestamps and new indicators
const sheetMeta = {
${metaStr}
};

// Helper to format dates
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
    });
}

// Seasonal mascot configuration
const seasonalMascots = {
    default: 'xita-mascot.png',
    christmas: 'xita-christmas.png',      // Dec 1-25
    newyear: 'xita-newyear.png',          // Dec 26 - Jan 1
    threekings: 'xita-threekings.png',    // Jan 2-6
    valentine: 'xita-valentine.png',      // Feb 10-14
    halloween: 'xita-halloween.png'       // Oct 20-31
};

// Determine current season based on date
function getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();

    // Christmas: Dec 1-25
    if (month === 12 && day >= 1 && day <= 25) return 'christmas';

    // New Year: Dec 26 - Jan 1
    if ((month === 12 && day >= 26) || (month === 1 && day === 1)) return 'newyear';

    // Three Kings: Jan 2-6
    if (month === 1 && day >= 2 && day <= 6) return 'threekings';

    // Valentine: Feb 10-14
    if (month === 2 && day >= 10 && day <= 14) return 'valentine';

    // Halloween: Oct 20-31
    if (month === 10 && day >= 20 && day <= 31) return 'halloween';

    return 'default';
}

// Set the seasonal mascot image
function setSeasonalMascot() {
    const mascotImg = document.querySelector('.mascot');
    if (!mascotImg) return;

    const season = getCurrentSeason();
    const mascotFile = seasonalMascots[season] || seasonalMascots.default;

    // Only change if seasonal image exists (graceful fallback)
    const testImg = new Image();
    testImg.onload = () => {
        mascotImg.src = 'images/' + mascotFile;
        mascotImg.title = season === 'default' ? 'Xita' : 'Xita (' + season + ' edition)';
    };
    testImg.onerror = () => {
        // Seasonal image doesn't exist, keep default
        console.log('Seasonal mascot not found:', mascotFile);
    };
    testImg.src = 'images/' + mascotFile;
}

// Sheet content
const sheets = {
${sheetsStr}
};

// Load sheet content
function loadSheet(sheetId) {
    const content = document.getElementById('content');
    content.innerHTML = sheets[sheetId] || '<div class="sheet"><h1>Not Found</h1><p>Sheet not available.</p></div>';

    // Update active nav
    document.querySelectorAll('#nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(\`[data-sheet="\${sheetId}"]\`)?.classList.add('active');

    // Save to localStorage
    localStorage.setItem('lastSheet', sheetId);
}

// Theme management
function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        // Auto - remove attribute to let CSS media query handle it
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    updateThemeButtons(theme);
}

function updateThemeButtons(theme) {
    const lightBtn = document.getElementById('theme-light');
    const darkBtn = document.getElementById('theme-dark');

    lightBtn.classList.remove('active');
    darkBtn.classList.remove('active');

    if (theme === 'light') {
        lightBtn.classList.add('active');
    } else if (theme === 'dark') {
        darkBtn.classList.add('active');
    }
}

function getInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;

    // Default to system preference detection
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    // Build search index
    const searchIndex = [];
    for (const [sheetId, content] of Object.entries(sheets)) {
        // Extract command names and descriptions
        const nameMatches = content.matchAll(/<div class="command-name">([^<]+)<\\/div>/g);
        const descMatches = content.matchAll(/<div class="command-desc">([^<]+)<\\/div>/g);

        const names = [...nameMatches].map(m => m[1].replace(/<[^>]+>/g, '').trim());
        const descs = [...descMatches].map(m => m[1].trim());

        names.forEach((name, i) => {
            searchIndex.push({
                name: name,
                desc: descs[i] || '',
                sheet: sheetId
            });
        });
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }

        const matches = searchIndex.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.desc.toLowerCase().includes(query)
        ).slice(0, 10);

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            searchResults.innerHTML = matches.map(item => \`
                <div class="search-result" data-sheet="\${item.sheet}">
                    <span class="search-result-name">\${item.name}</span>
                    <span class="search-result-desc">\${item.desc}</span>
                </div>
            \`).join('');
        }
        searchResults.style.display = 'block';
    });

    searchResults.addEventListener('click', (e) => {
        const result = e.target.closest('.search-result');
        if (result) {
            loadSheet(result.dataset.sheet);
            searchInput.value = '';
            searchResults.style.display = 'none';
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.style.display = 'none';
        }
    });

    // Close on Escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchResults.style.display = 'none';
            searchInput.blur();
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set global timestamp in footer
    const timestampEl = document.getElementById('global-timestamp');
    if (timestampEl) {
        timestampEl.textContent = \`Last updated: \${formatDate(generatedAt)}\`;
    }

    // Add "new" dots to nav items that have new content
    document.querySelectorAll('#nav a[data-sheet]').forEach(link => {
        const sheetId = link.dataset.sheet;
        if (sheetMeta[sheetId]?.hasNew) {
            const dot = document.createElement('span');
            dot.className = 'new-dot';
            dot.title = 'New content since last generation';
            link.appendChild(dot);
        }
    });

    // Load last viewed or default
    const lastSheet = localStorage.getItem('lastSheet') || 'builtin-commands';
    loadSheet(lastSheet);

    // Initialize theme
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);

    // Theme toggle buttons
    document.getElementById('theme-light').addEventListener('click', () => setTheme('light'));
    document.getElementById('theme-dark').addEventListener('click', () => setTheme('dark'));

    // Navigation clicks
    document.getElementById('nav').addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const sheetId = e.target.dataset.sheet;
            if (sheetId) {
                loadSheet(sheetId);
            }
        }
    });

    // Initialize search
    initSearch();

    // Set seasonal mascot
    setSeasonalMascot();

    // Keyboard navigation (when not in search)
    document.addEventListener('keydown', (e) => {
        // Skip if in search input
        if (e.target.id === 'search-input') return;

        const links = Array.from(document.querySelectorAll('#nav a[data-sheet]'));
        const currentIndex = links.findIndex(a => a.classList.contains('active'));

        if (e.key === 'ArrowDown' || e.key === 'j') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % links.length;
            loadSheet(links[nextIndex].dataset.sheet);
        } else if (e.key === 'ArrowUp' || e.key === 'k') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + links.length) % links.length;
            loadSheet(links[prevIndex].dataset.sheet);
        } else if (e.key === '/') {
            e.preventDefault();
            document.getElementById('search-input')?.focus();
        }
    });
});
`;

    return js;
}

/**
 * Main build function
 */
function build() {
    console.log(`Building cheaters from: ${sheetsDir}`);
    console.log(`Output to: ${outputFile}`);

    // Ensure output directories exist
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });

    // Read all sheets
    const { sheets, sheetMeta } = readSheets();

    if (Object.keys(sheets).length === 0) {
        console.warn('No sheets found! Run the cheaters-generator skill first to create initial sheets.');
        return;
    }

    console.log(`Found ${Object.keys(sheets).length} sheets:`);
    Object.keys(sheets).forEach(id => console.log(`  - ${id}`));

    // Generate main.js
    const mainJs = generateMainJs(sheets, sheetMeta);

    // Write output
    fs.writeFileSync(outputFile, mainJs);

    console.log(`\nBuild complete! Output: ${outputFile}`);
    console.log(`Total size: ${(mainJs.length / 1024).toFixed(1)} KB`);
}

// Run build
build();
