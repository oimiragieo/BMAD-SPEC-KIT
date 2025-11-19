# BMAD Method - Claude Code Instructions

## Overview

BMAD agents integrate seamlessly with Claude Code through slash commands. After installation, agents are available as commands in `.claude/commands/bmad/`.

## Activating Agents

### Quick Start

1. **Open Claude Code** in your project
2. **Type `/`** to see available commands
3. **Type `/bmad`** to filter to BMAD commands
4. **Select an agent** from the autocomplete list
5. **Press Enter** to activate the agent

### What Happens After Activation

When you activate an agent:

1. The agent persona loads with specialized expertise
2. An **interactive menu appears** showing available workflows
3. You can select workflows by:
   - **Number**: "Run option 2"
   - **Shortcut**: `*workflow-init`
   - **Natural language**: "Let's create a PRD"

### Command Format

BMAD uses hierarchical slash commands:

```
/bmad:{module}:{type}:{name}
```

**Examples:**

```
/bmad:bmm:agents:dev          - Load Developer agent
/bmad:bmm:agents:architect    - Load Architect agent
/bmad:bmm:agents:pm           - Load Product Manager agent
/bmad:bmm:workflows:prd       - Run PRD workflow directly
/bmad:core:workflows:party-mode - Start multi-agent collaboration
```

### Common Workflows

After loading an agent, common workflows you'll use:

**Initial Setup:**

- `*workflow-init` - Initialize your project workflow (run first!)
- `*workflow-status` - Check what to do next

**Planning:**

- `*prd` - Create Product Requirements Document
- `*tech-spec` - Create technical specification
- `*create-architecture` - Design system architecture

**Implementation:**

- `*dev-story` - Implement a user story
- `*test-story` - Create tests for a story

## Important: Fresh Chats

**Always use a fresh chat for each workflow** to avoid context limitations and hallucinations.

**How to start a fresh chat in Claude Code:**

1. Click the "New Chat" button, OR
2. Use keyboard shortcut (Cmd/Ctrl + Shift + N)

**Why this matters:**

- Prevents context overload from previous conversations
- Ensures agent has full attention on current workflow
- Avoids confusion from mixed contexts

## Troubleshooting

### Commands Don't Appear

If BMAD commands aren't showing up:

1. **Verify installation**:
   - Check that `.claude/commands/bmad/` directory exists
   - Confirm files exist in this directory

2. **Restart Claude Code**:
   - Close and reopen Claude Code
   - Sometimes the command cache needs refreshing

3. **Re-run installation**:
   ```bash
   npx bmad-method@alpha install
   ```

### Agent Doesn't Load Menu

If the agent loads but doesn't show the menu:

1. Try asking: "Show me your menu" or "What workflows are available?"
2. Ensure you started a fresh chat
3. The agent may still be loading - wait a moment

### Workflow Returns Errors

If a workflow fails:

1. **Check workflow status**: Type `*workflow-status`
2. **Verify prerequisites**: Some workflows require prior workflows to complete first
3. **Start fresh chat**: Context may be confused
4. **Check documentation**: See [BMM Workflows Guide](../../src/modules/bmm/workflows/README.md)

## Tips & Best Practices

### For Best Results

1. **One workflow per chat** - Start fresh for each workflow
2. **Follow the phases** - Use `*workflow-status` to know what's next
3. **Be specific** - Provide clear requirements and context
4. **Review output** - Agents are experts but verify their suggestions

### Keyboard Shortcuts

- **New Chat**: Cmd/Ctrl + Shift + N
- **Command Palette**: Cmd/Ctrl + Shift + P (then type "BMAD")

### Quick Reference

**Module Prefixes:**

- `bmad:bmm` - BMad Method (software development)
- `bmad:bmgd` - BMad Game Development
- `bmad:bmb` - BMad Builder (create custom agents)
- `bmad:cis` - Creative Intelligence Suite
- `bmad:core` - Core system (BMad Master, party-mode)

## See Also

- [BMM Quick Start Guide](../../src/modules/bmm/docs/quick-start.md) - Step-by-step getting started
- [BMM Workflows Guide](../../src/modules/bmm/workflows/README.md) - All available workflows
- [Agent Customization Guide](../agent-customization-guide.md) - Customize agent personalities
- [Document Sharding Guide](../document-sharding-guide.md) - Optimize large documents

## Need Help?

- **Discord**: [Join the BMad Community](https://discord.gg/gk8jAdXWmj)
- **Issues**: [GitHub Issue Tracker](https://github.com/bmad-code-org/BMAD-METHOD/issues)
- **YouTube**: [BMad Code Channel](https://www.youtube.com/@BMadCode)
