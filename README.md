# Cheaters Generator

Generate personalized Claude Code cheatsheet systems inspired by [Brett Terpstra's Cheaters](https://github.com/ttscoff/cheaters).

## What It Does

Creates a local HTML-based quick-reference system customized to YOUR Claude Code setup:

- **Dark theme interface** with keyboard navigation (j/k, arrows)
- **Sheets for everything** - Claude commands, custom skills, plugin packs, MCP servers
- **Auto-discovery** - Scans your actual configuration to build relevant sheets
- **Example prompts** - Pulls demonstration phrases from MCP server READMEs
- **LocalStorage persistence** - Remembers your last-viewed sheet

## Installation

### Option 1: Plugin Install (Recommended)

```bash
# Add the marketplace
claude plugin marketplace add aplaceforallmystuff/cheaters-generator

# Install the plugin
claude plugin install cheaters-generator
```

Start a new Claude Code session to use the commands and skills.

### Option 2: Manual Install

```bash
# Clone the repo
git clone https://github.com/aplaceforallmystuff/cheaters-generator.git
cd cheaters-generator

# Install commands
cp -r commands/* ~/.claude/commands/

# Install skills
cp -r skills/* ~/.claude/skills/
```

## Usage

### Generate Your Cheatsheet

```
/generate-cheaters
```

Or with a custom location:

```
/generate-cheaters ~/Documents/my-cheaters
```

### What Gets Scanned

The skill automatically discovers:

| Source | Command |
|--------|---------|
| MCP Servers | `claude mcp list` |
| Custom Skills | `ls ~/.claude/skills/` |
| Slash Commands | `ls ~/.claude/commands/` |
| Installed Plugins | `ls ~/.claude/plugins/marketplaces/` |

### Using Your Cheatsheet

After generation:

```bash
# Open directly in browser
open ~/Dev/claude-code-cheaters/index.html

# Or serve locally (for live editing)
cd ~/Dev/claude-code-cheaters && python3 -m http.server 8888
```

### Keyboard Navigation

- `↑` / `k` - Previous sheet
- `↓` / `j` - Next sheet

## What's Included

### Skills

| Skill | Description |
|-------|-------------|
| `cheaters-generator` | Main skill for generating personalized cheatsheets |

### Commands

| Command | Description |
|---------|-------------|
| `/generate-cheaters` | Generate a cheatsheet at specified location |

## Customization

The generated cheatsheet is pure HTML/CSS/JS - no build tools required. Edit directly:

- `index.html` - Add/remove navigation items
- `stylesheets/main.css` - Customize colors and layout
- `javascripts/main.js` - Add new sheet content

### CSS Variables

```css
:root {
    --bg-dark: #1a1a2e;
    --bg-sidebar: #16213e;
    --bg-content: #0f0f1a;
    --accent: #8b5cf6;      /* Purple accent */
    --success: #22c55e;      /* Green for plugins */
    --warning: #f59e0b;      /* Orange for MCP */
    --info: #3b82f6;         /* Blue for built-in */
}
```

### Tag Classes

- `.tag-builtin` - Blue, for Claude built-in commands
- `.tag-custom` - Purple, for user skills
- `.tag-plugin` - Green, for plugin packs
- `.tag-mcp` - Orange, for MCP servers

## Example Output

The generated cheatsheet includes:

**Core Section**
- Claude Commands (built-in commands, keyboard shortcuts)
- Custom Skills (your ~/.claude/skills/)

**Plugin Packs Section**
- One sheet per installed plugin with all commands/skills

**MCP Servers Section**
- One sheet per MCP server with:
  - Example prompts (natural language queries)
  - Tools grouped by category
  - Parameter documentation

## Contributing

1. Fork the repo
2. Create a feature branch
3. Submit a PR

## License

MIT

## Author

Jim Christian - [hello@jimchristian.net](mailto:hello@jimchristian.net)
