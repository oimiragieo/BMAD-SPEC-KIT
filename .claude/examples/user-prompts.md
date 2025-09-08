# BMAD-Spec Orchestrator User Prompts & Examples

## Activation Prompts

### Starting a New Project
```
"Create a web application for task management"
"Build a REST API for user authentication"
"I need a full-stack e-commerce platform"
"Use BMAD to create a mobile-responsive blog"
```

### Working with Existing Projects
```
"Enhance my existing React app with a new dashboard"
"Add payment processing to my e-commerce site"
"Modernize the UI of my legacy application"
"Improve the performance of my API endpoints"
```

### Agent-Specific Activations
```
"@analyst - analyze this project brief"
"@pm - create a PRD for this feature"
"@architect - design the system architecture"
"@developer - implement this user story"
"@qa - create a test plan for this feature"
"@ux-expert - design the user interface"
```

## Example Conversations

### Example 1: New Web Application
**User**: "Create a task management web application"

**Claude**: "I'll help you create a task management web application using the BMAD framework. Let me activate the appropriate workflow.

Based on your request, I'm selecting the **greenfield-fullstack** workflow since you need a complete web application.

As the ANALYST agent, I'll start by creating a project brief. Let me gather some information:

1. Who are the primary users of this task management app?
2. What are the key features you need (task creation, assignments, deadlines, etc.)?
3. Do you have any technology preferences?

Let me load the analyst agent prompt and create a comprehensive project brief..."

### Example 2: Existing Project Enhancement
**User**: "Add a user dashboard to my existing React application"

**Claude**: "I'll help you add a user dashboard to your existing React application using the **brownfield-ui** workflow.

As the ARCHITECT agent, let me first analyze your existing project structure. I can see you have a React application with [analysis of current structure].

Now as the PM agent, I'll create a brownfield PRD focusing on the dashboard enhancement..."

### Example 3: API Development
**User**: "Build a REST API for user authentication and profile management"

**Claude**: "I'll create a REST API for user authentication and profile management using the **greenfield-service** workflow.

As the ANALYST agent, I'm creating a project brief for your authentication API. Based on your requirements, I'll design:

- User registration and login endpoints
- JWT token management
- Profile CRUD operations
- Security and validation layers

Let me start with the project analysis..."

## Workflow Selection Examples

### Greenfield Projects (New from Scratch)
- **greenfield-ui**: "Create a React dashboard", "Build a mobile app interface"
- **greenfield-service**: "Create an authentication API", "Build a microservice for payments"  
- **greenfield-fullstack**: "Create a complete e-commerce platform", "Build a social media app"

### Brownfield Projects (Existing Codebase)
- **brownfield-ui**: "Modernize the interface of my app", "Add a new feature to existing UI"
- **brownfield-service**: "Add new endpoints to my API", "Enhance existing service performance"
- **brownfield-fullstack**: "Add major functionality to existing app", "Modernize entire application stack"

## Agent Handoff Examples

### From Analyst to PM
"Project brief is complete and saved as `context/artifacts/project-brief.md`. The analysis shows a need for a multi-tenant task management system with real-time collaboration features. Please create the detailed PRD."

### From PM to UX Expert  
"PRD is complete with 3 epics covering user management, task operations, and collaboration features. Please create the UI/UX specification focusing on intuitive task creation and team collaboration workflows."

### From UX Expert to Architect
"UI/UX specification is complete, saved as `context/artifacts/front-end-spec.md`. The design calls for a responsive dashboard with drag-and-drop task management and real-time notifications. Please create the technical architecture."

### From Architect to Developer
"Architecture is complete. The system uses React frontend, Node.js/Express backend, PostgreSQL database, and WebSocket for real-time features. Please implement the user authentication story."

## Common User Questions

### Project Planning
**Q**: "How do I know which workflow to choose?"
**A**: Describe your project and I'll recommend the appropriate workflow:
- New project = Greenfield workflow
- Existing project = Brownfield workflow  
- UI focused = UI workflow
- API focused = Service workflow
- Complete app = Fullstack workflow

### Agent Capabilities
**Q**: "What can each agent do?"
**A**: Each agent has specific expertise:
- **Analyst**: Market research, requirements analysis, project briefs
- **PM**: Product requirements, user stories, project planning
- **Architect**: System design, technology decisions, technical architecture
- **Developer**: Code implementation, technical development
- **QA**: Test planning, quality assurance, bug analysis
- **UX Expert**: UI design, user experience, interface specifications

### Process Questions
**Q**: "Can I modify the generated documents?"
**A**: Yes! All documents are saved to your `context/artifacts/` folder and can be modified. The system builds upon previous outputs, so changes will be incorporated into subsequent steps.

**Q**: "What if I want to change direction mid-project?"
**A**: You can redirect at any time. Just let me know what you want to change, and I'll adjust the workflow accordingly. All previous work is preserved.

## Advanced Usage Examples

### Custom Specifications
```
"Create a Vue.js application with Supabase backend"
"Build a Python FastAPI service with PostgreSQL"  
"Use Next.js with Prisma and deploy to Vercel"
```

### Integration Requirements
```
"Integrate with Stripe for payments"
"Add Auth0 authentication"
"Connect to external weather API"
"Include Google Maps integration"
```

### Performance Specifications
```
"Must handle 10,000 concurrent users"
"Sub-100ms API response times required"
"Mobile-first responsive design"
"Offline capability needed"
```

These examples demonstrate the flexible, conversational nature of the BMAD-Spec Orchestrator System while maintaining structured, systematic development processes.