---
description: Generate a personal Claude Code cheatsheet system. Use when user wants to create their own quick-reference for commands, skills, plugins, and MCP servers.
---

# Cheaters Generator

Create a personalized Claude Code cheatsheet system inspired by [Brett Terpstra's Cheaters](https://github.com/ttscoff/cheaters).

## What This Skill Creates

A local HTML-based quick-reference system with:
- Dark theme interface with keyboard navigation
- Sheets for Claude commands, custom skills, plugin packs, and MCP servers
- LocalStorage persistence for last-viewed sheet
- Comprehensive documentation pulled from your actual configuration
- **Global timestamp** in footer showing last full regeneration
- **Per-sheet timestamps** showing when each sheet was last updated
- **"New" badges** highlighting items added since previous generation

## Workflow

### 1. Gather Information

First, collect the user's Claude Code configuration:

```bash
# List installed MCP servers
claude mcp list

# Find custom skills
ls -la ~/.claude/skills/

# Find custom slash commands
ls -la ~/.claude/commands/

# Check for plugin packs
ls -la ~/.claude/plugins/marketplaces/
```

### 2. Check Previous Generation (for "New" tracking)

Before regenerating, capture existing items to compare:

```javascript
// Read existing main.js and extract item names per sheet
// Store in previousItems = { 'sheet-id': ['item1', 'item2', ...], ... }
// New items = current items not in previousItems[sheet]
```

If no previous generation exists, skip "New" tracking for first run.

### 3. Create Directory Structure

Ask user for preferred location (default: `~/Dev/claude-code-cheaters/`):

```bash
mkdir -p ~/Dev/claude-code-cheaters/{stylesheets,javascripts}
```

### 4. Generate Files

Create three files following the templates below.

---

## File Templates

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claude Code Cheatsheet</title>
    <link rel="stylesheet" href="stylesheets/main.css">
</head>
<body>
    <nav id="sidebar">
        <div class="nav-header">
            <h1>Claude Code</h1>
            <span class="subtitle">Quick Reference</span>
        </div>
        <ul id="nav">
            <li class="nav-section">Core</li>
            <li><a href="#" data-sheet="claude-commands" class="active">Claude Commands</a></li>
            <li><a href="#" data-sheet="custom-skills">Custom Skills</a></li>

            <!-- Add Plugin Packs section if user has any -->
            <li class="nav-section">Plugin Packs</li>
            <!-- Add entries for each installed plugin -->

            <!-- Add MCP Servers section -->
            <li class="nav-section">MCP Servers</li>
            <!-- Add entries for each MCP server -->
            <!-- Add new-dot span for sheets with new items -->
            <!-- Example: <li><a href="#" data-sheet="mcp-new">New Server <span class="new-dot"></span></a></li> -->
        </ul>
        <div class="nav-footer">
            <span id="global-timestamp"></span>
        </div>
    </nav>

    <main id="content">
        <!-- Content loaded dynamically -->
    </main>

    <script src="javascripts/main.js"></script>
</body>
</html>
```

### stylesheets/main.css

```css
/* Claude Code Cheatsheet - Dark Theme */

:root {
    --bg-dark: #1a1a2e;
    --bg-sidebar: #16213e;
    --bg-content: #0f0f1a;
    --bg-card: #1a1a2e;
    --text-primary: #e4e4e7;
    --text-secondary: #a1a1aa;
    --text-muted: #71717a;
    --accent: #8b5cf6;
    --accent-hover: #a78bfa;
    --border: #27273a;
    --code-bg: #0d0d14;
    --success: #22c55e;
    --warning: #f59e0b;
    --info: #3b82f6;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
    background: var(--bg-content);
    color: var(--text-primary);
    display: flex;
    min-height: 100vh;
    line-height: 1.6;
}

/* Sidebar */
#sidebar {
    width: 240px;
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border);
    padding: 20px 0;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
}

.nav-header {
    padding: 0 20px 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 15px;
}

.nav-header h1 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
}

.nav-header .subtitle {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

#nav {
    list-style: none;
}

#nav li {
    margin: 2px 0;
}

#nav .nav-section {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 15px 20px 5px;
    margin-top: 10px;
}

#nav a {
    display: block;
    padding: 8px 20px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    transition: all 0.15s ease;
}

#nav a:hover {
    background: rgba(139, 92, 246, 0.1);
    color: var(--text-primary);
}

#nav a.active {
    background: rgba(139, 92, 246, 0.15);
    color: var(--accent);
    border-left: 2px solid var(--accent);
}

/* Main Content */
#content {
    flex: 1;
    margin-left: 240px;
    padding: 40px;
    max-width: 1000px;
}

/* Sheet Styles */
.sheet h1 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--text-primary);
}

.sheet .description {
    color: var(--text-secondary);
    margin-bottom: 30px;
    font-size: 0.95rem;
}

.sheet h2 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent);
    margin: 30px 0 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
}

.sheet h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 20px 0 10px;
}

/* Command/Tool Cards */
.command-grid {
    display: grid;
    gap: 12px;
}

.command-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 15px;
    transition: border-color 0.15s ease;
}

.command-card:hover {
    border-color: var(--accent);
}

.command-name {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 0.9rem;
    color: var(--accent);
    margin-bottom: 5px;
}

.command-desc {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.command-args {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 8px;
    font-family: 'SF Mono', 'Fira Code', monospace;
}

/* Tags */
.tag {
    display: inline-block;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 8px;
    font-weight: 500;
    text-transform: uppercase;
}

.tag-builtin { background: rgba(59, 130, 246, 0.2); color: var(--info); }
.tag-custom { background: rgba(139, 92, 246, 0.2); color: var(--accent); }
.tag-plugin { background: rgba(34, 197, 94, 0.2); color: var(--success); }
.tag-mcp { background: rgba(245, 158, 11, 0.2); color: var(--warning); }
.tag-new { background: var(--success); color: #000; font-weight: 600; }

/* New item indicator dot in sidebar */
.new-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: var(--success);
    border-radius: 50%;
    margin-left: 6px;
    vertical-align: middle;
}

/* Sidebar footer for global timestamp */
.nav-footer {
    padding: 12px 20px;
    border-top: 1px solid var(--border);
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: auto;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg-sidebar);
}

/* Adjust sidebar for footer */
#sidebar {
    display: flex;
    flex-direction: column;
    padding-bottom: 50px;
}

/* Per-sheet timestamp */
.sheet-timestamp {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: normal;
}

/* Code blocks */
code {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 0.85rem;
    background: var(--code-bg);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--accent-hover);
}

pre {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 15px;
    overflow-x: auto;
    margin: 10px 0;
}

pre code {
    background: none;
    padding: 0;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    font-size: 0.85rem;
}

th, td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid var(--border);
}

th {
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.05em;
}

td:first-child {
    font-family: 'SF Mono', 'Fira Code', monospace;
    color: var(--accent);
}

/* Keyboard shortcuts */
kbd {
    display: inline-block;
    padding: 3px 6px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 0.75rem;
    background: var(--bg-sidebar);
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: 0 1px 0 var(--border);
}

/* Notes/Tips */
.note {
    background: rgba(59, 130, 246, 0.1);
    border-left: 3px solid var(--info);
    padding: 12px 15px;
    margin: 15px 0;
    border-radius: 0 8px 8px 0;
    font-size: 0.85rem;
}

.warning {
    background: rgba(245, 158, 11, 0.1);
    border-left: 3px solid var(--warning);
    padding: 12px 15px;
    margin: 15px 0;
    border-radius: 0 8px 8px 0;
    font-size: 0.85rem;
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-dark);
}

::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
}
```

### javascripts/main.js

```javascript
// Claude Code Cheatsheet - Navigation & Content Loading

// Global generation timestamp (set at generation time)
const generatedAt = '2025-12-02T14:45:00';  // ISO format

// Per-sheet metadata for timestamps and new item tracking
const sheetMeta = {
    'claude-commands': { updatedAt: '2025-12-02T14:45:00', hasNew: false },
    'custom-skills': { updatedAt: '2025-12-02T14:45:00', hasNew: true },
    // Add entry for each sheet...
};

const sheets = {
    'claude-commands': `
        <div class="sheet">
            <h1>Claude Commands <span class="tag tag-builtin">Built-in</span></h1>
            <p class="description">Core commands available in every Claude Code session</p>

            <h2>Session Control</h2>
            <div class="command-grid">
                <div class="command-card">
                    <div class="command-name">/help</div>
                    <div class="command-desc">Show help and available commands</div>
                </div>
                <div class="command-card">
                    <div class="command-name">/clear</div>
                    <div class="command-desc">Clear conversation history and start fresh</div>
                </div>
                <div class="command-card">
                    <div class="command-name">/compact</div>
                    <div class="command-desc">Compact conversation to reduce context usage</div>
                </div>
                <div class="command-card">
                    <div class="command-name">/quit</div>
                    <div class="command-desc">Exit Claude Code</div>
                </div>
            </div>

            <h2>Context & Memory</h2>
            <div class="command-grid">
                <div class="command-card">
                    <div class="command-name">/memory</div>
                    <div class="command-desc">View and manage persistent memory</div>
                </div>
                <div class="command-card">
                    <div class="command-name">/context</div>
                    <div class="command-desc">Show current context window usage</div>
                </div>
            </div>

            <h2>Configuration</h2>
            <div class="command-grid">
                <div class="command-card">
                    <div class="command-name">/config</div>
                    <div class="command-desc">Open Claude Code settings</div>
                </div>
                <div class="command-card">
                    <div class="command-name">/permissions</div>
                    <div class="command-desc">View and manage tool permissions</div>
                </div>
                <div class="command-card">
                    <div class="command-name">/allowed-tools</div>
                    <div class="command-desc">List currently allowed tools</div>
                </div>
            </div>

            <h2>MCP Servers</h2>
            <div class="command-grid">
                <div class="command-card">
                    <div class="command-name">/mcp</div>
                    <div class="command-desc">MCP server management</div>
                </div>
                <div class="command-card">
                    <div class="command-name">claude mcp list</div>
                    <div class="command-desc">List all configured MCP servers (terminal)</div>
                </div>
                <div class="command-card">
                    <div class="command-name">claude mcp add &lt;name&gt;</div>
                    <div class="command-desc">Add a new MCP server (terminal)</div>
                </div>
                <div class="command-card">
                    <div class="command-name">claude mcp remove &lt;name&gt;</div>
                    <div class="command-desc">Remove an MCP server (terminal)</div>
                </div>
            </div>

            <h2>Keyboard Shortcuts</h2>
            <table>
                <tr><th>Shortcut</th><th>Action</th></tr>
                <tr><td><kbd>Ctrl</kbd>+<kbd>C</kbd></td><td>Cancel current operation</td></tr>
                <tr><td><kbd>Ctrl</kbd>+<kbd>D</kbd></td><td>Exit Claude Code</td></tr>
                <tr><td><kbd>↑</kbd> / <kbd>↓</kbd></td><td>Navigate command history</td></tr>
                <tr><td><kbd>Tab</kbd></td><td>Autocomplete commands</td></tr>
                <tr><td><kbd>Esc</kbd></td><td>Cancel input / close prompt</td></tr>
            </table>
        </div>
    `,

    'custom-skills': `
        <div class="sheet">
            <h1>Custom Skills <span class="tag tag-custom">User</span> <span class="sheet-timestamp">Updated: Dec 2, 2025</span></h1>
            <p class="description">Your personal skills in ~/.claude/skills/</p>

            <h2>Example Category</h2>
            <div class="command-grid">
                <div class="command-card">
                    <div class="command-name">/new-skill <span class="tag tag-new">New</span></div>
                    <div class="command-desc">A newly added skill since last generation</div>
                </div>
                <div class="command-card">
                    <div class="command-name">/existing-skill</div>
                    <div class="command-desc">An existing skill (no New tag)</div>
                </div>
            </div>

            <div class="note">
                <strong>Skill Location:</strong> ~/.claude/skills/&lt;skill-name&gt;/SKILL.md
            </div>
        </div>
    `

    // Add more sheets for each MCP server and plugin
};

// Load sheet content
function loadSheet(sheetId) {
    const content = document.getElementById('content');
    content.innerHTML = sheets[sheetId] || '<div class="sheet"><h1>Not Found</h1><p>Sheet not available.</p></div>';

    // Update active nav
    document.querySelectorAll('#nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`[data-sheet="${sheetId}"]`)?.classList.add('active');

    // Save to localStorage
    localStorage.setItem('lastSheet', sheetId);
}

// Format date for display
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set global timestamp in footer
    const timestampEl = document.getElementById('global-timestamp');
    if (timestampEl) {
        timestampEl.textContent = `Last updated: ${formatDate(generatedAt)}`;
    }

    // Load last viewed or default
    const lastSheet = localStorage.getItem('lastSheet') || 'claude-commands';
    loadSheet(lastSheet);

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

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
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
        }
    });
});
```

---

## Sheet Content Guidelines

### For Each MCP Server Sheet

Include these sections:

1. **Example Prompts** - Natural language queries users can say
2. **Tools by Category** - Group related tools together
3. **Parameters** - Document required and optional params
4. **Notes** - Requirements, limitations, tips

Example structure:

```javascript
'mcp-example': `
    <div class="sheet">
        <h1>Example MCP <span class="tag tag-mcp">MCP</span></h1>
        <p class="description">Brief description of what this MCP does</p>

        <h2>Example Prompts</h2>
        <div class="command-grid">
            <div class="command-card">
                <div class="command-name">"Natural language query"</div>
                <div class="command-desc">What it does</div>
            </div>
        </div>

        <h2>Category Name</h2>
        <div class="command-grid">
            <div class="command-card">
                <div class="command-name">tool_name</div>
                <div class="command-desc">What the tool does</div>
                <div class="command-args">param: type (description)</div>
            </div>
        </div>

        <div class="note">
            <strong>Note:</strong> Important information about this MCP.
        </div>
    </div>
`
```

### Pull README Content

For each MCP server, check for demonstration phrases:

```bash
# If MCP has local source
cat ~/Dev/mcp-example/README.md | grep -A 20 "Example"
```

---

## Usage

After generation, users can:

```bash
# Open directly in browser
open ~/Dev/claude-code-cheaters/index.html

# Or serve locally for live editing
cd ~/Dev/claude-code-cheaters && python3 -m http.server 8888
```

## Keyboard Navigation

- `↑` / `k` - Previous sheet
- `↓` / `j` - Next sheet
