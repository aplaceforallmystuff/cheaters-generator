# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-01-14

### Changed

- **BREAKING: Renamed from `cheaters-generator` to `claude-code-quickref`**
  - Plugin name: `cheaters-generator` → `claude-code-quickref`
  - Commands: `/generate-cheaters` → `/generate-quickref`
  - Skills: `cheaters-generator` → `quickref-generator`
  - Default output: `~/Dev/claude-code-cheaters/` → `~/Dev/claude-code-quickref/`

- **Modern design system** following superdesign principles
  - oklch() color space for perceptually uniform colors
  - Inter font for body text, JetBrains Mono for code
  - Subtle shadows (no heavy drop shadows)
  - 150-400ms ease-out animations
  - FontAwesome 6 for icons

### Added

- **Frontmatter parsing** for skills and agents
  - Skills: Extracts `description` and `user-invocable` from SKILL.md
  - Agents: Extracts `model` field (opus/sonnet/haiku) and `tools` list
  - Displays model as "Model: Opus" in quick-reference cards

- **`/sync-quickref` command** for incremental updates
  - Compares current config against existing sheets
  - Reports diff: Added / Removed / Changed items
  - Updates only affected files
  - Preserves manual customizations

- **Template files** in `templates/` directory
  - `main.css` - Modern oklch() theme with animations
  - `index.html` - Clean HTML structure with FontAwesome icons

- **CLI mode** for non-Claude Code usage
  - Run `node scripts/build.js [output-dir]` directly

- **Seasonal mascot system** - Date-based image switching for holiday celebrations
  - Christmas (Dec 1-25): `xita-christmas.png`
  - New Year (Dec 26-Jan 1): `xita-newyear.png`
  - Three Kings (Jan 2-6): `xita-threekings.png`
  - Valentine's (Feb 10-14): `xita-valentine.png`
  - Halloween (Oct 20-31): `xita-halloween.png`

## [1.2.0] - 2025-12-07

### Added

- **Modular sheet architecture** - Individual sheet files in `sheets/` directory (2-12 KB each)
- `scripts/build.js` - Compiles sheets into main.js
- `scripts/extract-sheets.js` - Migration script from monolithic to modular format
- Sheet metadata support via HTML comments (`<!-- meta: {"updatedAt": "...", "hasNew": true} -->`)
- Command-line arguments for custom output paths

### Changed

- `main.js` is now auto-generated from sheets - do not edit directly
- SKILL.md updated with new modular workflow
- README updated with modular architecture documentation

### Fixed

- Sidebar footer positioning - now uses proper flexbox layout instead of absolute positioning
- Nav list scrolls independently while footer stays pinned at bottom

## [1.1.0] - 2025-12-03

### Added

- **Custom Agents support** - Now discovers and documents agents in `~/.claude/agents/`
- Agent sheet template with domain groupings (Vault, Content, Consulting, Development, Orchestration)
- `.tag-agent` CSS class (pink) for agent tags
- Agent card structure with model type and trigger phrases

### Fixed

- README usage examples now use generic paths instead of personal filesystem references

## [1.0.0] - 2025-11-30

### Added

- Initial release
- `cheaters-generator` skill for creating personalized cheatsheets
- `/generate-cheaters` command with optional location argument
- Dark theme CSS with purple accent
- Keyboard navigation (j/k, arrows)
- LocalStorage persistence for last-viewed sheet
- Auto-discovery of MCP servers, skills, plugins, and commands
- Template system for Claude Commands, Custom Skills, Plugin Packs, and MCP Servers
- Example prompt sections pulling from README files
