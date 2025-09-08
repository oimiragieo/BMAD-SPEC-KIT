# Context Management System

## Session Initialization

When starting a new project:

1. Create session ID:
```json
{
  "session_id": "proj_[timestamp]_[random]",
  "created_at": "[ISO timestamp]",
  "project_name": "[from user request]",
  "workflow": "[selected workflow]",
  "status": "active"
}
```

2. Initialize context variables:
```json
{
  "variables": {
    "project_name": "",
    "project_type": "",
    "tech_stack": {
      "frontend": "",
      "backend": "",
      "database": ""
    },
    "features": [],
    "requirements": [],
    "constraints": []
  }
}
```

## Context Building Rules

### From Specification
Extract and store:
- Project name → variables.project_name
- Technology choices → variables.tech_stack
- Feature list → variables.features
- Requirements → variables.requirements

### Between Steps
Pass forward:
- All variables from previous steps
- References to created artifacts
- Decisions made by agents
- Identified risks and constraints

### Context Usage

When agent needs context:
```
Current Context:
- Project: [project_name]
- Step: [current_step] of [total_steps]
- Previous Outputs:
  - Step 1: [artifact_name]
  - Step 2: [artifact_name]
- Key Decisions:
  - Frontend: [tech_choice]
  - Backend: [tech_choice]
  - Database: [tech_choice]
```

## Artifact Management

### Naming Convention
```
[step_number]-[agent]-[artifact_type].[ext]
Examples:
- 01-analyst-project-brief.md
- 02-pm-prd.md
- 03-architect-architecture.md
- 04-developer-components.tsx
```

### Storage Structure
```
.claude/context/artifacts/
├── session_[id]/
│   ├── 01-analyst-project-brief.md
│   ├── 02-pm-prd.md
│   ├── 03-architect-architecture.md
│   └── ...
```

### Artifact References
In subsequent steps, reference as:
```
Referring to the Project Brief (Step 1)...
Based on the PRD (Step 2)...
Following the Architecture (Step 3)...
```

## State Persistence

### After Each Step
Update session.json:
```json
{
  "last_updated": "[timestamp]",
  "current_step": N,
  "steps_completed": [1, 2, 3],
  "steps_remaining": [4, 5, 6],
  "artifacts_created": [
    {
      "step": 1,
      "agent": "analyst",
      "file": "project-brief.md",
      "created_at": "[timestamp]"
    }
  ]
}
```

### Recovery Mechanism
If interrupted:
1. Check session.json for last completed step
2. Load all artifacts from completed steps
3. Rebuild context from saved state
4. Resume from next step

## Variable Extraction

### Automatic Extraction
From user specification, extract:
- **Project Name**: First noun phrase after "create/build"
- **Type**: Based on keywords (app, website, API, service)
- **Features**: Bullet points or "with X, Y, Z"
- **Tech Stack**: Mentioned technologies

### Template Variables
Available in all templates:
- [PROJECT_NAME]
- [PROJECT_TYPE]
- [FRONTEND_TECH]
- [BACKEND_TECH]
- [DATABASE]
- [CURRENT_DATE]
- [STEP_NUMBER]
- [TOTAL_STEPS]