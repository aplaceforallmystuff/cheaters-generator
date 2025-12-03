# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
