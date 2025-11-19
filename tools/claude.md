# Tools Directory - BMAD CLI and Build System

This directory contains the complete CLI toolchain, build system, and development utilities for BMAD Method.

---

## Directory Structure

```
tools/
├── cli/                  # Main CLI application
│   ├── commands/         # CLI commands
│   ├── installers/       # Installation system
│   ├── bundlers/         # Web bundler
│   └── lib/              # Shared libraries
├── schema/               # Validation schemas
├── flattener/            # Codebase flattener
└── *.js                  # Build and validation scripts
```

---

## CLI Application (`cli/`)

### Entry Point

**File:** `bmad-cli.js`

Main CLI entry point using Commander.js. Dynamically loads commands from `commands/`.

**Usage:**

```bash
node tools/cli/bmad-cli.js <command> [options]
```

### Commands (`commands/`)

| Command       | File          | Purpose                             |
| ------------- | ------------- | ----------------------------------- |
| `install`     | install.js    | Install BMAD modules                |
| `build`       | build.js      | Rebuild agents from YAML            |
| `status`      | status.js     | Check installation status           |
| `list`        | list.js       | List available modules              |
| `uninstall`   | uninstall.js  | Uninstall BMAD modules              |
| `update`      | update.js     | Update installed modules            |

### Shared Libraries (`lib/`)

#### Core Libraries

| File                         | Purpose                               | Lines |
| ---------------------------- | ------------------------------------- | ----- |
| `yaml-xml-builder.js`        | YAML→XML compiler for agents          | 447   |
| `activation-builder.js`      | Activation block injection            | 169   |
| `errors.js`                  | Error handling classes                | 150   |
| `logger.js`                  | Centralized logging system            | 303   |
| `dependency-validator.js`    | Dependency validation                 | 339   |
| `config.js`                  | Configuration management              | ~200  |
| `file-ops.js`                | File operations utilities             | 180+  |
| `cli-utils.js`               | CLI helper functions                  | ~200  |
| `agent-analyzer.js`          | Agent analysis utilities              | ~100  |
| `agent-party-generator.js`   | Party mode agent generation           | ~200  |
| `ui.js`                      | UI components for CLI                 | ~500  |
| `xml-handler.js`             | XML processing utilities              | ~200  |
| `xml-to-markdown.js`         | XML→Markdown conversion               | ~100  |
| `yaml-format.js`             | YAML formatting utilities             | ~200  |
| `platform-codes.js`          | Platform/IDE identifier mappings      | ~100  |
| `project-root.js`            | Project root detection                | ~100  |
| `replace-project-root.js`    | Project root placeholder replacement  | ~200  |

#### Error Handling (`errors.js`)

**Classes:**

- `ErrorWithContext` - Base error with metadata and recovery suggestions
- `ValidationError` - Schema/input validation failures
- `ConfigurationError` - Config file/settings issues
- `InstallationError` - Installation process failures
- `DependencyError` - Missing or invalid dependencies
- `FileOperationError` - File I/O failures

**Usage:**

```javascript
const { ValidationError } = require("./errors");
throw new ValidationError("Invalid agent schema", {
  field: "menu.trigger",
  value: "invalid_trigger",
  recovery: "Use kebab-case for trigger names",
});
```

#### Logging (`logger.js`)

**Features:**

- Log levels: DEBUG, INFO, WARN, ERROR, SILENT
- Console (formatted) + File (JSON) output
- Log rotation (5 files, 5MB max)
- Spinner integration
- Child loggers with context

**Usage:**

```javascript
const { getLogger } = require("./logger");
const logger = getLogger({ level: "info", enableFile: true });

logger.info("Installation started", { modules: ["bmm", "cis"] });
logger.warn("Config not found, using defaults");
logger.error("Installation failed", { error: err.message });
```

#### Dependency Validation (`dependency-validator.js`)

**Features:**

- Validates all agent and workflow references
- Checks for missing files
- Reports broken dependencies
- Supports placeholder resolution

**Usage:**

```javascript
const { DependencyValidator } = require("./dependency-validator");
const validator = new DependencyValidator(projectDir);

const results = await validator.validateAll(bmadDir);
console.log(validator.formatResults(results));
```

---

## Installation System (`installers/`)

### Structure

```
installers/
└── lib/
    ├── core/          # Core installation logic
    ├── ide/           # IDE-specific handlers
    └── modules/       # Module management
```

### Core Installers (`lib/core/`)

| File                      | Purpose                             | Lines |
| ------------------------- | ----------------------------------- | ----- |
| `installer.js`            | Main installation orchestrator      | 2,241 |
| `detector.js`             | Detect existing installations       | ~200  |
| `config-collector.js`     | Gather user preferences             | ~200  |
| `manifest-generator.js`   | Generate installation manifests     | ~400  |
| `manifest.js`             | Manifest reading/writing            | ~200  |
| `dependency-resolver.js`  | Resolve module dependencies         | ~200  |
| `ide-config-manager.js`   | Manage IDE configurations           | ~200  |

#### Main Installer (`installer.js`)

**Key Methods:**

- `install(config)` - Full installation
- `quickUpdate(config)` - Update existing installation
- `compileAgents(config)` - Compile all agents
- `copyModules(config)` - Copy module files
- `generateManifests(config)` - Create manifest files
- `setupIDEs(config)` - Configure IDE integrations

### IDE Handlers (`lib/ide/`)

Supports 13+ IDEs with specific handlers:

| IDE            | File                | Status      |
| -------------- | ------------------- | ----------- |
| Claude Code    | claude-code.js      | ✅ Preferred |
| Cursor         | cursor.js           | ✅ Supported |
| Windsurf       | windsurf.js         | ✅ Supported |
| VS Code        | github-copilot.js   | ✅ Supported |
| Cline          | cline.js            | ✅ Supported |
| Roo            | roo.js              | ✅ Supported |
| OpenCode       | opencode.js         | ✅ Supported |
| Auggie         | auggie.js           | ✅ Supported |
| Gemini         | gemini.js           | ✅ Supported |
| Codex          | codex.js            | ✅ Supported |
| Crush          | crush.js            | ✅ Supported |
| iFlow          | iflow.js            | ✅ Supported |
| Kilo           | kilo.js             | ✅ Supported |
| QWen           | qwen.js             | ✅ Supported |
| Trae           | trae.js             | ✅ Supported |

**Base Class:** `_base-ide.js` - Abstract base for all IDE handlers

**Shared Utilities:**

- `agent-command-generator.js` - Generate agent launchers
- `workflow-command-generator.js` - Generate workflow commands
- `task-tool-command-generator.js` - Generate task tools
- `module-injections.js` - Handle module-specific injections
- `bmad-artifacts.js` - Manage BMAD artifacts

### Module Manager (`lib/modules/`)

**File:** `manager.js`

**Key Methods:**

- `installModule(moduleName, config)` - Install a module
- `copyModuleFiles(source, target, config)` - Copy with placeholder replacement
- `processModuleConfig(modulePath)` - Load module configuration
- `resolveModuleDependencies(modules)` - Resolve dependencies

---

## Web Bundler (`bundlers/`)

**Status:** In development (see `v6-open-items.md`)

**Files:**

- `bundle-web.js` - CLI interface for bundler
- `web-bundler.js` - Main bundler logic
- `test-bundler.js` - Bundler tests
- `test-analyst.js` - Test analyst bundler

**Purpose:** Create standalone agent bundles for:

- Gemini Gems
- Custom GPTs
- Claude Projects (web)

**Usage:**

```bash
npm run bundle           # Bundle all agents
npm run bundle -- {agent-name}  # Bundle specific agent
```

---

## Validation Schemas (`schema/`)

### Agent Schema (`agent.js`)

**Technology:** Zod

**Validates:**

- Metadata structure
- Persona completeness
- Menu item format
- Trigger patterns (kebab-case only)
- Command targets
- Module consistency

**Test Coverage:** 49 test cases in `test/fixtures/`

**Usage:**

```javascript
const { validateAgentFile } = require("./tools/schema/agent");
const result = validateAgentFile(filePath, agentYaml);

if (!result.success) {
  console.error(result.error.issues);
}
```

---

## Build & Validation Scripts

### Root-Level Scripts

| Script                  | Purpose                         |
| ----------------------- | ------------------------------- |
| `validate-agent-schema.js` | Validate all agent files      |
| `validate-bundles.js`   | Validate web bundles            |
| `format-workflow-md.js` | Format workflow markdown        |
| `bmad-npx-wrapper.js`   | npx wrapper for BMAD CLI        |
| `platform-codes.yaml`   | Platform identifier definitions |

### Validation Workflow

```bash
# Validate all agents
node tools/validate-agent-schema.js

# Validate bundles
node tools/validate-bundles.js

# Validate via npm
npm run validate:schemas
npm run validate:bundles
```

---

## Flattener Utility (`flattener/`)

**Purpose:** Flatten codebase into single file for LLM context

**Usage:**

```bash
npm run flatten
```

**Output:** Creates flattened representation of codebase for analysis

---

## Development Guidelines

### Adding a New CLI Command

1. **Create command file** in `cli/commands/{command}.js`:

```javascript
const { Command } = require("commander");

const command = new Command("mycommand")
  .description("My new command")
  .option("-f, --force", "Force operation")
  .action(async (options) => {
    // Implementation
  });

module.exports = command;
```

2. **Import in `bmad-cli.js`** (automatic via dynamic loading)

3. **Test:**

```bash
node tools/cli/bmad-cli.js mycommand --help
```

### Adding a New IDE Handler

1. **Extend base class** in `cli/installers/lib/ide/{ide-name}.js`:

```javascript
const BaseIDE = require("./_base-ide");

class MyIDE extends BaseIDE {
  constructor() {
    super();
    this.name = "myide";
    this.configDir = ".myide";
    this.commandsDir = "agents";
  }

  async setup(projectDir, config) {
    // IDE-specific setup
  }

  async cleanup(projectDir) {
    // IDE-specific cleanup
  }
}

module.exports = MyIDE;
```

2. **Register in IDE manager** (`cli/installers/lib/ide/manager.js`)

3. **Test installation:**

```bash
npm run install:bmad
# Select your new IDE
```

### Adding Validation Rules

1. **Update schema** in `schema/agent.js`:

```javascript
const menuItemSchema = z.object({
  trigger: z.string().regex(/^[a-z0-9-]+$/),
  // Add new validations
});
```

2. **Add test fixtures** in `test/fixtures/`:

```yaml
# valid/my-new-test.agent.yaml
# invalid/my-new-test-invalid.agent.yaml
```

3. **Run tests:**

```bash
npm run test:schemas
```

---

## Testing

### Run All Tests

```bash
npm test
```

### Run Specific Tests

```bash
npm run test:schemas     # Schema validation
npm run test:install     # Installation components
npm run validate:schemas # Live agent validation
npm run validate:bundles # Bundle validation
```

### Test Coverage

- **Schema Tests:** 49 fixtures (valid + invalid)
- **Installation Tests:** 13 component tests
- **Live Validation:** 19 agents

---

## Logging & Debugging

### Enable Debug Logging

```bash
# Via npm script
DEBUG=bmad:* npm run install:bmad

# Via logger config
node -e "
const { getLogger } = require('./tools/cli/lib/logger');
const logger = getLogger({ level: 'debug', enableFile: true });
"
```

### Log Files

Location: `.bmad/logs/bmad-{date}.log`

- **Rotation:** 5 files max, 5MB each
- **Format:** JSON
- **Levels:** DEBUG, INFO, WARN, ERROR

---

## Common Tasks

### Rebuild All Agents

```bash
node tools/cli/commands/build.js
```

### Rebuild Specific Agent

```bash
node tools/cli/commands/build.js pm
```

### Validate All Agents

```bash
node tools/validate-agent-schema.js
```

### Check Dependency References

```bash
node -e "
const { DependencyValidator } = require('./tools/cli/lib/dependency-validator');
const validator = new DependencyValidator(process.cwd());
validator.validateAll('./bmad').then(r => console.log(validator.formatResults(r)));
"
```

### Format All Code

```bash
npm run format:fix
```

---

## Key Conventions

### File Naming

- Commands: `{command}.js`
- Libraries: `kebab-case.js`
- Classes: PascalCase in files
- Configs: `{name}.yaml`

### Error Handling

- Always use `ErrorWithContext` classes
- Include recovery suggestions
- Log with full context
- Never swallow errors silently

### Configuration

- Use YAML for config files
- Support placeholder substitution
- Validate with schemas
- Provide defaults

---

## References

- **Main CLI:** [bmad-cli.js](./cli/bmad-cli.js)
- **Installer:** [installer.js](./cli/installers/lib/core/installer.js)
- **Agent Schema:** [agent.js](./schema/agent.js)
- **Error Classes:** [errors.js](./cli/lib/errors.js)
- **Logger:** [logger.js](./cli/lib/logger.js)
- **Validator:** [dependency-validator.js](./cli/lib/dependency-validator.js)

---

**For main codebase documentation, see [../claude.md](../claude.md)**
