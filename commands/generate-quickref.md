---
description: Generate a personalized Claude Code quick-reference system
arguments:
  - name: location
    description: Directory to create quickref (default: ~/Dev/claude-code-quickref)
    required: false
---

Invoke the quickref-generator skill to create a personalized Claude Code quick-reference.

This will:
1. Scan your MCP servers (`claude mcp list`)
2. Find your custom skills (`~/.claude/skills/`) with frontmatter parsing
3. Find your custom agents (`~/.claude/agents/`) with model detection
4. Detect installed plugins (`~/.claude/plugins/`)
5. Generate a complete HTML/CSS/JS quick-reference system
6. Pull demonstration phrases from available READMEs

$ARGUMENTS
