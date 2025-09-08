# Installation Guide

## Quick Start

Get your BMAD-Spec Orchestrator system running in under 5 minutes.

### Prerequisites

- **Claude Code** - Install from [claude.ai/code](https://claude.ai/code)
- **Git** - For cloning the repository
- **Project directory** - Any existing or new project

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/oimiragieo/BMAD-SPEC-KIT.git
cd BMAD-SPEC-KIT
```

#### 2. Copy to Your Project

Copy the entire `.claude` folder to your project root:

```bash
# For new projects
cp -r bmad-spec-orchestrator-kit/.claude /path/to/your/project/

# For existing projects (merge carefully)
cp -r bmad-spec-orchestrator-kit/.claude/* /path/to/your/project/.claude/
```

#### 3. Activate in Claude Code

1. Open your project in Claude Code
2. Claude automatically detects the `.claude` folder
3. The orchestrator system activates immediately

#### 4. Verify Installation

Ask Claude:
```
"I need help building a web application for task management"
```

Claude should respond with orchestration options and agent activation.

## Enterprise Deployment

For team and enterprise deployments:

### Repository Integration

#### Option 1: Fork the Repository
```bash
# Fork https://github.com/oimiragieo/BMAD-SPEC-KIT to your organization
git clone https://github.com/your-org/BMAD-SPEC-KIT.git
```

#### Option 2: Submodule Integration
```bash
# Add as submodule to existing repository
git submodule add https://github.com/oimiragieo/BMAD-SPEC-KIT.git tools/bmad-spec
ln -s tools/bmad-spec/bmad-spec-orchestrator-kit/.claude .claude
```

#### Option 3: Direct Integration
```bash
# Copy and commit to your repository
curl -L https://github.com/oimiragieo/BMAD-SPEC-KIT/archive/main.tar.gz | tar -xz
cp -r BMAD-SPEC-KIT-main/bmad-spec-orchestrator-kit/.claude .
rm -rf BMAD-SPEC-KIT-main
```

### Team Configuration

#### Shared Rules (`/.claude/rules/`)
- Customize enterprise standards for your organization
- Modify coding standards in `code-quality.md`
- Update design standards in `design-standards.md`
- Adjust writing rules in `writing-excellence.md`

#### Custom Agents (`/.claude/agents/`)
- Add domain-specific agents for your industry
- Modify existing agent prompts for company standards
- Create specialized workflow agents

### Version Control

#### Recommended `.gitignore` entries:
```gitignore
# Claude Code temporary files
.claude/temp/
.claude/logs/
.claude/cache/

# Keep these tracked:
# .claude/agents/
# .claude/rules/
# .claude/data/
# .claude/templates/
```

## Verification

### System Check

Run this verification:
```
"Show me the BMAD-Spec Orchestrator system status"
```

Expected response includes:
- ✅ 10 agents loaded successfully
- ✅ Enterprise rules integrated
- ✅ Templates and tasks available
- ✅ Quality gates active

### Agent Test

Test individual agents:
```
"Activate the Architect agent to design a REST API system"
```

Expected behavior:
- Agent introduces itself with expertise
- Uses `ultrathink` for architecture decisions
- References enterprise rules
- Provides structured output

## Troubleshooting

### Common Issues

#### Claude Code doesn't detect agents
```bash
# Verify .claude folder structure
ls -la .claude/
# Should show: agents/ rules/ data/ templates/ tasks/ checklists/ CLAUDE.md
```

#### Agents don't reference enterprise rules
```bash
# Check rules directory exists
ls -la .claude/rules/
# Should show: *.md files for all rule categories
```

#### Missing templates or tasks
```bash
# Verify all components present
find .claude -name "*.md" | wc -l
# Should show 50+ files across all directories
```

### Error Resolution

#### Permission Issues
```bash
# Fix file permissions
chmod -R 755 .claude/
```

#### Incomplete Installation
```bash
# Re-copy from source
rm -rf .claude/
cp -r path/to/BMAD-SPEC-KIT/bmad-spec-orchestrator-kit/.claude .
```

### Getting Help

- **Installation Issues**: [GitHub Issues](https://github.com/oimiragieo/BMAD-SPEC-KIT/issues)
- **Configuration Help**: [GitHub Discussions](https://github.com/oimiragieo/BMAD-SPEC-KIT/discussions)
- **Enterprise Support**: See enterprise deployment patterns

## Next Steps

1. **[Getting Started Guide](../user-guide/getting-started.md)** - Create your first project
2. **[Agent Reference](../user-guide/agent-reference.md)** - Learn about all 10 agents
3. **[Configuration Guide](configuration.md)** - Customize for your needs

---

**Ready to build enterprise software with AI orchestration**