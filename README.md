# Claude Code Quick-Reference

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-blue)](https://claude.ai/code)

Generate personalized Claude Code quick-reference systems inspired by [Brett Terpstra's Cheaters](https://github.com/ttscoff/cheaters).

![Dark Mode](screenshots/dark-mode.png)

## Features

- **Modern design** with oklch() colors and smooth animations
- **Dark & light themes** with system preference detection
- **Global search** — Press `/` to search all commands across sheets
- **Keyboard navigation** — j/k, arrows, Enter to select
- **Auto-discovery** — Scans your actual configuration
- **Proper frontmatter parsing** — Extracts descriptions from skills, models from agents
- **Diff-based sync** — See exactly what changed between updates
- **LocalStorage persistence** — Remembers your last-viewed sheet and theme

![Light Mode](screenshots/light-mode.png)

## Installation

### Option 1: Plugin Install (Recommended)

```bash
# Add the marketplace
claude plugin marketplace add aplaceforallmystuff/claude-code-quickref

# Install the plugin
claude plugin install claude-code-quickref
```

Start a new Claude Code session to use the commands and skills.

### Option 2: Manual Install

```bash
# Clone the repo
git clone https://github.com/aplaceforallmystuff/claude-code-quickref.git
cd claude-code-quickref

# Install commands
cp -r commands/* ~/.claude/commands/

# Install skills
cp -r skills/* ~/.claude/skills/
```

## Usage

### Generate Your Quick-Reference

```
/generate-quickref
```

Or with a custom location:

```
/generate-quickref ~/Documents/my-quickref
```

### Sync Existing Quick-Reference

Update your existing quickref with any changes to your configuration:

```
/sync-quickref
```

This will:
- Scan current skills, agents, commands, MCP servers
- Compare against existing sheets
- Report a diff (Added / Removed / Changed)
- Update only affected files
- Rebuild main.js

### What Gets Scanned

| Source | Location | Parsed Data |
|--------|----------|-------------|
| Skills | `~/.claude/skills/` | description, user-invocable (from SKILL.md) |
| Agents | `~/.claude/agents/` | model, tools (from frontmatter) |
| Commands | `~/.claude/commands/` | description (from frontmatter) |
| MCP Servers | `~/.claude.json` | tools, configuration |
| Plugins | `~/.claude/plugins/` | all commands/skills |

### Using Your Quick-Reference

```bash
# Open directly in browser
open path/to/quickref/index.html

# Or serve locally
cd path/to/quickref && python3 -m http.server 8888
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `Esc` | Close search |
| `↑` / `↓` | Navigate results / sheets |
| `Enter` | Select result |
| `k` / `j` | Previous / next sheet |

## Commands & Skills

### Commands

| Command | Description |
|---------|-------------|
| `/generate-quickref [location]` | Full generation from scratch |
| `/sync-quickref [location]` | Incremental update with diff reporting |

### Skills

| Skill | Description |
|-------|-------------|
| `quickref-generator` | Main skill for generating personalized quick-references |

## Frontmatter Parsing

### Skills (SKILL.md)

```yaml
---
name: skill-name
description: What this skill does
user-invocable: true
---
```

### Agents (.md files)

```yaml
---
model: opus
tools:
  - Read
  - Write
---
```

The model field is displayed as "Model: Opus/Sonnet/Haiku" in the quick-reference.

## Architecture

```
your-quickref/
├── index.html              # Main HTML with navigation
├── stylesheets/
│   └── main.css            # Modern oklch() themes
├── javascripts/
│   └── main.js             # AUTO-GENERATED from sheets/
├── sheets/                 # Individual sheet files (2-12 KB each)
│   ├── claude-commands.html
│   ├── custom-skills.html
│   ├── custom-agents.html
│   ├── mcp-*.html          # One per MCP server
│   └── ...
└── images/
    └── mascot.png          # Optional mascot image
```

### Editing Sheets

Edit individual files in `sheets/` — each is small and self-contained:

```bash
vim sheets/custom-agents.html
```

### Build Process

After editing sheets, rebuild `main.js`:

```bash
node scripts/build.js
```

## Design System

The generated CSS uses modern oklch() colors following superdesign principles:

- **Typography**: Inter for body, JetBrains Mono for code
- **Colors**: oklch() color space for perceptual uniformity
- **Shadows**: Subtle, multi-layer shadows
- **Animation**: 150-400ms ease-out transitions
- **Spacing**: 4px base unit (0.25rem)

### CSS Variables

```css
:root {
  --bg-primary: oklch(0.13 0.02 265);
  --accent: oklch(0.65 0.18 265);
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius-md: 0.625rem;
  --transition-normal: 200ms ease-out;
}
```

## CLI Mode

For users without Claude Code, the build script can be run directly:

```bash
cd path/to/quickref
node scripts/build.js [output-dir]
```

## Contributing

1. Fork the repo
2. Create a feature branch
3. Submit a PR

## License

MIT

## Author

Jim Christian — [jimchristian.net](https://jimchristian.net) · [hello@jimchristian.net](mailto:hello@jimchristian.net)
