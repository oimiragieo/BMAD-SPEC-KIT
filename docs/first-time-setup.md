# BMAD First-Time Setup Walkthrough

A step-by-step guide to get you from zero to running your first BMAD workflow in 15 minutes.

---

## Prerequisites

Before starting, ensure you have:

- ✅ **Node.js v20+** installed ([Download](https://nodejs.org))
  ```bash
  node --version  # Should show v20.0.0 or higher
  ```
- ✅ **A project directory** (or create one):
  ```bash
  mkdir my-project
  cd my-project
  ```
- ✅ **An IDE** (Claude Code, Cursor, VS Code, Windsurf, or [others](./ide-info/))

---

## Step 1: Installation (3 minutes)

### 1.1 Navigate to Your Project

Open your terminal in your project directory:

```bash
cd /path/to/your/project
```

**Important**: BMAD installs into the **current directory**, so make sure you're in the right place!

### 1.2 Run the Installer

```bash
npx bmad-method@alpha install
```

### 1.3 Answer the Installation Questions

The installer will ask you:

**Question 1: What would you like to do?**
- Choose: `Install BMAD to new project` (or `Update existing installation`)

**Question 2: Select modules to install**
- For software development: Select `BMM`
- For game development: Also select `BMGD`
- For custom agents: Also select `BMB`
- For creative workflows: Also select `CIS`

**Recommended for first time**: Select `BMM` only (you can add more later)

**Question 3: Your name**
- Enter your name (agents will use this when addressing you)

**Question 4: Communication language**
- Select your preferred language (English recommended for documentation)

**Question 5: IDE selection**
- Choose your IDE from the list
- This configures IDE-specific integrations

**Question 6: Folder name**
- Press Enter for default (`bmad`)
- Or enter custom name (e.g., `.bmad` for hidden folder)

### 1.4 Installation Complete

You should see:

```
✨ Installation complete!
BMAD Core and Selected Modules have been installed to: /your/project/bmad
```

**What was created:**

```
your-project/
├── bmad/                    # ← BMAD installation
│   ├── core/               # Core framework
│   ├── bmm/                # BMad Method module
│   └── _cfg/               # Your configurations
├── .claude/                # (if using Claude Code)
│   └── commands/bmad/      # Slash commands
└── docs/                   # (created during workflows)
```

---

## Step 2: Verify Installation (2 minutes)

### 2.1 Check Files Exist

```bash
# Check BMAD folder
ls bmad/
# Should show: core/ bmm/ _cfg/

# Check IDE integration (example for Claude Code)
ls .claude/commands/bmad/
# Should show agent and workflow files
```

### 2.2 Open Your IDE

**Claude Code:**
1. Open Claude Code in your project directory
2. Type `/` to open command palette
3. Type `/bmad` - you should see BMAD commands autocomplete

**Cursor:**
1. Open Cursor in your project
2. Open Composer
3. Type `@bmad` - should see BMAD rules

**VS Code:**
1. Open VS Code
2. Open Copilot Chat
3. Click mode selector - should see BMAD modes

**Windsurf:**
1. Open Windsurf
2. Check Workflows menu - should see BMAD workflows

### 2.3 Troubleshooting

**If commands don't appear:**
1. Restart your IDE
2. Check [Troubleshooting Guide](./troubleshooting.md)
3. Verify installation directory is correct

---

## Step 3: Load Your First Agent (2 minutes)

### 3.1 Start a New Chat

**Important**: Always use a **fresh chat** for each workflow.

**How to start fresh chat:**
- **Claude Code**: Click "New Chat" or press Cmd/Ctrl + Shift + N
- **Cursor**: Start new Composer session
- **VS Code**: Clear chat or start new
- **Windsurf**: Start new workflow

### 3.2 Load the Analyst Agent

**Why Analyst?** This agent runs `workflow-init`, which sets up your project workflow.

**Claude Code:**
```
/bmad:bmm:agents:analyst
```

**Cursor:**
```
@bmad/bmm/agents/analyst
```

**VS Code (Copilot):**
- Click mode selector
- Choose "BMM Analyst"

**Windsurf:**
- Start workflow: `bmm-analyst`

### 3.3 Wait for the Menu

After loading, the agent should display a menu:

```
🔍 BMad Analyst

Available Workflows:
1. workflow-init - Initialize project workflow
2. brainstorm-project - Brainstorm project ideas
3. research - Research and analysis
...

What would you like to do?
```

**If no menu appears:**
- Wait a few seconds
- Ask: "Show me your menu"
- See [Troubleshooting: Agent Menu Doesn't Appear](./troubleshooting.md#agent-menu-doesnt-appear)

---

## Step 4: Run workflow-init (5 minutes)

### 4.1 Start the Workflow

Tell the agent to run workflow-init using **any** of these methods:

**Option 1 - Natural language:**
```
Run workflow-init
```

**Option 2 - Shortcut:**
```
*workflow-init
```

**Option 3 - Menu number:**
```
1
```

### 4.2 Answer the Questions

The agent will ask about your project:

**Question 1: Describe your project**
- Explain what you're building
- Include: purpose, key features, who it's for
- Example: "A task management web app for teams with real-time collaboration"

**Question 2: Existing codebase?**
- **New project**: Say "no" or "greenfield"
- **Existing code**: Say "yes" and describe current state

**Question 3: Project size/complexity**
- **Small/simple**: Bug fix, small feature
- **Medium**: New product feature, MVP
- **Large/complex**: Full product, platform

### 4.3 Review the Recommendation

The agent will recommend a **planning track**:

**Quick Flow Track:**
- Fast implementation with tech-spec only
- For: Bug fixes, simple features, clear scope
- Documents: Tech spec, simple stories

**BMad Method Track:**
- Full planning with PRD, architecture, UX
- For: Products, platforms, complex features
- Documents: PRD, architecture, stories

**Enterprise Method Track:**
- Extended planning with security, DevOps, testing
- For: Enterprise systems, compliance needs
- Documents: PRD, architecture, security plan, DevOps plan

**What to do:**
- Review the recommendation
- Confirm or adjust based on your needs

### 4.4 Workflow Complete

After confirming, `workflow-init` creates:

```
docs/
└── bmm-workflow-status.yaml  # ← Tracks your progress
```

You'll see confirmation:
```
✅ Workflow initialization complete!
Next step: Run *workflow-status to see what's next
```

---

## Step 5: Check Your Next Steps (1 minute)

### 5.1 Start Another Fresh Chat

**Remember**: One workflow = one fresh chat

### 5.2 Load Any Agent

Any agent can run `workflow-status`:

```
/bmad:bmm:agents:pm
```

### 5.3 Check Status

```
*workflow-status
```

The agent will show:

```
📊 Current Status: Phase 1 (Analysis)

Phase 1 workflows:
  ○ brainstorm-project - OPTIONAL
  ○ research - OPTIONAL
  ○ product-brief - RECOMMENDED

Next REQUIRED workflow:
  ⚠️ PRD (Phase 2) - Product Requirements Document
     Agent: PM
     Command: *prd
```

### 5.4 Follow the Guidance

**Understanding the indicators:**
- ○ **Optional** - Can skip, helpful but not required
- 💡 **Recommended** - Strongly suggested, improves results
- ⚠️ **Required** - Must complete before moving forward
- ✅ **Complete** - Already done

**What to do next:**
1. Decide if you want to do optional/recommended workflows
2. When ready, run the next required workflow
3. Use fresh chat for each workflow

---

## Step 6: Run Your First Real Workflow (Variable time)

### Example: Creating a PRD

**6.1 Start fresh chat and load PM agent:**
```
/bmad:bmm:agents:pm
```

**6.2 Run the PRD workflow:**
```
*prd
```

**6.3 Follow the interactive process:**
- Agent will ask questions about requirements
- Provide detailed answers
- Agent generates PRD.md in your docs/ folder

**6.4 Review the output:**
```bash
cat docs/PRD.md
```

**6.5 Continue:**
- Run `*workflow-status` again
- See what's next (usually architecture or stories)
- Repeat process

---

## Understanding BMAD Workflows

### The Workflow Cycle

```
1. Check status → 2. Start fresh chat → 3. Load agent →
4. Run workflow → 5. Review output → 6. Repeat
```

### Key Concepts

**Fresh Chat = One Workflow:**
- Each workflow needs dedicated conversation
- Prevents context pollution
- Ensures best results

**Phases:**
- **Phase 1**: Analysis (optional brainstorming, research)
- **Phase 2**: Planning (PRD, tech spec, or GDD)
- **Phase 3**: Solutioning (architecture, UX)
- **Phase 4**: Implementation (stories, sprints)

**Planning Tracks:**
Different projects need different planning depth. BMAD adapts to your needs.

**Agent Roles:**
- **PM**: Creates requirements and specs
- **Analyst**: Initial analysis and workflow setup
- **Architect**: System design
- **SM**: Story management and sprint planning
- **DEV**: Implementation
- **TEA**: Test strategy
- **UX Designer**: User experience
- **Tech Writer**: Documentation

---

## Tips for Success

### Do's ✅

- ✅ **Always use fresh chat** for each workflow
- ✅ **Check workflow-status** regularly
- ✅ **Follow the phases** in order
- ✅ **Provide detailed context** to agents
- ✅ **Review generated documents** before moving on
- ✅ **Ask questions** - agents are helpful guides

### Don'ts ❌

- ❌ **Don't reuse chats** across workflows
- ❌ **Don't skip required workflows**
- ❌ **Don't rush** - quality planning saves time later
- ❌ **Don't ignore agent warnings**
- ❌ **Don't expect perfection** - review and iterate

### Best Practices

**1. Be specific in answers:**
```
Bad:  "A web app"
Good: "A React-based task management SaaS for remote teams,
       with real-time updates via WebSockets"
```

**2. Review before accepting:**
- Read generated PRD, architecture, etc.
- Make sure it matches your vision
- Ask agent to revise if needed

**3. Keep context documents:**
- Save PRD, architecture, workflow-status
- Commit to version control
- Reference in later workflows

**4. Use workflow-status as your guide:**
- It knows the right order
- Shows dependencies
- Prevents missing steps

---

## Next Steps

### Learn More

- **[BMM Quick Start Guide](../src/modules/bmm/docs/quick-start.md)** - Detailed methodology
- **[BMM Workflows Guide](../src/modules/bmm/workflows/README.md)** - All 30+ workflows explained
- **[Agents Guide](../src/modules/bmm/docs/agents-guide.md)** - Meet each agent
- **[Scale Adaptive System](../src/modules/bmm/docs/scale-adaptive-system.md)** - Understanding planning tracks

### Get Help

- **[Troubleshooting Guide](./troubleshooting.md)** - Common issues
- **[Discord Community](https://discord.gg/gk8jAdXWmj)** - Ask questions
- **[GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)** - Report bugs
- **[YouTube Channel](https://www.youtube.com/@BMadCode)** - Video tutorials

### Explore Advanced Features

- **[Agent Customization](./agent-customization-guide.md)** - Personalize agents
- **[Document Sharding](./document-sharding-guide.md)** - Optimize large docs
- **[Party Mode](../src/modules/bmm/docs/party-mode.md)** - Multi-agent collaboration
- **[Web Bundles](./web-bundles-gemini-gpt-guide.md)** - Use without installation

---

## Quick Reference Card

**Common Commands:**
```bash
# Check what to do next
*workflow-status

# Initialize project
*workflow-init

# Create requirements
*prd              # Full PRD
*tech-spec        # Simple spec

# Design
*create-architecture

# Implementation
*dev-story
```

**Remember:**
- 🔄 Fresh chat for each workflow
- 📊 Check workflow-status often
- 💬 Ask agents questions
- 📝 Review all generated docs
- 🎯 Follow the phases in order

---

**Congratulations! You're ready to start building with BMAD! 🎉**

**Last Updated**: 2025-11-17
**Version**: v6-alpha.8
