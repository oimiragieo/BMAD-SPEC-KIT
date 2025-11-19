# Source Directory - BMAD Core and Modules

This directory contains all source code for BMAD's core framework and loadable modules.

---

## Directory Structure

```
src/
├── core/                 # Core framework (required)
│   ├── agents/           # Core agents
│   ├── workflows/        # Core workflows
│   ├── tasks/            # Executable tasks
│   ├── tools/            # Utility tools
│   └── _module-installer/ # Core installation config
├── modules/              # Loadable modules
│   ├── bmm/              # BMad Method (software development)
│   ├── bmgd/             # BMad Game Development
│   ├── cis/              # Creative Intelligence Suite
│   └── bmb/              # BMad Builder
└── utility/              # Shared utilities
    ├── models/           # Agent models and fragments
    │   └── fragments/    # XML activation blocks
    └── templates/        # Reusable templates
```

---

## Core Framework (`core/`)

### Purpose

Foundation layer providing:

- **BMad Master** agent (orchestrator)
- Party mode (multi-agent collaboration)
- Brainstorming workflow (shared by all modules)
- Core tasks and tools
- Installation infrastructure

### Structure

```
core/
├── agents/
│   ├── bmad-master.agent.yaml      # Main orchestrator agent
│   └── bmad-web-orchestrator.agent.xml # Web bundle version
├── workflows/
│   ├── party-mode/                 # Multi-agent collaboration
│   │   ├── workflow.yaml
│   │   └── instructions.md
│   └── brainstorming/              # Shared brainstorming workflow
│       ├── workflow.yaml
│       ├── instructions.md
│       ├── template.md
│       └── README.md
├── tasks/                          # Executable task templates
├── tools/                          # Utility tools
├── config.yaml                     # Core configuration template
└── _module-installer/
    ├── install-config.yaml         # Core installation config
    └── installer.js                # Custom install logic
```

### BMad Master Agent

**File:** `agents/bmad-master.agent.yaml`

**Role:** Master orchestrator, knowledge custodian, and workflow router

**Key Capabilities:**

- List all available tasks and workflows
- Launch party mode for multi-agent collaboration
- Provide guidance on BMAD usage
- Reference manifests for dynamic resource loading

**Menu:**

- `list-tasks` - Show all available tasks
- `list-workflows` - Show all workflows
- `party-mode` - Start multi-agent collaboration

### Party Mode

**Location:** `workflows/party-mode/`

**Purpose:** Enable all installed agents to collaborate on a problem

**How It Works:**

1. Load all agents from agent-manifest.csv
2. Create virtual "meeting room"
3. Facilitate group discussion
4. Synthesize insights

**Usage:** Load any agent, run `*party-mode`

### Brainstorming Workflow

**Location:** `workflows/brainstorming/`

**Purpose:** Shared creative ideation workflow used by CIS module

**Features:**

- 36+ brainstorming techniques
- 7 categories (collaborative, structured, creative, deep, theatrical, wild, introspective)
- Master facilitation with "Yes, and..." methodology
- Selection modes: user-selected, AI-recommended, random, progressive

---

## Modules

### BMM - BMad Method (`modules/bmm/`)

**Full Documentation:** [bmm/docs/README.md](./modules/bmm/docs/README.md)

**Purpose:** AI-driven agile software development

**Agents (8):**

- PM (Product Manager)
- Analyst (Business Analyst)
- Architect (Solution Architect)
- SM (Scrum Master)
- DEV (Developer)
- TEA (Test Architect)
- UX Designer
- Technical Writer

**Workflows:** 34+ across 4 phases

**Phases:**

1. **Analysis** (optional) - Brainstorming, research, product brief
2. **Planning** (required) - PRD, Tech-spec, GDD (scale-adaptive)
3. **Solutioning** (Level 3-4) - Architecture, security, DevOps
4. **Implementation** (iterative) - Story-centric development

**Scale-Adaptive Tracks:**

- **Quick Flow** (Level 0-1): Bug fixes, small features
- **BMad Method** (Level 2): Products and platforms
- **Enterprise** (Level 3-4): Extended planning + compliance

**Key Directories:**

```
bmm/
├── agents/               # 8 agents
├── workflows/            # 34+ workflows
│   ├── 1-analysis/
│   ├── 2-plan-workflows/
│   ├── 3-solutioning/
│   ├── 4-implementation/
│   ├── testarch/         # Testing workflows
│   ├── document-project/ # Brownfield documentation
│   └── workflow-status/  # Workflow routing
├── teams/                # Pre-configured teams
├── testarch/             # Testing knowledge base
│   └── knowledge/        # 20+ test patterns
├── docs/                 # Complete user documentation
├── sub-modules/          # IDE-specific enhancements
│   └── claude-code/
│       ├── sub-agents/   # 10+ specialized subagents
│       └── injections.yaml
└── _module-installer/
    ├── install-config.yaml
    ├── installer.js
    ├── assets/
    │   ├── bmm-kb.md     # BMM knowledge base
    │   └── technical-decisions.md
    └── platform-specifics/ # IDE customizations
```

### BMGD - BMad Game Development (`modules/bmgd/`)

**Full Documentation:** [bmgd/README.md](./modules/bmgd/README.md)

**Purpose:** Game development from concept to production

**Agents (4):**

- Game Designer
- Game Developer
- Game Architect
- Game Scrum Master

**Workflows:** 20+ across 4 phases

**Phases:**

1. **Preproduction** - Concept, brainstorming, game brief
2. **Design** - GDD, narrative design
3. **Technical** - Game architecture, technical specs
4. **Production** - Sprint-based implementation (uses BMM workflows)

**Game Types Supported:** 24 templates (RPG, platformer, puzzle, strategy, etc.)

**Key Directories:**

```
bmgd/
├── agents/               # 4 game dev agents
├── workflows/
│   ├── 1-preproduction/
│   ├── 2-design/
│   │   └── gdd/
│   │       └── game-types/ # 24 game type templates
│   ├── 3-technical/
│   └── 4-production/     # Reuses BMM implementation workflows
├── teams/
│   └── team-gamedev.yaml # Pre-configured game dev team
└── _module-installer/
    └── install-config.yaml
```

### CIS - Creative Intelligence Suite (`modules/cis/`)

**Full Documentation:** [cis/workflows/README.md](./modules/cis/workflows/README.md)

**Purpose:** Innovation and creative facilitation

**Agents (5):**

- Brainstorming Coach
- Design Thinking Coach
- Creative Problem Solver
- Innovation Strategist
- Storyteller

**Workflows (5):**

1. **Brainstorming** - 36 techniques across 7 categories
2. **Design Thinking** - Human-centered design (Empathize → Define → Ideate → Prototype → Test)
3. **Problem Solving** - TRIZ, Theory of Constraints, Systems Thinking
4. **Innovation Strategy** - Jobs-to-be-Done, Blue Ocean Strategy
5. **Storytelling** - Hero's Journey, Three-Act Structure, Story Brand (25 frameworks)

**Key Features:**

- Interactive facilitation (AI guides, doesn't generate)
- Technique libraries (CSV databases)
- Context integration (optional document input)
- Energy monitoring (adaptive pacing)

**Key Directories:**

```
cis/
├── agents/               # 5 creative facilitators
├── workflows/            # 5 creative workflows
│   ├── design-thinking/
│   ├── innovation-strategy/
│   ├── problem-solving/
│   └── storytelling/
├── teams/
│   └── creative-squad.yaml
└── _module-installer/
    └── install-config.yaml
```

### BMB - BMad Builder (`modules/bmb/`)

**Full Documentation:** [bmb/README.md](./modules/bmb/README.md)

**Purpose:** Build custom agents, workflows, and modules

**Agent (1):**

- BMad Builder (specialized in creating BMAD artifacts)

**Workflows (11):**

- `create-agent` - Build custom agents
- `create-workflow` - Design guided processes
- `create-module` - Package complete solutions
- `edit-agent` - Modify existing agents
- `edit-workflow` - Update workflows
- `edit-module` - Modify modules
- `module-brief` - Document module purpose
- `convert-legacy` - Migrate old formats
- `redoc` - Regenerate documentation
- `audit-workflow` - Validate workflow structure

**Agent Types:**

1. **Full Module Agent** - Part of complete module with workflows
2. **Hybrid Agent** - Standalone with module-specific workflows
3. **Standalone Agent** - Independent, no module association

**Key Directories:**

```
bmb/
├── agents/
│   └── bmad-builder.agent.yaml
├── workflows/
│   ├── create-agent/
│   │   ├── agent-types.md
│   │   ├── agent-architecture.md
│   │   ├── communication-styles.md
│   │   └── ...
│   ├── create-workflow/
│   │   ├── workflow-creation-guide.md
│   │   └── workflow-template/
│   ├── create-module/
│   │   ├── module-structure.md
│   │   └── installer-templates/
│   └── ...
└── _module-installer/
    └── install-config.yaml
```

---

## Utility (`utility/`)

### Models (`utility/models/`)

**Purpose:** Shared agent models and fragments

#### Fragments (`models/fragments/`)

**XML activation blocks** used in agent compilation:

| File                             | Purpose                                 |
| -------------------------------- | --------------------------------------- |
| `activation-rules.xml`           | Standard activation rules               |
| `activation-steps.xml`           | Standard activation sequence            |
| `handler-action.xml`             | Action command handler                  |
| `handler-exec.xml`               | Executable task handler                 |
| `handler-prompt.xml`             | Prompt handler                          |
| `handler-tmpl.xml`               | Template handler                        |
| `handler-validate-workflow.xml`  | Workflow validation handler             |
| `handler-workflow.xml`           | Workflow execution handler              |
| `handler-run-workflow.xml`       | Workflow runner handler                 |

**Usage:** Loaded by `activation-builder.js` during agent compilation

#### Templates (`utility/templates/`)

**Reusable output templates** for workflows

---

## Module Development Guidelines

### Creating a New Module

1. **Use BMB module:**

```bash
# Load BMad Builder agent
# Run create-module workflow
*create-module
```

2. **Manual creation:**

```bash
mkdir -p src/modules/{module-name}/{agents,workflows,teams}
mkdir -p src/modules/{module-name}/_module-installer
```

3. **Create `install-config.yaml`:**

```yaml
module:
  id: "{module-name}"
  name: "Module Display Name"
  version: "1.0.0"
  description: "Module purpose"
  dependencies:
    - core

  install:
    agents: true
    workflows: true
    tasks: true
    config: true
```

4. **Create agents** in `agents/*.agent.yaml`

5. **Create workflows** in `workflows/`

6. **Write README.md**

7. **Validate:**

```bash
npm run validate:schemas
```

### Module Structure Requirements

**Required Files:**

- `_module-installer/install-config.yaml` - Installation configuration
- `README.md` - Module documentation
- At least one agent in `agents/`

**Optional Files:**

- `_module-installer/installer.js` - Custom install logic
- `_module-installer/assets/` - Module assets (knowledge bases, etc.)
- `_module-installer/platform-specifics/` - IDE customizations
- `config.yaml` - Module runtime configuration
- `teams/*.yaml` - Pre-configured agent teams
- `sub-modules/{ide}/` - IDE-specific enhancements

### Module Dependencies

**Declare in install-config.yaml:**

```yaml
dependencies:
  - core # Always required
  - cis # If using CIS workflows
  - bmm # If extending BMM
```

**Resolution:** Handled by `dependency-resolver.js` during installation

### IDE-Specific Enhancements

**Location:** `{module}/sub-modules/{ide-name}/`

**Example:** BMM Claude Code subagents

```
bmm/sub-modules/claude-code/
├── sub-agents/
│   ├── bmad-analysis/
│   │   ├── api-documenter.md
│   │   ├── codebase-analyzer.md
│   │   ├── data-analyst.md
│   │   └── pattern-detector.md
│   ├── bmad-planning/
│   │   ├── dependency-mapper.md
│   │   ├── epic-optimizer.md
│   │   ├── requirements-analyst.md
│   │   └── ...
│   └── ...
├── injections.yaml       # Injection configuration
├── config.yaml          # Claude Code config
└── readme.md            # Documentation
```

**Injections:**

Define in `injections.yaml`:

```yaml
injections:
  - point: "agent-pm-instructions"
    content: |
      Additional instructions for PM agent when using Claude Code...

subagents:
  files:
    - "sub-agents/bmad-planning/requirements-analyst.md"
    - "sub-agents/bmad-planning/epic-optimizer.md"
```

---

## Agent Development Guidelines

### Agent File Structure

**Required Sections:**

```yaml
agent:
  metadata:       # Required
  persona:        # Required
  menu:           # Required (min 1 item)

  critical_actions: # Optional
  prompts:          # Optional
  webskip:          # Optional
```

### Agent Metadata

**Module Agent:**

```yaml
metadata:
  id: "{bmad_folder}/{module}/agents/{name}.md"
  name: "Display Name"
  title: "Role Title"
  icon: "🎯"
  module: "{module}" # REQUIRED for module agents
```

**Core Agent:**

```yaml
metadata:
  id: "{bmad_folder}/core/agents/{name}.md"
  name: "Display Name"
  title: "Role Title"
  icon: "🎯"
  # NO module field for core agents
```

### Persona Design

```yaml
persona:
  role: "Primary role description"
  identity: "Background, experience, expertise..."
  communication_style: "How agent communicates with user"
  principles:
    - "Core principle 1"
    - "Core principle 2"
    - "Core principle 3 (min 1 required)"
```

### Menu Items

**Workflow:**

```yaml
- trigger: "workflow-name"
  workflow: "{project-root}/{bmad_folder}/{module}/workflows/path/workflow.yaml"
  description: "What this workflow does"
```

**Executable Task:**

```yaml
- trigger: "task-name"
  exec: "{project-root}/{bmad_folder}/core/tasks/task.md"
  description: "What this task does"
```

**Action:**

```yaml
- trigger: "action-name"
  action: "Brief description of what to do"
  description: "Shown in menu"
```

**Template:**

```yaml
- trigger: "template-name"
  tmpl: "{project-root}/{bmad_folder}/utility/templates/template.md"
  description: "Generate from template"
```

### Trigger Naming Rules

**MUST:**

- Use kebab-case: `workflow-init`, `create-prd`
- Start with letter
- Use only lowercase letters, numbers, hyphens

**MUST NOT:**

- Use underscores: `workflow_init` ❌
- Use spaces: `workflow init` ❌
- Use camelCase: `workflowInit` ❌
- Start with number: `1-workflow` ❌
- Start with hyphen: `-workflow` ❌

---

## Workflow Development Guidelines

### Workflow File Structure

**Required Files:**

- `workflow.yaml` - Configuration
- `instructions.md` - Agent instructions

**Optional Files:**

- `template.md` - Output template
- `checklist.md` - Completion checklist
- `README.md` - User documentation
- Additional reference files (data CSVs, knowledge docs, etc.)

### Workflow Configuration

```yaml
name: workflow-name
description: "Brief description"

# Config source (module config file)
config_source: "{project-root}/{bmad_folder}/{module}/config.yaml"

# Reference config values
output_folder: "{config_source}:output_folder"
user_name: "{config_source}:user_name"

# Workflow paths
installed_path: "{project-root}/{bmad_folder}/{module}/workflows/path"
instructions: "{installed_path}/instructions.md"
template: "{installed_path}/template.md"

# Output
default_output_file: "{output_folder}/output-name.md"

# Flags
standalone: true # Can run independently
web_bundle: false # Not for web sharing
```

### Instructions Format

**Good Structure:**

````markdown
# Workflow Name

## Purpose

Brief description of what this workflow accomplishes.

## Prerequisites

- [ ] Requirement 1
- [ ] Requirement 2

## Steps

### Step 1: Initial Setup

1. Action 1
2. Action 2

### Step 2: Main Process

1. Action 1
2. Action 2

### Step 3: Finalization

1. Action 1
2. Output creation using template

## Output

Create file at: `{default_output_file}`

Use template: `{template}`

## Validation

- [ ] Check 1
- [ ] Check 2
````

---

## Testing

### Validate Agents

```bash
# All agents
npm run validate:schemas

# Specific agent
node -e "
const { validateAgentFile } = require('./tools/schema/agent');
const yaml = require('js-yaml');
const fs = require('fs');
const content = fs.readFileSync('./src/modules/bmm/agents/pm.agent.yaml', 'utf8');
const result = validateAgentFile('./src/modules/bmm/agents/pm.agent.yaml', yaml.load(content));
console.log(result.success ? 'Valid' : result.error.issues);
"
```

### Compile Agent

```bash
node tools/cli/commands/build.js {agent-name}
```

### Test Workflow

1. Install BMAD locally
2. Load appropriate agent
3. Run workflow trigger
4. Verify output

---

## Common Tasks

### Add New Agent to Existing Module

1. Create `agents/{name}.agent.yaml`
2. Validate: `npm run validate:schemas`
3. Test compile: `node tools/cli/commands/build.js {name}`

### Add New Workflow to Existing Module

1. Create directory: `workflows/phase-X/{name}/`
2. Create `workflow.yaml`, `instructions.md`, `template.md`
3. Add to agent menu
4. Validate: `npm run validate:schemas`

### Add Subagent for Claude Code

1. Create `sub-modules/claude-code/sub-agents/category/{name}.md`
2. Add to `sub-modules/claude-code/injections.yaml`
3. Test installation with Claude Code selected

---

## References

- **Main Codebase Guide:** [../claude.md](../claude.md)
- **BMM Documentation:** [modules/bmm/docs/README.md](./modules/bmm/docs/README.md)
- **Agent Schema:** [../tools/schema/agent.js](../tools/schema/agent.js)
- **Installation System:** [../tools/cli/installers/](../tools/cli/installers/)

---

**For tool documentation, see [../tools/claude.md](../tools/claude.md)**
