---
description: Generate a personal Claude Code quick-reference system. Use when user wants to create their own reference for commands, skills, agents, and MCP servers.
---

# Claude Code Quick-Reference Generator

Create a personalized Claude Code quick-reference system inspired by [Brett Terpstra's Cheaters](https://github.com/ttscoff/cheaters).

## What This Skill Creates

A local HTML-based quick-reference system with:
- Modern design with oklch() colors and smooth animations
- Dark/light theme with system preference detection
- Per-sheet timestamps showing when each section was last updated
- "New" badges highlighting items added since previous generation
- **Proper frontmatter parsing** for skill descriptions and agent models
- Search functionality with keyboard navigation (j/k, /, Esc)
- LocalStorage persistence for last-viewed sheet and theme

## Architecture

```
~/Dev/claude-code-quickref/     # Or your preferred location
├── index.html              # Main HTML with navigation
├── stylesheets/
│   └── main.css            # Modern oklch() theme styles
├── javascripts/
│   └── main.js             # Auto-generated from sheets/
└── sheets/                 # Individual sheet files (2-12 KB each)
    ├── builtin-commands.html
    ├── custom-skills.html
    ├── custom-agents.html
    ├── [plugin-name].html      # One per installed plugin
    ├── mcp-[server-name].html  # One per MCP server
    └── ...
```

## Frontmatter Parsing

### Skills (SKILL.md)

The generator reads YAML frontmatter from each skill:

```yaml
---
name: skill-name
description: What this skill does
user-invocable: true
---
```

Extracts:
- `description` — Displayed in the quick-reference
- `user-invocable` — Whether users can invoke directly (shown with badge)

### Agents (.md files)

The generator reads YAML frontmatter from each agent:

```yaml
---
model: opus
tools:
  - Read
  - Write
---
```

Extracts:
- `model` — Displayed as "Model: Opus/Sonnet/Haiku"
- `tools` — Listed in command-args section

## Sheet File Format

Each sheet is a standalone HTML file with metadata:

```html
<!-- meta: {"updatedAt": "2025-12-07T10:00:00", "hasNew": true} -->
<div class="sheet">
    <h1>Sheet Title <span class="tag tag-custom">Custom</span></h1>
    <p class="description">Brief description</p>

    <h2>Section</h2>
    <div class="command-grid">
        <div class="command-card">
            <div class="command-name">command_name</div>
            <div class="command-desc">What it does (from frontmatter)</div>
            <div class="command-args">Model: Opus | Tools: Read, Write</div>
        </div>
    </div>
</div>
```

## Workflow

### Initial Generation

For first-time setup using `/generate-quickref`:

#### 1. Gather Information

```bash
# List installed MCP servers
claude mcp list

# Find custom skills with descriptions
ls -la ~/.claude/skills/

# Find custom agents with model info
ls -la ~/.claude/agents/

# Check for plugin packs
ls -la ~/.claude/plugins/marketplaces/
```

#### 2. Parse Frontmatter

For each skill, read `SKILL.md` and extract:
```bash
head -20 ~/.claude/skills/[skill-name]/SKILL.md
```

For each agent, read the `.md` file and extract model:
```bash
head -10 ~/.claude/agents/[agent-name].md
```

#### 3. Generate Files

Create:
- `index.html` — Navigation structure with modern design
- `stylesheets/main.css` — oklch() theme with animations
- `sheets/*.html` — Individual sheet files with parsed frontmatter

#### 4. Build

```bash
node scripts/build.js
```

### Incremental Updates (Sync)

For updates to existing quickref, use `/sync-quickref` which:

1. Scans current configuration (skills, agents, MCP servers, plugins)
2. Compares against existing sheet files
3. **Reports diff**: Added / Removed / Changed items
4. Updates only changed sheets
5. Preserves manual customizations
6. Rebuilds main.js

## CSS Theme (oklch Design)

The generated CSS uses modern oklch() colors following superdesign principles:

```css
:root {
  /* Dark mode (default) */
  --bg-primary: oklch(0.13 0.02 265);
  --bg-secondary: oklch(0.15 0.02 265);
  --bg-surface: oklch(0.18 0.02 265);
  --text-primary: oklch(0.95 0 0);
  --text-secondary: oklch(0.7 0 0);
  --accent: oklch(0.65 0.18 265);
  --accent-hover: oklch(0.72 0.18 265);
  --success: oklch(0.65 0.2 145);
  --warning: oklch(0.75 0.18 75);
  --danger: oklch(0.65 0.2 25);
  --border: oklch(0.25 0.02 265);
  --shadow: 0 2px 8px oklch(0 0 0 / 0.3);
  --radius: 0.625rem;
  --font-sans: Inter, system-ui, sans-serif;
  --font-mono: JetBrains Mono, monospace;
}

[data-theme="light"] {
  --bg-primary: oklch(0.98 0 0);
  --bg-secondary: oklch(0.95 0 0);
  --bg-surface: oklch(1 0 0);
  --text-primary: oklch(0.15 0 0);
  --text-secondary: oklch(0.45 0 0);
  --border: oklch(0.88 0 0);
  --shadow: 0 2px 8px oklch(0 0 0 / 0.08);
}
```

## Animation Guidelines

Following superdesign patterns (150-400ms, ease-out):

```css
.command-card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.command-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.sheet { animation: fadeIn 300ms ease-out; }
```

## Tag Classes

| Class | Color | Use For |
|-------|-------|---------|
| `.tag-builtin` | Blue | Claude built-in commands |
| `.tag-custom` | Purple (accent) | User skills |
| `.tag-agent` | Pink | Custom subagents |
| `.tag-plugin` | Green (success) | Plugin packs |
| `.tag-mcp` | Orange (warning) | MCP servers |
| `.tag-new` | Pulsing | Newly added items |

## Usage

After generation, open in browser:

```bash
open ~/Dev/claude-code-quickref/index.html

# Or serve locally for development
cd ~/Dev/claude-code-quickref && python3 -m http.server 8888
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `Esc` | Close search |
| `↑` / `k` | Previous sheet |
| `↓` / `j` | Next sheet |
| `Enter` | Select search result |

## CLI Mode

For users without Claude Code, run build directly:

```bash
cd ~/Dev/claude-code-quickref
node scripts/build.js [output-dir]
```

## Related Commands

- `/generate-quickref [location]` — Full generation from scratch
- `/sync-quickref` — Incremental update with diff reporting
