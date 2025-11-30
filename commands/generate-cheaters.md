---
description: Generate a personalized Claude Code cheatsheet system
arguments:
  - name: location
    description: Directory to create cheaters (default: ~/Dev/claude-code-cheaters)
    required: false
---

Invoke the cheaters-generator skill to create a personalized Claude Code cheatsheet.

This will:
1. Scan your MCP servers (`claude mcp list`)
2. Find your custom skills (`~/.claude/skills/`)
3. Detect installed plugins (`~/.claude/plugins/`)
4. Generate a complete HTML/CSS/JS cheatsheet system
5. Pull demonstration phrases from available READMEs

$ARGUMENTS
