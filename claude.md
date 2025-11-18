# BMAD-METHOD Codebase Guide

**Version:** 6.0.0-alpha.8
**Project:** BMAD Method (Breakthrough Method of Agile AI-driven Development)
**Type:** Universal AI Agent Framework + CLI Tool
**Tech Stack:** Node.js 20+, JavaScript, YAML, Zod validation
**Status:** Alpha (near-beta quality, stable with documentation refinement ongoing)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Directory Structure](#directory-structure)
4. [Core Systems](#core-systems)
5. [Module System](#module-system)
6. [Development Workflow](#development-workflow)
7. [Testing & Quality](#testing--quality)
8. [Key Files Reference](#key-files-reference)
9. [Common Tasks](#common-tasks)

---

## Project Overview

### What is BMAD?

**BMAD-CORE** (Collaboration Optimized Reflection Engine) is a universal human-AI collaboration platform that provides:

- **Agent Orchestration**: 19+ specialized AI personas with domain expertise
- **Workflow Engine**: Guided multi-step processes with built-in best practices
- **Modular Architecture**: Extensible with domain-specific modules
- **IDE Integration**: Works with Claude Code, Cursor, Windsurf, VS Code, and 13+ other IDEs
- **Update-Safe Customization**: User configurations persist through updates

### Modules

The framework includes four primary modules:

1. **BMM** (BMad Method) - AI-driven software development (8 agents, 34+ workflows)
2. **BMGD** (BMad Game Development) - Game creation workflows (4 agents, 20+ workflows)
3. **CIS** (Creative Intelligence Suite) - Innovation & creativity (5 agents, 5 workflows)
4. **BMB** (BMad Builder) - Build custom agents and workflows (1 agent, 11 workflows)

### Philosophy

BMAD doesn't give answers—it helps you **discover better solutions** through guided reflection.

**C.O.R.E. Principles:**

- **C**ollaboration: Human-AI partnership leveraging complementary strengths
- **O**ptimized: Battle-tested processes for maximum effectiveness
- **R**eflection: Strategic questioning that unlocks breakthrough solutions
- **E**ngine: Framework orchestrating specialized agents and workflows

---

## Architecture

### System Layers

```
┌─────────────────────────────────────────────────────────┐
│         CLI Interface (bmad-cli.js)                     │
│  Commands: install | build | list | status | uninstall │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│      Installer System (tools/cli/installers/)           │
│  • Detector (detect existing installations)             │
│  • ModuleManager (install/manage modules)               │
│  • IdeManager (setup IDEs)                              │
│  • ConfigCollector (gather user preferences)            │
│  • ManifestGenerator (track installed artifacts)        │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│      Agent System (tools/cli/lib/)                      │
│  • YAML → XML Compilation (YamlXmlBuilder)             │
│  • Activation Block Injection (ActivationBuilder)       │
│  • Agent Customization (_cfg/agents/*.customize)        │
│  • Agent Schema Validation (Zod)                        │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│      Workflow Engine                                     │
│  • Workflow YAML parsing & status tracking              │
│  • Phase management (1-Analysis → 4-Implementation)     │
│  • Config substitution ({project-root}, etc.)           │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│      IDE Integration Layer                               │
│  • Claude Code (preferred)                               │
│  • Cursor, Windsurf, VS Code, Cline, Roo, etc.         │
│  • Command/Agent generation                             │
│  • Module-specific injections (subagents)               │
└─────────────────────────────────────────────────────────┘
```

### Key Design Patterns

1. **Configuration-Driven**: YAML-based agent and workflow definitions
2. **Placeholder Resolution**: Runtime substitution of `{project-root}`, `{bmad_folder}`, `{user_name}`, etc.
3. **Schema Validation**: Zod schemas ensure data integrity
4. **Manifest System**: CSV manifests track installed components without file hashing
5. **Module Independence**: Each module is self-contained with its own agents, workflows, and config

---

## Directory Structure

```
bmad-method/
├── .github/               # GitHub Actions, issue templates, funding
├── .husky/                # Git hooks (pre-commit)
├── .vscode/               # VS Code workspace settings
├── docs/                  # Project documentation
│   ├── ide-info/          # IDE-specific setup guides (20 IDEs)
│   ├── installers-bundlers/ # Technical reference docs
│   ├── index.md           # Documentation hub
│   └── *.md               # Guides (agent customization, web bundles, etc.)
├── src/                   # Source code
│   ├── core/              # Core framework
│   │   ├── agents/        # Core agents (bmad-master)
│   │   ├── tasks/         # Executable task templates
│   │   ├── tools/         # Utility tools
│   │   ├── workflows/     # Core workflows (party-mode, brainstorming)
│   │   └── _module-installer/ # Core installation config
│   ├── modules/           # Loadable modules
│   │   ├── bmm/           # BMad Method module
│   │   │   ├── agents/    # 8 software dev agents
│   │   │   ├── workflows/ # 34+ workflows across 4 phases
│   │   │   ├── teams/     # Pre-configured agent groups
│   │   │   ├── testarch/  # Testing workflows and knowledge
│   │   │   ├── docs/      # Complete user documentation
│   │   │   ├── sub-modules/ # IDE-specific enhancements
│   │   │   └── _module-installer/ # BMM installation config
│   │   ├── bmgd/          # Game development module
│   │   ├── cis/           # Creative intelligence module
│   │   └── bmb/           # Builder module
│   └── utility/           # Shared utilities
│       ├── models/        # Agent models and fragments
│       │   └── fragments/ # XML activation blocks
│       └── templates/     # Reusable templates
├── test/                  # Test suites
│   ├── fixtures/          # Test fixtures (49 agent schemas)
│   ├── test-agent-schema.js       # Schema validation tests
│   └── test-installation-components.js # Installation tests
├── tools/                 # CLI tools and build system
│   ├── cli/               # Main CLI application
│   │   ├── commands/      # CLI commands (install, build, status, etc.)
│   │   ├── installers/    # Installation system
│   │   │   └── lib/       # Installer core libraries
│   │   │       ├── core/  # Core installation logic
│   │   │       ├── ide/   # IDE-specific handlers
│   │   │       └── modules/ # Module management
│   │   ├── bundlers/      # Web bundler system
│   │   └── lib/           # Shared libraries
│   │       ├── errors.js          # Error handling classes
│   │       ├── logger.js          # Centralized logging
│   │       ├── dependency-validator.js # Dependency validation
│   │       ├── yaml-xml-builder.js # YAML→XML compiler
│   │       ├── activation-builder.js # Activation injection
│   │       ├── config.js          # Configuration management
│   │       └── file-ops.js        # File operations
│   ├── schema/            # Validation schemas
│   │   └── agent.js       # Agent YAML schema (Zod)
│   ├── flattener/         # Codebase flattener utility
│   └── *.js               # Build and validation scripts
├── package.json           # npm package configuration
├── eslint.config.mjs      # ESLint configuration
├── prettier.config.mjs    # Prettier configuration
├── README.md              # Main project README
├── CONTRIBUTING.md        # Contribution guidelines
├── CHANGELOG.md           # Version history
├── CODEBASE_ANALYSIS.md   # Technical analysis (comprehensive)
├── ENHANCEMENT_PLAN.md    # Enhancement roadmap
└── v6-open-items.md       # Pre-beta TODO list
```

---

## Core Systems

### 1. Agent System

#### Agent Definition (YAML)

Agents are defined in `*.agent.yaml` files with strict schema validation:

```yaml
agent:
  metadata:
    id: "{bmad_folder}/module/agents/name.md"
    name: "Display Name"
    title: "Role Title"
    icon: "🎯"
    module: "bmm" # Required for module agents, omit for core agents

  persona:
    role: "Primary Role"
    identity: "Background and expertise..."
    communication_style: "How the agent communicates"
    principles:
      - "Core principle 1"
      - "Core principle 2"

  critical_actions: # Optional
    - "Load configuration from {project-root}/{bmad_folder}/module/config.yaml"
    - "Remember user's name is {user_name}"

  menu:
    - trigger: "workflow-init" # kebab-case only
      workflow: "{project-root}/{bmad_folder}/module/workflows/init/workflow.yaml"
      description: "Initialize workflow"

    - trigger: "advanced-task"
      exec: "{project-root}/{bmad_folder}/core/tasks/advanced.md"
      description: "Execute advanced task"

  prompts: [] # Optional pre-built prompts
```

#### Compilation Process

1. **Load** YAML files (base + customization)
2. **Merge** using deep merge strategy (customization overrides base)
3. **Validate** against Zod schema (triggers schema validation)
4. **Build** activation block with critical actions and menu handlers
5. **Compile** to XML wrapped in Markdown for IDE consumption

**Key Files:**

- `tools/schema/agent.js` - Zod schema definition (49 test cases)
- `tools/cli/lib/yaml-xml-builder.js` - Compilation engine
- `tools/cli/lib/activation-builder.js` - Activation block builder

### 2. Workflow System

#### Workflow Definition (YAML)

Workflows are multi-step processes defined in `workflow.yaml`:

```yaml
name: workflow-name
description: "Brief description"
config_source: "{project-root}/{bmad_folder}/module/config.yaml"
output_folder: "{config_source}:output_folder" # Reference config value
user_name: "{config_source}:user_name"

installed_path: "{project-root}/{bmad_folder}/module/workflows/workflow-name"
instructions: "{installed_path}/instructions.md"
template: "{installed_path}/template.md"
default_output_file: "{output_folder}/output-filename.yaml"

standalone: true # Can run without dependencies
web_bundle: false # Not for web sharing (yet)
```

#### Workflow Phases (BMM)

1. **Phase 0**: Documentation (brownfield only)
2. **Phase 1**: Analysis (optional) - Brainstorming, research, briefs
3. **Phase 2**: Planning (required) - PRD/Tech-spec/GDD (scale-adaptive)
4. **Phase 3**: Solutioning (Level 3-4) - Architecture, security, DevOps
5. **Phase 4**: Implementation (iterative) - Story-centric development

**Scale-Adaptive Tracks:**

- **Quick Flow** (Level 0-1): Bug fixes, small features
- **BMad Method** (Level 2): Products, platforms with full planning
- **Enterprise** (Level 3-4): Extended planning with security/compliance

### 3. Configuration System

#### Placeholder System

Placeholders are replaced at compile-time or runtime:

**Compile-Time Placeholders:**

- `{bmad_folder}` - User's chosen BMAD folder name (default: `bmad`)
- `{project-root}` - Project root directory
- `{module}` - Current module name (bmm, bmgd, cis, bmb)
- `{date}` - Current date
- `{version}` - BMAD version

**Runtime Placeholders:**

- `{user_name}` - User's name from config
- `{communication_language}` - Preferred language
- `{output_folder}` - Output directory for artifacts
- `{config_source}:key` - Reference config value by key

**Config Reference Pattern:**

```yaml
output_folder: "{config_source}:output_folder"
```

This reads `output_folder` from the referenced config file.

### 4. Manifest System

Tracks installed components in `{bmad_folder}/_cfg/`:

```
_cfg/
├── manifest.yaml          # Main metadata (version, modules, IDEs)
├── agent-manifest.csv     # Agent inventory
├── workflow-manifest.csv  # Workflow inventory
├── task-manifest.csv      # Task inventory
├── tool-manifest.csv      # Tool inventory
└── files-manifest.csv     # File tracking (optional)
```

**Purpose:** Enable smart updates without file hashing overhead.

### 5. Dependency Validation

**System:** `tools/cli/lib/dependency-validator.js`

Validates all agent and workflow references:

- Checks workflow paths exist
- Validates template references
- Detects missing config sources
- Reports broken dependencies

**Run Validation:**

```bash
node tools/cli/lib/dependency-validator.js
```

### 6. Error Handling

**System:** `tools/cli/lib/errors.js`

Provides context-rich error classes:

- `ErrorWithContext` - Base error with metadata
- `ValidationError` - Schema/input validation failures
- `ConfigurationError` - Config file/settings issues
- `InstallationError` - Installation process failures
- `DependencyError` - Missing or invalid dependencies
- `FileOperationError` - File I/O failures

All errors include recovery suggestions.

### 7. Logging

**System:** `tools/cli/lib/logger.js`

Centralized logging with:

- **Levels**: DEBUG, INFO, WARN, ERROR, SILENT
- **Outputs**: Console (formatted) + File (JSON)
- **Features**: Log rotation, verbosity control, spinner integration
- **Usage**:

```javascript
const { getLogger } = require("./tools/cli/lib/logger");
const logger = getLogger({ level: "info", enableFile: true });
logger.info("Installation complete", { modules: ["bmm", "cis"] });
```

---

## Module System

### Module Structure

Each module follows this structure:

```
{module}/
├── agents/               # Module-specific agents (*.agent.yaml)
├── workflows/            # Workflow definitions
│   ├── phase-1/
│   │   └── workflow-name/
│   │       ├── workflow.yaml
│   │       ├── instructions.md
│   │       ├── template.md
│   │       └── checklist.md
│   ├── phase-2/
│   └── ...
├── teams/                # Pre-configured agent teams (*.yaml)
├── tasks/                # Executable tasks (*.md)
├── sub-modules/          # IDE-specific enhancements
│   └── claude-code/
│       ├── sub-agents/   # Claude Code subagents
│       ├── injections.yaml
│       └── readme.md
├── docs/                 # User documentation
├── _module-installer/    # Installation configuration
│   ├── install-config.yaml
│   ├── installer.js      # Custom install logic (optional)
│   ├── assets/           # Module assets
│   └── platform-specifics/ # IDE-specific customizations
├── config.yaml           # Module configuration template
└── README.md             # Module documentation
```

### Module Installation

**Config:** `{module}/_module-installer/install-config.yaml`

```yaml
module:
  id: "bmm"
  name: "BMad Method"
  version: "6.0.0-alpha.8"
  description: "AI-driven agile development"
  dependencies:
    - core
    - cis # Optional: depends on CIS brainstorming

  install:
    agents: true # Copy agents
    workflows: true # Copy workflows
    tasks: true # Copy tasks
    config: true # Install config.yaml

  ide_injections: # IDE-specific enhancements
    claude-code:
      enabled: true
      subagents: true
      injections: "sub-modules/claude-code/injections.yaml"
```

### Creating a New Module

**Use BMB (BMad Builder) module:**

```bash
# Load BMad Builder agent
# Run create-module workflow
*create-module
```

Or manually:

1. Create directory structure in `src/modules/{your-module}/`
2. Define agents in `agents/*.agent.yaml`
3. Create workflows in `workflows/`
4. Add `_module-installer/install-config.yaml`
5. Write module README
6. Run validation: `npm run validate:schemas`

---

## Development Workflow

### Prerequisites

- **Node.js**: v20+ (see `.nvmrc`)
- **npm**: v8+

### Setup

```bash
# Clone repository
git clone https://github.com/bmad-code-org/BMAD-METHOD.git
cd BMAD-METHOD

# Use correct Node version
nvm use

# Install dependencies
npm install
```

### Development Commands

```bash
# Run all quality checks (comprehensive - use before pushing)
npm test

# Individual test suites
npm run test:schemas       # Agent schema validation (49 tests)
npm run test:install       # Installation component tests (13 tests)
npm run validate:schemas   # YAML schema validation (19 agents)
npm run validate:bundles   # Web bundle integrity

# Code quality
npm run lint               # ESLint check
npm run lint:fix           # Auto-fix linting issues
npm run format:check       # Prettier check
npm run format:fix         # Auto-format all files

# Build & bundle
npm run bundle             # Bundle for web deployment
npm run rebundle           # Rebundle with cleanup

# Installation testing
npm run install:bmad       # Test local installation
npm run bmad:status        # Check installation status
```

### Git Workflow

**Pre-commit Hook:**

Runs automatically (via Husky):

1. Lint-staged: Format and lint changed files
2. npm test: Run all quality checks

**Commit Standards:**

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Keep commits atomic and descriptive
- Reference issues: `fix: resolve agent compilation (#123)`

### Code Style

- **JavaScript**: ES6+, async/await, no var
- **Formatting**: Prettier (automated)
- **Linting**: ESLint with recommended rules
- **Naming**:
  - Files: kebab-case (e.g., `yaml-xml-builder.js`)
  - Classes: PascalCase (e.g., `YamlXmlBuilder`)
  - Functions: camelCase (e.g., `compileAgent`)
  - Triggers: kebab-case (e.g., `workflow-init`)

---

## Testing & Quality

### Test Suites

#### 1. Agent Schema Validation

**File:** `test/test-agent-schema.js`
**Fixtures:** `test/fixtures/*.agent.yaml`
**Coverage:** 49 test cases (valid and invalid agents)

**Run:**

```bash
npm run test:schemas
```

**Tests:**

- ✅ Valid agents (minimal, complete, module-scoped, core)
- ❌ Invalid agents (missing fields, wrong types, duplicate triggers, etc.)

#### 2. Installation Component Tests

**File:** `test/test-installation-components.js`
**Coverage:** 13 test cases

**Tests:**

- Agent compilation
- Customization merging
- Path variable resolution
- TEA agent specific tests

**Run:**

```bash
npm run test:install
```

#### 3. Schema Validation (Live)

**File:** `tools/validate-agent-schema.js`
**Coverage:** All 19 agents in `src/`

Validates all agent files against schema in production.

**Run:**

```bash
npm run validate:schemas
```

### Quality Metrics

**Current Status:**

- ✅ 49/49 schema tests passing
- ✅ 13/13 installation tests passing
- ✅ 19/19 agents validated
- ✅ ESLint passing (0 warnings)
- ✅ Prettier formatting passing

### Continuous Integration

**GitHub Actions:** `.github/workflows/quality.yaml`

Runs on every PR:

- Schema validation
- Installation tests
- Lint checks
- Format checks
- Bundle validation

---

## Key Files Reference

### Critical Configuration Files

| File                       | Purpose                                 |
| -------------------------- | --------------------------------------- |
| `package.json`             | npm package config, scripts, deps       |
| `eslint.config.mjs`        | ESLint configuration                    |
| `prettier.config.mjs`      | Prettier formatting rules               |
| `.nvmrc`                   | Node version requirement (20+)          |
| `.npmrc`                   | npm configuration                       |
| `tools/platform-codes.yaml` | Platform/IDE identifier mappings        |

### Core Source Files

| File                                                | Lines | Purpose                        |
| --------------------------------------------------- | ----- | ------------------------------ |
| `tools/cli/bmad-cli.js`                             | ~200  | CLI entry point                |
| `tools/cli/installers/lib/core/installer.js`        | 2,241 | Main installation orchestrator |
| `tools/cli/lib/yaml-xml-builder.js`                 | 447   | YAML→XML compiler              |
| `tools/cli/lib/activation-builder.js`               | 169   | Activation block builder       |
| `tools/schema/agent.js`                             | 300+  | Agent schema (Zod)             |
| `tools/cli/lib/errors.js`                           | 150   | Error handling classes         |
| `tools/cli/lib/logger.js`                           | 303   | Centralized logging            |
| `tools/cli/lib/dependency-validator.js`             | 339   | Dependency validation          |
| `tools/cli/installers/lib/core/manifest-generator.js` | 400+  | Manifest generation            |

### Documentation Files

| File                            | Purpose                               |
| ------------------------------- | ------------------------------------- |
| `README.md`                     | Main project README (comprehensive)   |
| `CODEBASE_ANALYSIS.md`          | Deep technical analysis               |
| `ENHANCEMENT_PLAN.md`           | Enhancement roadmap and POCs          |
| `CONTRIBUTING.md`               | Contribution guidelines               |
| `CHANGELOG.md`                  | Version history                       |
| `v6-open-items.md`              | Pre-beta TODO list                    |
| `docs/index.md`                 | Documentation hub                     |
| `src/modules/bmm/docs/README.md` | BMM documentation hub                 |

---

## Common Tasks

### Add a New Agent

1. **Create agent file:**

```yaml
# src/modules/{module}/agents/new-agent.agent.yaml
agent:
  metadata:
    id: "{bmad_folder}/{module}/agents/new-agent.md"
    name: "New Agent"
    title: "Agent Role"
    icon: "🤖"
    module: "{module}"

  persona:
    role: "Primary role"
    identity: "Background..."
    communication_style: "Style..."
    principles:
      - "Principle 1"

  menu:
    - trigger: "hello"
      action: "Say hello"
      description: "Greeting action"

  prompts: []
```

2. **Validate:**

```bash
npm run validate:schemas
```

3. **Test compilation:**

```bash
node tools/cli/commands/build.js new-agent
```

### Add a New Workflow

1. **Create workflow directory:**

```bash
mkdir -p src/modules/{module}/workflows/phase-X/workflow-name
```

2. **Create workflow files:**

```yaml
# workflow.yaml
name: workflow-name
description: "Description"
config_source: "{project-root}/{bmad_folder}/{module}/config.yaml"
installed_path: "{project-root}/{bmad_folder}/{module}/workflows/phase-X/workflow-name"
instructions: "{installed_path}/instructions.md"
template: "{installed_path}/template.md"
standalone: true
web_bundle: false
```

```markdown
# instructions.md

Workflow instructions for the agent...
```

```markdown
# template.md

Output template...
```

3. **Add to agent menu:**

```yaml
menu:
  - trigger: "new-workflow"
    workflow: "{project-root}/{bmad_folder}/{module}/workflows/phase-X/workflow-name/workflow.yaml"
    description: "New workflow"
```

4. **Validate:**

```bash
npm run validate:schemas
```

### Customize an Agent

1. **Create customization file:**

```bash
mkdir -p {project-bmad-folder}/_cfg/agents
```

2. **Create `{agent-name}.customize.yaml`:**

```yaml
agent:
  metadata:
    name: "Custom Name"
    title: "Custom Title"

  persona:
    communication_style: "Custom style"

  menu:
    - trigger: "custom-action"
      action: "Custom action"
      description: "Custom menu item"
```

3. **Rebuild agent:**

```bash
npm run bmad:install # Quick update
```

### Run Dependency Validation

```bash
# Validate all references
node tools/validate-agent-schema.js

# Or use the dependency validator directly
node -e "
const { DependencyValidator } = require('./tools/cli/lib/dependency-validator');
const validator = new DependencyValidator(process.cwd());
validator.validateAll('./bmad').then(results => {
  console.log(validator.formatResults(results));
});
"
```

### Debug Installation

```bash
# Enable debug logging
DEBUG=bmad:* npm run bmad:install

# Or use logger directly
node -e "
const { getLogger } = require('./tools/cli/lib/logger');
const logger = getLogger({ level: 'debug', enableFile: true });
logger.debug('Debug message', { context: 'test' });
"
```

### Format Codebase

```bash
# Check formatting
npm run format:check

# Auto-fix formatting
npm run format:fix

# Format specific files
npx prettier --write "src/**/*.md"
```

---

## Important Conventions

### Trigger Naming

- **MUST** use kebab-case: `workflow-init`, `create-prd`, `dev-story`
- **NO** underscores, spaces, camelCase, or PascalCase
- **NO** leading asterisks in schema (asterisk is UI convention only)

### Placeholder Usage

- Use `{bmad_folder}` for folder references (replaced at install time)
- Use `{project-root}` for absolute paths (preserved, LLMs understand it)
- Use `{config_source}:key` for config value references
- Runtime placeholders: `{user_name}`, `{communication_language}`, `{output_folder}`

### Module Guidelines

- Each module MUST have `_module-installer/install-config.yaml`
- Module agents MUST declare `module` in metadata
- Core agents MUST NOT declare `module` in metadata
- Workflows SHOULD reference `config_source` for configuration

### Error Handling

- Use `ErrorWithContext` and subclasses for all errors
- Include recovery suggestions in errors
- Log errors with full context
- Never swallow errors silently (except where explicitly documented)

---

## Troubleshooting

### Common Issues

**Issue: Schema validation fails**

```bash
# Check schema validation
npm run validate:schemas

# View detailed errors
node test/test-agent-schema.js
```

**Issue: Agent compilation fails**

```bash
# Rebuild specific agent
node tools/cli/commands/build.js {agent-name}

# Check for YAML syntax errors
npx js-yaml src/modules/{module}/agents/{agent}.agent.yaml
```

**Issue: Installation fails**

```bash
# Check installation status
npm run bmad:status

# View logs
tail -f .bmad/logs/bmad-*.log

# Clean reinstall
rm -rf bmad .bmad
npm run bmad:install
```

**Issue: Tests failing**

```bash
# Run specific test suite
npm run test:schemas
npm run test:install

# Check for dependency issues
npm ci
```

---

## Additional Resources

### Documentation

- **[Main README](./README.md)** - Project overview
- **[BMM Documentation Hub](./src/modules/bmm/docs/README.md)** - Complete BMM guides
- **[Contributing Guide](./CONTRIBUTING.md)** - Contribution guidelines
- **[Codebase Analysis](./CODEBASE_ANALYSIS.md)** - Technical deep dive
- **[Enhancement Plan](./ENHANCEMENT_PLAN.md)** - Roadmap and POCs

### Key External Docs

- **Zod Documentation**: https://zod.dev/
- **Node.js 20 Documentation**: https://nodejs.org/docs/latest-v20.x/api/
- **ESLint**: https://eslint.org/docs/latest/
- **Prettier**: https://prettier.io/docs/en/

### Community

- **Discord**: https://discord.gg/gk8jAdXWmj (#general-dev, #bugs-issues)
- **GitHub Issues**: https://github.com/bmad-code-org/BMAD-METHOD/issues
- **YouTube**: https://www.youtube.com/@BMadCode

---

## Quick Reference

### Run Commands

```bash
# Development
npm test                 # Run all tests
npm run lint            # Lint check
npm run format:fix      # Format code

# Building
npm run bundle          # Create web bundles
node tools/cli/commands/build.js {agent}  # Build specific agent

# Installation
npm run install:bmad    # Test local install
npm run bmad:status     # Check status
```

### File Patterns

```
*.agent.yaml            # Agent definitions
workflow.yaml           # Workflow definitions
install-config.yaml     # Module installation config
config.yaml             # Module runtime configuration
*-template.md           # Output templates
instructions.md         # Workflow instructions
```

### Placeholder Reference

| Placeholder                 | Resolved At  | Example Value              |
| --------------------------- | ------------ | -------------------------- |
| `{bmad_folder}`             | Install time | `bmad`                     |
| `{project-root}`            | Runtime      | `/Users/you/project`       |
| `{module}`                  | Compile time | `bmm`                      |
| `{user_name}`               | Runtime      | `John Doe`                 |
| `{communication_language}`  | Runtime      | `english`                  |
| `{output_folder}`           | Runtime      | `./output`                 |
| `{config_source}:key`       | Runtime      | (value from config)        |

---

**This guide is maintained for AI agents and human developers working with the BMAD Method codebase. For user-facing documentation, see [README.md](./README.md) and [docs/](./docs/).**
