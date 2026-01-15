---
description: Sync your Claude Code quick-reference with current configuration (incremental update with diff)
arguments:
  - name: location
    description: Directory containing your quickref (default: ~/Dev/claude-code-quickref)
    required: false
---

Synchronize your existing Claude Code quick-reference with your current configuration.

## Process

1. **Scan current configuration:**
   - Skills from `~/.claude/skills/*/SKILL.md` (parse frontmatter)
   - Agents from `~/.claude/agents/` (parse model from frontmatter)
   - MCP servers from `~/.claude.json`
   - Plugins from `~/.claude/plugins/`

2. **Compare against existing sheets** in the quickref location

3. **Report diff:**
   ```
   ## Sync Report

   ### Added (3)
   - [skill] vault-recall - Quick memory search
   - [agent] oracle - Book knowledge assimilation
   - [agent] workflow-coordinator - Multi-agent orchestrator

   ### Removed (1)
   - [skill] old-skill - No longer exists

   ### Changed (2)
   - [agent] librarian - Model changed: Sonnet → Opus
   - [skill] morning-brief - Description updated
   ```

4. **Update only affected sheets** (preserves manual customizations)

5. **Rebuild** `javascripts/main.js`

6. **Commit locally** (optional)

## Important: Frontmatter Parsing

### Skills (SKILL.md)
```yaml
---
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

The model field is extracted and displayed as "Model: Opus/Sonnet/Haiku".
If no model field exists, display "Model: [not set]".

## Output

After sync:
```
Sync Complete

Files modified:
- sheets/custom-skills.html (3 added, 1 removed)
- sheets/custom-agents.html (2 added, 1 changed)

Build output:
- javascripts/main.js (175 KB, 27 sheets)

Committed: "chore: sync 5 skills, 3 agents (Jan 14, 2026)"
```

$ARGUMENTS
