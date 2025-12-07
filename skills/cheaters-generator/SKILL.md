---
description: Generate a personal Claude Code cheatsheet system. Use when user wants to create their own quick-reference for commands, skills, plugins, and MCP servers.
---

# Cheaters Generator

Create a personalized Claude Code cheatsheet system inspired by [Brett Terpstra's Cheaters](https://github.com/ttscoff/cheaters).

## What This Skill Creates

A local HTML-based quick-reference system with:
- Dark/light theme interface with keyboard navigation
- Sheets for Claude commands, custom skills, plugin packs, and MCP servers
- LocalStorage persistence for last-viewed sheet
- Search functionality across all commands
- **Modular architecture** - each sheet in its own file for easy updates
- **Per-sheet timestamps** showing when each sheet was last updated
- **"New" badges** highlighting items added since previous generation

## Architecture

```
~/Dev/claude-code-cheaters/     # Or your preferred location
├── index.html              # Main HTML with navigation
├── stylesheets/
│   └── main.css            # Dark/light theme CSS
├── javascripts/
│   └── main.js             # Auto-generated from sheets/
└── sheets/                 # Individual sheet files
    ├── claude-commands.html
    ├── custom-skills.html
    ├── custom-agents.html
    ├── [plugin-name].html      # One per installed plugin
    ├── mcp-[server-name].html  # One per MCP server
    └── ...
```

### Sheet File Format

Each sheet is a standalone HTML file with metadata:

```html
<!-- meta: {"updatedAt": "2025-12-07T10:00:00", "hasNew": true} -->
<div class="sheet">
    <h1>Sheet Title <span class="tag tag-mcp">MCP</span></h1>
    <p class="description">Brief description</p>

    <h2>Section</h2>
    <div class="command-grid">
        <div class="command-card">
            <div class="command-name">command_name</div>
            <div class="command-desc">What it does</div>
            <div class="command-args">param: type</div>
        </div>
    </div>
</div>
```

### Build Process

After editing sheet files, run the build script:

```bash
node ~/Dev/cheaters-generator/scripts/build.js
```

This compiles all `sheets/*.html` into `javascripts/main.js`.

## Workflow

### Initial Generation

For first-time setup:

#### 1. Gather Information

```bash
# List installed MCP servers
claude mcp list

# Find custom skills
ls -la ~/.claude/skills/

# Find custom slash commands
ls -la ~/.claude/commands/

# Find custom agents
ls -la ~/.claude/agents/

# Check for plugin packs
ls -la ~/.claude/plugins/marketplaces/
```

#### 2. Create Directory Structure

```bash
mkdir -p ~/Dev/claude-code-cheaters/{stylesheets,javascripts,sheets}
```

#### 3. Generate Files

Create:
- `index.html` - Navigation structure
- `stylesheets/main.css` - Theme styles
- `sheets/*.html` - Individual sheet files

#### 4. Build

```bash
node ~/Dev/cheaters-generator/scripts/build.js
```

### Updating Sheets (Sync)

For incremental updates (use `/update-cheaters` or `cheaters-sync` skill):

#### 1. Scan Current Configuration

Read skills, agents, commands, MCP servers from:
- `~/.claude/skills/`
- `~/.claude/agents/`
- `~/.claude/commands/`
- `~/.claude.json` (MCP servers)

#### 2. Read Target Sheet File

Read the specific sheet file to update:
```bash
# Example: updating agents
cat ~/Dev/claude-code-cheaters/sheets/custom-agents.html
```

Each sheet file is small (2-12 KB) - no token limit issues.

#### 3. Update Sheet Content

Edit the specific sheet file with changes:
- Add new items with `class="command-card new"`
- Update metadata comment: `<!-- meta: {"updatedAt": "...", "hasNew": true} -->`
- Remove items that no longer exist

#### 4. Rebuild

```bash
node ~/Dev/cheaters-generator/scripts/build.js
```

#### 5. Commit (local only)

```bash
cd ~/Dev/claude-code-cheaters
git add -A
git commit -m "chore: sync [description of changes]"
```

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
            <div class="search-container">
                <input type="text" id="search-input" placeholder="Search commands..." autocomplete="off">
                <div id="search-results" class="search-results"></div>
            </div>
            <div class="theme-toggle">
                <button id="theme-light" title="Light theme">
                    <span class="icon">&#9728;</span> Light
                </button>
                <button id="theme-dark" title="Dark theme">
                    <span class="icon">&#9790;</span> Dark
                </button>
            </div>
        </div>
        <ul id="nav">
            <li class="nav-section">Core</li>
            <li><a href="#" data-sheet="claude-commands" class="active">Claude Commands</a></li>
            <li><a href="#" data-sheet="custom-skills">Custom Skills</a></li>
            <li><a href="#" data-sheet="custom-agents">Custom Agents</a></li>

            <li class="nav-section">Plugin Packs</li>
            <!-- Add entries for each installed plugin -->
            <li><a href="#" data-sheet="your-plugin">Your Plugin</a></li>

            <li class="nav-section">MCP Servers</li>
            <!-- Add entries for each MCP server -->
            <li><a href="#" data-sheet="mcp-your-server">Your Server</a></li>
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

See full CSS in the generated output. Key features:
- CSS variables for theming
- Dark mode default, light mode via `data-theme="light"`
- Card-based layout for commands
- Tag styling (builtin, custom, agent, plugin, mcp, new)
- Search results dropdown
- Responsive sidebar

### Sheet Content Guidelines

#### For MCP Server Sheets

Include these sections:

1. **Example Prompts** - Natural language queries users can say
2. **Tools by Category** - Group related tools together
3. **Parameters** - Document required and optional params
4. **Notes** - Requirements, limitations, tips

#### For Agent Sheets

Group agents by domain (examples):
- **Orchestration** - agents that coordinate other agents
- **Content** - content creation and publishing agents
- **Development** - code review, publishing, debugging agents
- **Research** - specialized research and analysis agents
- **Automation** - task automation and workflow agents

## Usage

After generation, open in browser:

```bash
open ~/Dev/claude-code-cheaters/index.html

# Or serve locally
cd ~/Dev/claude-code-cheaters && python3 -m http.server 8888
```

## Keyboard Navigation

- `↑` / `k` - Previous sheet
- `↓` / `j` - Next sheet
- `/` - Focus search
- `Esc` - Close search
