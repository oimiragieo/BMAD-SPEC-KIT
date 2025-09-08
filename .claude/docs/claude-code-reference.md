# BMAD-Spec Claude Code Reference Guide

This document provides comprehensive guidance for using the BMAD-Spec Orchestrator system with Claude Code.

## System Overview

The BMAD-Spec Orchestrator transforms Claude Code into a multi-agent development orchestrator capable of generating complete applications from natural language specifications through systematic workflows.

## Activation Commands

### Primary Triggers
Use these phrases to activate the BMAD system:

```
"Create a [type of application]"
"Build a [type of system]"
"I need a [software/app/website]"
"Use BMAD to develop [description]"
"Generate a [project type] using the BMAD workflow"
```

### Examples:
```
✅ "Create a task management web application"
✅ "Build an e-commerce API service"  
✅ "I need a real estate listing website"
✅ "Use BMAD to develop a social media dashboard"
✅ "Generate a fullstack application using the BMAD workflow"
```

## Workflow Selection Guide

### Greenfield Projects (New Development)

**greenfield-fullstack** - Complete web applications
- Use for: Full-stack web apps, SaaS platforms, complete systems
- Includes: Frontend, backend, database, deployment
- Example: "Create a project management application with user authentication and real-time collaboration"

**greenfield-ui** - Frontend-only applications  
- Use for: SPAs, landing pages, dashboards, client-side apps
- Includes: React/Vue/Angular components, styling, routing
- Example: "Build a data visualization dashboard for sales analytics"

**greenfield-service** - Backend services and APIs
- Use for: REST APIs, microservices, data processing services
- Includes: API endpoints, database models, authentication, testing
- Example: "Create a user authentication service with OAuth integration"

### Brownfield Projects (Existing Systems)

**brownfield-fullstack** - Full-stack modifications
- Use for: Adding features to existing applications
- Includes: Frontend + backend changes, database migrations
- Example: "Add a payment processing feature to my existing e-commerce app"

**brownfield-ui** - Frontend modifications
- Use for: UI enhancements, new components, design updates
- Includes: Component updates, styling changes, UX improvements
- Example: "Add a dark mode toggle to my React dashboard"

**brownfield-service** - Backend modifications
- Use for: API enhancements, new endpoints, performance optimization
- Includes: Service updates, database changes, integration improvements
- Example: "Add rate limiting and caching to my existing API"

## Agent Roles & Capabilities

### 🎯 Analyst Agent (Maya)
**Expertise**: Requirements gathering, stakeholder analysis
**Generates**:
- Comprehensive project briefs
- Stakeholder analysis documents
- Feature requirements lists
- Business logic specifications

**When to Use**: Project initiation, requirements clarification

### 📋 Product Manager Agent (Alex)
**Expertise**: Product strategy, roadmap planning
**Generates**:
- Product Requirements Documents (PRDs)
- Feature specifications
- User story definitions
- Project timelines

**When to Use**: Strategic planning, product definition

### 🏗️ Architect Agent (Winston)
**Expertise**: System design, technical architecture
**Generates**:
- System architecture documents
- Technology stack recommendations
- Database design schemas
- Integration patterns

**When to Use**: Technical planning, system design

### 👨‍💻 Developer Agent (Jordan)
**Expertise**: Code implementation, best practices
**Generates**:
- Complete application code
- Configuration files
- Build scripts
- Development documentation

**When to Use**: Implementation, code generation

### 🧪 QA Agent (Riley)
**Expertise**: Testing strategy, quality assurance
**Generates**:
- Test plans and strategies
- Automated test suites
- Quality checklists
- Bug reports and fixes

**When to Use**: Quality validation, testing

### 🎨 UX Expert Agent (Sam)
**Expertise**: User experience, interface design
**Generates**:
- UI/UX specifications
- Wireframes and mockups
- Design system guidelines
- User flow documentation

**When to Use**: Design planning, user experience

## Workflow Execution Process

### 1. Specification Analysis Phase
```
User Request → Analyst Agent → Project Brief
```
- Analyzes user requirements
- Identifies key stakeholders and objectives
- Creates comprehensive project specification

### 2. Product Definition Phase
```
Project Brief → PM Agent → Product Requirements Document
```
- Defines product features and functionality
- Creates user stories and acceptance criteria
- Establishes project scope and timeline

### 3. Technical Design Phase
```
PRD → Architect Agent → Technical Architecture
```
- Designs system architecture
- Selects appropriate technology stack
- Creates database and API specifications

### 4. User Experience Phase
```
PRD + Architecture → UX Expert → UI/UX Specifications
```
- Creates user interface designs
- Defines user experience flows
- Establishes design system guidelines

### 5. Implementation Phase
```
All Specs → Developer Agent → Complete Codebase
```
- Implements all application components
- Creates configuration and build files
- Generates deployment scripts

### 6. Quality Assurance Phase
```
Implementation → QA Agent → Test Suite + Quality Report
```
- Creates comprehensive test suite
- Validates all requirements
- Ensures production readiness

## Template Reference

### Core Templates

**project-brief.md** - Initial project specification
```
Variables: {{project_name}}, {{executive_summary}}, {{target_audience}}, {{key_features}}
Use: Project initiation and stakeholder communication
```

**prd.md** - Product Requirements Document
```
Variables: {{product_name}}, {{problem_statement}}, {{success_metrics}}, {{user_stories}}
Use: Product planning and feature definition
```

**architecture.md** - Technical architecture specification
```
Variables: {{system_name}}, {{architecture_overview}}, {{technology_stack}}, {{data_flow}}
Use: Technical planning and development guidance
```

**feature-specification.md** - Detailed feature specifications
```
Variables: {{feature_name}}, {{user_description}}, {{functional_requirements}}, {{acceptance_criteria}}
Use: Feature development and testing validation
```

**project-constitution.md** - Project governance and standards
```
Variables: {{project_name}}, {{development_principles}}, {{quality_standards}}, {{governance_rules}}
Use: Project governance and team alignment
```

**implementation-plan.md** - Development execution plan
```
Variables: {{project_name}}, {{implementation_phases}}, {{deliverables}}, {{timeline}}
Use: Development coordination and progress tracking
```

## Task Categories

### Analysis Tasks
- `requirements-gathering.md` - Comprehensive requirements analysis
- `stakeholder-analysis.md` - Stakeholder identification and analysis
- `competitive-analysis.md` - Market and competitive research

### Planning Tasks
- `project-planning.md` - Strategic project planning
- `roadmap-creation.md` - Product roadmap development
- `resource-planning.md` - Resource allocation and timeline planning

### Design Tasks
- `system-design.md` - Technical system architecture design
- `database-design.md` - Database schema and relationship design
- `api-design.md` - REST API endpoint and contract design

### Implementation Tasks
- `code-generation.md` - Complete application code generation
- `configuration-setup.md` - Environment and build configuration
- `deployment-setup.md` - Production deployment preparation

### Quality Tasks
- `test-creation.md` - Comprehensive test suite creation
- `code-review.md` - Code quality and standards review
- `security-review.md` - Security vulnerability assessment

### UX Tasks
- `ui-specification.md` - User interface specification and design
- `ux-flow-design.md` - User experience flow design
- `accessibility-review.md` - Accessibility compliance review

## Context Management

### Session State
The system maintains context across all workflow steps:

```json
{
  "project_name": "string",
  "workflow_type": "string", 
  "current_step": "integer",
  "completed_steps": ["array"],
  "generated_artifacts": {
    "specifications": ["array"],
    "designs": ["array"],
    "code": ["array"],
    "tests": ["array"]
  },
  "project_context": {
    "requirements": "object",
    "architecture": "object",
    "decisions": "array"
  }
}
```

### Artifact Management
All generated content is tracked and available for reference:

- **Specifications**: Business and technical requirements
- **Designs**: Architecture diagrams and UI/UX specs  
- **Implementation**: Source code and configuration files
- **Documentation**: User guides and technical documentation
- **Tests**: Automated test suites and quality reports

## Advanced Usage

### Custom Workflows
Create project-specific workflows by:

1. **Defining Custom Steps**: Add specialized tasks for your domain
2. **Agent Specialization**: Configure agents for specific technologies
3. **Template Customization**: Create project-specific document templates
4. **Quality Gates**: Define custom validation criteria

### Integration Patterns
Integrate with existing tools:

- **Version Control**: Automatic git repository setup and commit strategies
- **CI/CD**: Generate pipeline configurations for deployment automation
- **Documentation**: Create comprehensive project documentation
- **Testing**: Integrate with testing frameworks and quality tools

### Error Recovery
Handle execution issues:

- **Step Retry**: Re-execute failed workflow steps
- **Context Recovery**: Restore from previous successful state  
- **Manual Intervention**: Pause workflow for manual review
- **Alternative Paths**: Switch workflows mid-execution

## Best Practices

### Effective Prompts
```
✅ "Create a task management web application with user authentication, project organization, and real-time notifications"

❌ "Build an app"
```

### Specification Quality
- **Be Specific**: Provide detailed requirements and constraints
- **Include Context**: Explain the business problem and user needs
- **Define Success**: Specify measurable success criteria
- **Consider Scale**: Mention expected user volume and performance needs

### Workflow Selection
- **Match Complexity**: Choose workflows that align with project complexity
- **Consider Constraints**: Factor in timeline, budget, and technical limitations
- **Plan for Growth**: Select architectures that can scale with your needs
- **Team Alignment**: Ensure workflow matches team capabilities

### Quality Assurance
- **Review Specifications**: Validate requirements before implementation
- **Test Early**: Include testing considerations in planning phase
- **Document Decisions**: Capture rationale for major technical choices
- **Monitor Progress**: Regular reviews at each workflow milestone

## Troubleshooting

### Common Issues

**Workflow Not Triggering**
- Check activation phrases match the documented triggers
- Ensure `.claude/CLAUDE.md` is properly configured in your project
- Verify all workflow files are present and correctly formatted

**Agent Not Loading** 
- Confirm agent prompt files exist in `.claude/agents/*/prompt.md`
- Check agent configuration in workflow YAML files
- Validate agent personas are complete and well-defined

**Template Errors**
- Verify all template variables use `{{variable_name}}` format
- Ensure referenced templates exist in `.claude/templates/`
- Check template paths in task definitions are correct

**Context Loss**
- Confirm session state is being maintained
- Check that previous outputs are being referenced correctly
- Validate context files are properly formatted JSON

### Support Resources

- **System Files**: Review `.claude/system/` for configuration guidance
- **Example Projects**: Check `.claude/examples/` for reference implementations
- **Validation Schemas**: Use `.claude/system/validation-schemas.md` for structure validation
- **SDD Principles**: Follow `.claude/system/sdd-principles.md` for best practices

---

*This reference guide provides comprehensive coverage of the BMAD-Spec Orchestrator system for Claude Code. For specific implementation questions, refer to the individual agent prompts and task definitions in the `.claude/` directory structure.*