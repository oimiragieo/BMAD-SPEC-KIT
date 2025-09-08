# Basic Projects

Learn the BMAD-Spec Orchestrator through hands-on examples. Each example shows different agent interactions and complexity levels.

## Prerequisites

- BMAD-Spec Orchestrator installed ([Installation Guide](../deployment/installation.md))
- Claude Code with the `.claude` folder in your project
- Basic understanding of software development concepts

## Project Examples by Complexity

### Complexity Level 1-2: Simple Applications

#### Personal Blog Platform

**Request:**
```
I want to create a personal blog platform where I can write and publish markdown articles with basic categorization.
```

**Expected Agent Flow:**
1. **Analyst Agent** (optional) - Quick market overview
2. **PM Agent** - Simple feature list and user stories
3. **Developer Agent** - Direct implementation

**What You'll See:**
- Minimal planning phase
- Focus on core functionality
- Single-agent implementation
- Basic testing strategy

**Outcome:**
- Static site generator with markdown support
- Category system
- Basic responsive design
- Deploy-ready code

#### Task Tracker

**Request:**
```
Build a simple personal task tracker with add, complete, and delete functionality.
```

**Agent Interaction:**
- **Developer Agent** handles everything
- Uses `think` for standard implementation
- Follows code quality rules (80% test coverage)
- WCAG 2.1 AA compliance

**Generated Features:**
- Local storage persistence
- Clean, accessible interface
- Comprehensive test suite
- Mobile-friendly design

### Complexity Level 3-4: Small Business Applications

#### Restaurant Menu Manager

**Request:**
```
Create a web application for restaurant owners to manage their menu items, pricing, and availability with customer-facing display.
```

**Agent Flow:**
1. **Analyst** - Restaurant industry research
2. **PM** - Detailed requirements gathering
3. **UX Expert** - User interface design
4. **Developer** - Implementation with testing

**Key Features:**
- Admin panel for menu management
- Public menu display
- Real-time availability updates
- Mobile-first design

#### Inventory Tracking System

**Request:**
```
I need an inventory management system for a small retail business with product tracking, low stock alerts, and basic reporting.
```

**Expected Workflow:**
1. **Analyst** - `think hard` about retail inventory challenges
2. **PM** - Comprehensive feature planning
3. **Architect** - `think harder` about data structure and scalability
4. **UX Expert** - Dashboard and workflow design
5. **Developer** - Full-stack implementation
6. **QA** - Testing and validation

**Enterprise Features Applied:**
- Security-first data handling
- Performance-optimized queries
- Comprehensive audit trails
- Accessibility compliance

### Complexity Level 5-6: Medium Enterprise Applications

#### Customer Relationship Management (CRM)

**Request:**
```
Design and build a CRM system for a growing sales team with contact management, deal tracking, and basic analytics.
```

**Full Agent Orchestra:**
1. **Analyst** - `think hard` competitive analysis
2. **PM** - Comprehensive PRD with user stories
3. **Architect** - `ultrathink` system architecture and security
4. **UX Expert** - Complete user experience design
5. **Developer** - Full-stack implementation
6. **QA** - Comprehensive testing strategy

**Quality Gates Applied:**
- Cross-agent validation
- Security review at each stage
- Performance optimization
- Accessibility compliance

#### Project Management Platform

**Request:**
```
Create a project management platform with team collaboration, task assignment, time tracking, and progress reporting capabilities.
```

**Complex Agent Interactions:**
- **Parallel execution** - UX Expert and Architect work simultaneously
- **Context preservation** - Each agent builds on previous work
- **Quality validation** - Multiple validation layers

**Enterprise Standards:**
- Zero-trust security architecture
- 80%+ test coverage
- Performance optimization throughout
- Professional documentation

## Step-by-Step Walkthrough: Blog Platform

Let's walk through creating a personal blog platform to see how the system works.

### Step 1: Project Initialization

```bash
# Set up your project
mkdir my-blog-platform
cd my-blog-platform
cp -r /path/to/BMAD-SPEC-KIT/bmad-spec-orchestrator-kit/.claude .
```

### Step 2: Agent Activation

In Claude Code:
```
I want to create a personal blog platform where I can write and publish markdown articles with basic categorization.
```

### Step 3: System Response

```
🎯 BMAD-Spec Orchestrator Activated
📊 Complexity Assessment: Level 2/10 - Simple Application  
🔄 Recommended Workflow: greenfield-ui

Activating streamlined workflow for simple application...

🔍 Analyst Agent (Optional): Quick market analysis
📋 PM Agent: Feature planning and user stories
💻 Developer Agent: Direct implementation
```

### Step 4: PM Agent Planning

The PM Agent uses `think` for standard planning:

```markdown
## Product Requirements Document: Personal Blog Platform

### Core Features
1. **Article Management**
   - Write articles in Markdown
   - Save drafts and publish
   - Edit existing articles

2. **Categorization System**  
   - Assign categories to articles
   - Filter articles by category
   - Category management interface

3. **Public Display**
   - Clean, readable article display
   - Category navigation
   - Mobile-responsive design

### User Stories
- As a writer, I can create new blog posts in Markdown
- As a writer, I can organize posts with categories
- As a reader, I can browse posts by category
```

### Step 5: Developer Implementation

The Developer Agent follows enterprise rules:

```typescript
// Generated with 80% test coverage requirement
// WCAG 2.1 AA accessibility compliance
// Performance optimized

// Article management with comprehensive validation
export interface Article {
  id: string
  title: string
  content: string
  category: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

// Secure, validated API endpoints
export class ArticleService {
  // Implementation with error handling
  // Input validation and sanitization
  // Performance optimizations
}
```

### Step 6: Quality Assurance

Automatic quality gates ensure:
- ✅ Code quality standards met
- ✅ Accessibility requirements satisfied
- ✅ Security best practices applied
- ✅ Test coverage above 80%
- ✅ Performance optimized

## Common Patterns You'll See

### Agent Selection Logic

**Simple requests** → Direct to Developer
```
"Create a calculator app"
→ Developer Agent with basic implementation
```

**Business requests** → PM + Developer
```  
"Build a customer feedback system"
→ PM Agent (planning) → Developer Agent (implementation)
```

**Complex systems** → Full orchestration
```
"Design a multi-tenant SaaS platform"
→ All 10 agents with quality gates
```

### Thinking Optimization Patterns

**Simple logic** → `think`
```
Validation, basic implementation, documentation
```

**Important decisions** → `think hard`  
```
Technology selection, user experience design
```

**Complex analysis** → `think harder`
```
Architecture trade-offs, risk assessment
```

**Critical decisions** → `ultrathink`
```
Security architecture, system design
```

### Quality Gate Patterns

**Level 1-2 Projects:**
- Basic code quality checks
- Accessibility validation
- Simple security review

**Level 3-4 Projects:**
- Cross-agent validation
- Performance optimization
- Comprehensive testing

**Level 5+ Projects:**
- Multiple quality layers
- Security audits
- Enterprise compliance

## Tips for Success

### Request Formulation

**Be specific about purpose:**
✅ "Create a blog platform for personal writing"
❌ "Make a website"

**Include key requirements:**
✅ "Inventory system with low stock alerts"
❌ "Something for tracking stuff"

**Mention complexity when known:**
✅ "Simple task tracker for personal use"
✅ "Enterprise CRM system with advanced analytics"

### Working with Agents

**Let agents complete their work:**
- Don't interrupt mid-process
- Allow full context building
- Trust the quality gates

**Provide feedback when needed:**
- "The UX design should focus more on mobile"
- "Add two-factor authentication for security"
- "Include API documentation"

**Request specific thinking levels:**
- "Use ultrathink for the security architecture"
- "Think harder about the database design trade-offs"

### Customizing Output

**Modify enterprise rules** in `.claude/rules/`:
- Adjust coding standards
- Update design requirements  
- Modify security policies

**Add domain knowledge** in `.claude/data/`:
- Industry-specific information
- Technical preferences
- Custom methodologies

## Next Steps

### Try More Examples
- **[Enterprise Projects](enterprise-projects.md)** - Complex multi-agent workflows
- **[Custom Implementations](custom-implementations.md)** - Advanced customization

### Learn the System
- **[Agent Reference](../user-guide/agent-reference.md)** - Deep dive into all 10 agents
- **[Workflow Guide](../user-guide/workflow-guide.md)** - Understanding complexity scoring

### Get Help
- **[Troubleshooting](../deployment/troubleshooting.md)** - Common issues and solutions
- **[GitHub Issues](https://github.com/oimiragieo/BMAD-SPEC-KIT/issues)** - Technical support
- **[GitHub Discussions](https://github.com/oimiragieo/BMAD-SPEC-KIT/discussions)** - Community help

---

**Start building with AI orchestration today**