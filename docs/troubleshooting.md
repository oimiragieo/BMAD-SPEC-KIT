# BMAD Troubleshooting Guide

Common issues and solutions for BMAD Core, BMM, BMGD, BMB, and CIS modules.

---

## Table of Contents

- [Installation Issues](#installation-issues)
- [Agent Loading Issues](#agent-loading-issues)
- [Workflow Execution Issues](#workflow-execution-issues)
- [IDE Integration Issues](#ide-integration-issues)
- [Configuration Issues](#configuration-issues)
- [General Questions](#general-questions)

---

## Installation Issues

### Installation Fails or Hangs

**Symptoms:**
- `npx bmad-method@alpha install` fails
- Installation hangs at a specific step
- Error messages about missing dependencies

**Solutions:**

1. **Check Node.js version**:
   ```bash
   node --version
   ```
   Required: Node.js v20+ (see package.json)

2. **Clear npm cache**:
   ```bash
   npm cache clean --force
   npx clear-npx-cache
   ```

3. **Use specific version**:
   ```bash
   npx bmad-method@6.0.0-alpha.8 install
   ```

4. **Check network connection**:
   - Ensure you're not behind a restrictive firewall
   - Try using a different network

### {bmad_folder} Created in Wrong Location

**Symptoms:**
- BMAD folder appears in unexpected directory
- Can't find the installed files

**Solutions:**

1. **Check current directory before installation**:
   ```bash
   pwd  # or 'cd' on Windows
   ```
   Installation creates `{bmad_folder}/` in the current directory

2. **Move to project root** before installing:
   ```bash
   cd /path/to/your/project
   npx bmad-method@alpha install
   ```

3. **If installed in wrong place**, you can:
   - Delete the folder and reinstall from correct location
   - Or move the entire `{bmad_folder}/` to your project root

### Modules Missing After Installation

**Symptoms:**
- Only some modules installed (e.g., BMM but not BMGD)
- Expected agents or workflows don't appear

**Solutions:**

1. **Re-run installer** and select additional modules:
   ```bash
   npx bmad-method@alpha install
   ```
   Installer will detect existing installation and offer to add modules

2. **Check installation summary**:
   - Installer shows which modules were selected
   - Verify you selected all desired modules

3. **Verify module directories exist**:
   ```bash
   ls {bmad_folder}/
   ```
   Should show: `core/`, `bmm/`, `bmgd/`, `bmb/`, `cis/`, `_cfg/`

---

## Agent Loading Issues

### Agents Don't Appear in IDE

**Symptoms:**
- Can't find BMAD commands/agents in IDE
- Slash commands don't autocomplete
- No BMAD menu appears

**Solutions:**

1. **Verify installation location**:
   - Check that `{bmad_folder}/` exists in your project
   - IDE must be opened in the same directory (or parent)

2. **Restart your IDE**:
   - Close completely and reopen
   - Command caches may need refreshing

3. **Check IDE-specific installation**:
   - **Claude Code**: Verify `.claude/commands/bmad/` exists
   - **Cursor**: Check `.cursor/rules/bmad/`
   - **Windsurf**: Look for `.windsurf/workflows/`
   - **VS Code**: Confirm `.github/chatmodes/` (with Copilot)

4. **Re-build agents**:
   ```bash
   cd {bmad_folder}
   npx bmad-method@alpha build
   ```

### Agent Menu Doesn't Appear

**Symptoms:**
- Agent loads but doesn't show workflow menu
- Just see "agent loaded" but no options

**Solutions:**

1. **Wait a moment** - Agent may still be initializing

2. **Ask directly**: "Show me your menu" or "What workflows are available?"

3. **Start fresh chat**:
   - Create a new conversation
   - Load the agent again

4. **Try different agent**:
   - Some agents have different menu formats
   - Try loading BMad Master first: `/bmad:core:agents:bmad-master`

### Wrong Agent Loads

**Symptoms:**
- Selected one agent but different one appears
- Agent behavior doesn't match expectations

**Solutions:**

1. **Verify command**:
   ```
   /bmad:bmm:agents:dev     ✅ Correct
   /bmad-dev                ❌ May be ambiguous
   ```

2. **Start fresh chat** - Context from previous conversation may interfere

3. **Check agent customization**:
   - If you've customized agents in `_cfg/agents/`
   - Verify overrides are correct

---

## Workflow Execution Issues

### "workflow-init" Command Not Found

**Symptoms:**
- `*workflow-init` returns "command not found"
- Workflow doesn't start

**Solutions:**

1. **Load an agent first**:
   - Shortcuts like `*workflow-init` only work after loading an agent
   - Try: `/bmad:bmm:agents:analyst` then `*workflow-init`

2. **Use full path**:
   ```
   /bmad:bmm:workflows:workflow-status:init
   ```

3. **Check workflow-status**:
   ```
   *workflow-status
   ```
   Confirms workflow system is working

### Workflow Returns Errors or Fails

**Symptoms:**
- Workflow starts but encounters errors
- Agent seems confused or gives wrong output

**Solutions:**

1. **Use fresh chat** (most common issue):
   - **Critical**: Start new conversation for each workflow
   - Old context causes hallucinations and errors

2. **Check prerequisites**:
   - Run `*workflow-status` to see required previous workflows
   - Some workflows require earlier phases to complete

3. **Verify project structure**:
   - Workflow expects certain files/folders
   - Check that `docs/` folder exists (or configured location)

4. **Review workflow documentation**:
   - [BMM Workflows Guide](../src/modules/bmm/workflows/README.md)
   - Each workflow has specific requirements

### Workflow Creates Files in Wrong Location

**Symptoms:**
- PRD.md appears in unexpected folder
- Can't find generated documents

**Solutions:**

1. **Check config.yaml**:
   ```yaml
   # {bmad_folder}/core/config.yaml
   output_folder: "docs"  # or your custom location
   ```

2. **Verify current directory**:
   - Workflow creates files relative to project root
   - Ensure IDE opened in correct directory

3. **Search for the file**:
   ```bash
   find . -name "PRD.md"
   ```

---

## IDE Integration Issues

### Claude Code: Commands Don't Autocomplete

**Solutions:**

1. Restart Claude Code
2. Type `/bmad` slowly - let autocomplete catch up
3. Check `.claude/commands/bmad/` directory exists
4. Re-run installation

### Cursor: @bmad Reference Doesn't Work

**Solutions:**

1. Verify `.cursor/rules/bmad/` exists
2. Use full path: `@{bmad_folder}/bmm/agents/dev`
3. Check that rules are "Manual" type (not auto-loaded)
4. Restart Cursor

### Windsurf: Workflows Don't Appear in Menu

**Solutions:**

1. Check `.windsurf/workflows/` directory
2. Verify workflow files end in `.md`
3. Restart Windsurf
4. Check workflow `auto_execution_mode` setting

### VS Code/Copilot: No BMAD Modes

**Solutions:**

1. **Verify GitHub Copilot** is installed and active
2. Check `.github/chatmodes/` exists
3. Restart VS Code
4. Open Copilot Chat and check mode selector dropdown

---

## Configuration Issues

### Can't Find config.yaml

**Location:**
```
{bmad_folder}/core/config.yaml
```

**If missing:**
```bash
# Re-run installation
npx bmad-method@alpha install
```

### Agent Customizations Not Working

**Symptoms:**
- Modified agent in `_cfg/agents/` but changes don't appear
- Agent still uses default personality

**Solutions:**

1. **Rebuild agents**:
   ```bash
   npx bmad-method@alpha build
   ```

2. **Check file naming**:
   - Must match: `{agent-id}.override.yaml`
   - Example: `dev.override.yaml`

3. **Verify YAML syntax**:
   - Use YAML validator: https://www.yamllint.com/
   - Check indentation (2 spaces, not tabs)

4. **See**: [Agent Customization Guide](./agent-customization-guide.md)

### Wrong Language in Responses

**Symptoms:**
- Agent responds in unexpected language
- Mix of languages in output

**Solutions:**

1. **Check config.yaml**:
   ```yaml
   communication_language: "English"
   output_language: "English"
   ```

2. **Module-specific override**:
   - Check `{bmad_folder}/bmm/_module-installer/config.yaml`
   - Module settings override global

3. **Rebuild after changing**:
   ```bash
   npx bmad-method@alpha build
   ```

---

## General Questions

### What Does {bmad_folder} Mean?

`{bmad_folder}` is a **placeholder** for your actual folder name:

- **Default**: `bmad` (no dot prefix)
- **Customizable**: You choose during installation
- **Example paths**:
  - `/my-project/bmad/`
  - `/my-project/.bmad/`
  - `/my-project/custom-name/`

**In Documentation**: When you see `{bmad_folder}`, replace it with your actual folder name.

### What is a "Fresh Chat"?

**Fresh chat** = New conversation with no previous context

**Why it matters:**
- AI models have context limits
- Previous conversations create "noise"
- Fresh start = better, more accurate results

**How to start fresh chat:**
- **Claude Code**: Click "New Chat" or Cmd/Ctrl + Shift + N
- **Cursor**: Start new composer session
- **Windsurf**: New workflow execution
- **VS Code/Copilot**: Clear chat or start new conversation

**Rule of thumb**: **One workflow = one fresh chat**

### How Do I Know What Workflow to Run Next?

**Use workflow-status**:
```
*workflow-status
```

This shows:
- Current phase
- Completed workflows ✅
- Next required workflow ⚠️
- Optional/recommended workflows 💡

### Can I Use Multiple Agents at Once?

**Yes!** Use **Party Mode**:
```
/bmad:core:workflows:party-mode
```

This activates **multi-agent collaboration** where all available agents work together on your request.

**Perfect for:**
- Strategic decisions
- Complex planning
- Cross-functional tasks
- Getting diverse perspectives

### How Do I Upgrade from v4 to v6?

See the [v4 to v6 Upgrade Guide](./v4-to-v6-upgrade.md) for complete instructions.

**Quick summary:**
1. Backup your v4 installation
2. Run v6 installer
3. Installer auto-detects v4 and migrates settings
4. Review changes and update workflows

---

## Still Need Help?

### Community Support

- **Discord**: [Join the BMad Community](https://discord.gg/gk8jAdXWmj)
  - #general-dev - Technical questions
  - #bugs-issues - Bug reports
  - Active community members ready to help

### File an Issue

- **GitHub**: [Issue Tracker](https://github.com/bmad-code-org/BMAD-METHOD/issues)
  - Bug reports
  - Feature requests
  - Documentation improvements

**When filing an issue, include:**
1. BMAD version (`package.json` → `version`)
2. Node.js version (`node --version`)
3. IDE and version
4. Steps to reproduce
5. Error messages (full text)
6. What you expected vs. what happened

### Video Tutorials

- **YouTube**: [BMad Code Channel](https://www.youtube.com/@BMadCode)
  - Installation walkthroughs
  - Workflow demonstrations
  - Tips and best practices

---

## Quick Diagnostic Checklist

Before asking for help, verify:

- [ ] Node.js v20+ installed
- [ ] Ran installation from project root
- [ ] `{bmad_folder}/` directory exists
- [ ] IDE restarted after installation
- [ ] Using fresh chat for workflows
- [ ] Checked workflow-status
- [ ] Reviewed relevant documentation
- [ ] Searched existing GitHub issues

---

**Last Updated**: 2025-11-17
**Version**: v6-alpha.8
