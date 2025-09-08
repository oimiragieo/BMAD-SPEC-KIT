# BMAD Orchestrator - Main Execution Logic

## HOW TO EXECUTE A WORKFLOW

### Step 1: User Request Analysis
When user says "Create a [something]", immediately:

1. Extract key information:
   - What type of application? (web, mobile, API, etc.)
   - What are the main features?
   - Any technical preferences mentioned?
   - Is this new (greenfield) or modifying existing (brownfield)?

2. Create initial specification:
```
PROJECT SPECIFICATION:
Name: [Extracted from request]
Type: [UI/Service/Fullstack]
Features: [List main features]
Constraints: [Any mentioned constraints]
```

### Step 2: Workflow Selection
Check the request against these patterns:

**Greenfield-UI**: 
- Keywords: "frontend", "UI", "website", "web app", "React app", "Vue app"
- No backend mentioned
- Focus on user interface

**Greenfield-Service**:
- Keywords: "API", "backend", "service", "server", "microservice"
- No UI mentioned
- Focus on data/logic

**Greenfield-Fullstack**:
- Keywords: "application", "full app", "complete system"
- Both UI and backend needed
- Default choice if unclear

**Brownfield-[type]**:
- Keywords: "existing", "add to", "modify", "update", "enhance"
- Matches patterns above but for existing code

### Step 3: Load and Execute Workflow

1. Load the workflow file:
   ```
   Reading: .claude/workflows/[selected-workflow].yaml
   ```

2. Announce workflow start:
   ```
   🚀 Starting [Workflow Name] Workflow
   Total Steps: [X]
   Estimated Time: [Y] minutes
   ```

3. For each step in sequence:

   a. Announce the step:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━
   Step [N] of [Total]: [Step Name]
   Agent: [Agent Name]
   Task: [Task Description]
   ━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   b. Load and activate agent:
   ```
   [Read .claude/agents/[agent]/prompt.md]
   
   As the [AGENT NAME], I will now [task description]...
   ```

   c. Apply template if specified:
   ```
   [Read .claude/templates/[template].md]
   Using template: [template name]
   ```

   d. Generate output following template

   e. Display output with proper formatting

   f. Save to context:
   ```
   ✓ Saved to: .claude/context/artifacts/[filename]
   ```

   g. Update session state

### Step 4: Context Management

After each step, maintain context by:

1. Updating session.json:
```json
{
  "current_step": N,
  "completed_steps": [1, 2, ...],
  "artifacts": {
    "step_1": "project-brief.md",
    "step_2": "prd.md"
  },
  "variables": {
    "project_name": "...",
    "tech_stack": "..."
  }
}
```

2. Referencing previous outputs:
```
Building on the [previous artifact] from Step [N]...
```

### Step 5: Completion

When workflow completes:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ WORKFLOW COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated Artifacts:
- 📄 project-brief.md
- 📄 prd.md
- 📄 architecture.md
- 💻 src/components/
- 🧪 tests/

Project Location: ./generated/[project-name]

Next Steps:
1. Review generated artifacts
2. Customize as needed
3. Run: npm install && npm start
```

## EXECUTION EXAMPLE

User: "Create a todo app with React"

Claude's Internal Process:
1. Identify: UI application, React specified
2. Select: greenfield-ui workflow
3. Execute:
   - Step 1: Analyst creates project brief
   - Step 2: PM creates PRD
   - Step 3: UX Expert designs interface
   - Step 4: Architect designs technical structure
   - Step 5: Developer implements components
   - Step 6: QA creates test plan
4. Complete: All artifacts generated

## ERROR HANDLING

If any step fails:
1. Log the error
2. Attempt recovery
3. If cannot recover, skip to next viable step
4. Report issues at completion

## IMPORTANT RULES

1. **Always maintain agent persona** - Each agent speaks differently
2. **Reference previous work** - Build on earlier steps
3. **Follow templates strictly** - But adapt content to project
4. **Generate real, working code** - Not placeholders
5. **Explain what you're doing** - Keep user informed