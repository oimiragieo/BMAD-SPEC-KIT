# Getting Started

Welcome to the BMAD-Spec Orchestrator - your enterprise-grade AI development team in Claude Code.

## What You'll Build

In the next 10 minutes, you'll:
1. Set up the orchestrator system
2. Create your first AI-orchestrated application
3. Experience the full agent workflow from idea to deployment

## Prerequisites

- **Claude Code installed** - Get it at [claude.ai/code](https://claude.ai/code)
- **Basic project idea** - Something simple like "task management app" or "blog platform"

## Step 1: Installation (2 minutes)

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/oimiragieo/BMAD-SPEC-KIT.git
cd BMAD-SPEC-KIT

# Copy to your project directory
mkdir my-first-bmad-project
cp -r bmad-spec-orchestrator-kit/.claude my-first-bmad-project/
cd my-first-bmad-project
```

### Open in Claude Code

```bash
# Open your project in Claude Code
code .
```

Claude Code automatically detects the `.claude` folder and loads the orchestrator system.

## Step 2: Activate the System (30 seconds)

In Claude Code, type:
```
I need to create a simple task management web application with user authentication and project collaboration features.
```

**What happens next:**
- Claude detects this as a development request
- The BMAD Orchestrator activates
- You'll see a complexity assessment and recommended workflow

## Step 3: Watch the Agents Work (5 minutes)

### The Analyst Agent Starts

Claude will likely activate the **Analyst** first:
- Uses `think hard` to research task management market
- Creates competitive analysis
- Generates project brief with market insights

### The PM Agent Takes Over  

The **Product Manager** agent:
- Uses `think harder` for comprehensive planning
- Transforms the brief into a detailed Product Requirements Document (PRD)
- Defines user stories and feature prioritization

### The Architect Agent Designs

The **Architect** agent:
- Uses `ultrathink` for system architecture decisions
- Creates security-first technical architecture
- Selects optimal technology stack with detailed rationale

## Step 4: Experience the Quality (2 minutes)

Notice how each agent:

### Follows Enterprise Rules
- Professional writing without AI jargon
- Security-first approach to all decisions
- Accessibility compliance (WCAG 2.1 AA)
- Performance optimization throughout

### Uses Claude Thinking Optimization
- **`ultrathink`** - Critical architecture and security decisions
- **`think harder`** - Complex analysis and trade-offs
- **`think hard`** - Important research and design work
- **`think`** - Standard reasoning and validation

### Maintains Context
- Each agent builds on previous work
- No information loss between handoffs
- Comprehensive validation at each step

## Step 5: Move to Implementation (Optional)

If you want to continue to development:

```
I approve the architecture. Let's move to implementation with the Developer agent.
```

The **Developer** agent will:
- Create project structure
- Implement core functionality
- Write comprehensive tests
- Follow all enterprise coding standards

## What You Just Experienced

### 🎯 Precision Orchestration
- 10 specialized agents each with distinct expertise
- Automatic complexity scoring (1-10 scale) determines workflow
- Context-aware handoffs between agents

### 🛡️ Enterprise Security
- No dangerous permission bypasses
- Security-first development practices
- Comprehensive audit trails
- Zero-trust architecture principles

### ⚡ Claude Optimization
- Thinking triggers optimized for Claude's capabilities
- Maximum decision quality through strategic thinking deployment
- Context preservation across long workflows

### 📊 Quality Gates
- Cross-agent validation ensures consistency
- Automated quality thresholds
- Error recovery with improved context
- Continuous learning from patterns

## Common First-Time Patterns

### Simple Projects (Complexity 1-3)
```
"Create a personal blog with markdown support"
```
- Analyst → PM → Developer workflow
- Fast execution, focused features

### Medium Projects (Complexity 4-6)
```
"Build a customer relationship management system"
```
- Full planning phase with Architect
- UX Expert creates detailed user flows
- QA agent provides comprehensive testing

### Complex Projects (Complexity 7-10)
```
"Design a multi-tenant SaaS platform with real-time collaboration"
```
- All 10 agents participate
- Multiple quality gate validations
- Extensive documentation and testing

## Next Steps

### Learn More About Agents
- **[Agent Reference](agent-reference.md)** - Deep dive into all 10 agents
- **[Workflow Guide](workflow-guide.md)** - Understanding complexity scoring

### Customize Your System
- **[Templates Guide](templates-guide.md)** - Using the 11 document templates
- **[Configuration](../deployment/configuration.md)** - Advanced customization

### Try Advanced Examples
- **[Basic Projects](../examples/basic-projects.md)** - More starter examples
- **[Enterprise Projects](../examples/enterprise-projects.md)** - Complex workflows

## Quick Tips

### Trigger Agent Activation
Use clear, project-oriented language:
✅ "I need to create a web application for..."
✅ "Help me build a system that..."
✅ "Design and implement a solution for..."

### Get Specific Agent Help
✅ "Activate the Architect to design a microservices system"
✅ "I need the UX Expert to create user flows"
✅ "Have the QA agent review this implementation"

### Maximize Claude Performance
The agents automatically use optimal thinking triggers, but you can request specific analysis:
✅ "Use ultrathink to evaluate this architecture decision"
✅ "Think harder about the security implications"

## Troubleshooting

### Agents Don't Activate
- Verify `.claude` folder is in project root
- Check that Claude Code detects the folder
- Try restarting Claude Code

### Missing Context Between Agents
- Ensure all agent folders are present in `.claude/agents/`
- Verify `CLAUDE.md` is in the root `.claude/` folder

### Need Help
- **[Troubleshooting Guide](../deployment/troubleshooting.md)**
- **[GitHub Issues](https://github.com/oimiragieo/BMAD-SPEC-KIT/issues)**
- **[Community Discussions](https://github.com/oimiragieo/BMAD-SPEC-KIT/discussions)**

---

**Welcome to the future of AI-orchestrated development**