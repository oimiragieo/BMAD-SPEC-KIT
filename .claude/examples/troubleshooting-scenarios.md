# BMAD-Spec Orchestrator Troubleshooting Scenarios

## Common Issues and Solutions

### Scenario 1: Missing Agent Prompt
**Problem**: 
```
ERROR: Cannot load agent prompt for 'architect'
File '.claude/agents/architect/prompt.md' not found
```

**Diagnosis**: Agent prompt file is missing or corrupted

**Solution**:
1. Check if file exists: `.claude/agents/architect/prompt.md`
2. Verify file permissions allow reading
3. Restore from backup or recreate the agent prompt file
4. Ensure agent name spelling is correct

**Example Fix**:
```
User: "The architect agent isn't working"
Claude: "I see the issue - the architect agent prompt file is missing. Let me check... 

The file `.claude/agents/architect/prompt.md` cannot be found. This is a critical file for the architect agent to function.

To fix this:
1. I can recreate the architect prompt file for you
2. Or you can restore it from a backup if available

Would you like me to recreate the architect agent prompt file?"
```

### Scenario 2: Incomplete Template Variables
**Problem**: 
```
Generated document has placeholder text:
"Project Name: {{project_name}}"
"Technology: {{undefined}}"
```

**Diagnosis**: Template variables weren't properly populated during document generation

**Solution**:
1. Identify which variables are missing values
2. Check if user input was collected for all required variables
3. Verify template processing completed successfully
4. Re-process template with correct variable values

**Example Fix**:
```
User: "The project brief has placeholder text instead of real values"
Claude: "I see the issue - some template variables weren't filled in properly. Looking at your project brief, I can see:

✅ Filled: project_name, user_type, core_features
❌ Missing: technology_stack, success_criteria

Let me gather the missing information:
1. What technology stack do you prefer? (React, Vue, Angular for frontend)
2. How will you measure success for this project?

Once you provide these, I'll regenerate the project brief with all variables properly filled."
```

### Scenario 3: Workflow Step Dependencies Not Met
**Problem**: 
```
Cannot proceed to Step 3 (Architecture)
Step 2 (Requirements) not completed successfully
Missing required artifact: prd.md
```

**Diagnosis**: Previous workflow step didn't complete properly, blocking progression

**Solution**:
1. Check completion status of previous step
2. Verify required artifacts were generated
3. Complete missing requirements from previous step
4. Validate step outputs meet quality criteria

**Example Fix**:
```
User: "Why can't I proceed to the architecture step?"
Claude: "The workflow is blocked because Step 2 (Requirements Documentation) didn't complete successfully. I'm checking the status...

Issue found: The PRD creation was interrupted and the file wasn't saved properly.

To fix this:
1. Let me resume the PM agent role and complete the PRD
2. I'll use the project brief from Step 1 as input
3. Once the PRD is complete, we can proceed to architecture

Would you like me to complete the PRD now?"
```

### Scenario 4: Agent Output Quality Issues
**Problem**: Generated code or documentation is incomplete or contains errors

**Diagnosis**: Agent output doesn't meet quality standards

**Solution**:
1. Re-run the agent with clearer instructions
2. Provide additional context or constraints
3. Use QA agent to review and improve output
4. Break complex tasks into smaller steps

**Example Fix**:
```
User: "The generated React component is missing error handling"
Claude: "You're right - the component I generated doesn't include proper error handling. As the Developer agent, I should have included:

1. Try-catch blocks for async operations
2. Error state management
3. User-friendly error messages
4. Fallback UI for error states

Let me regenerate the component with comprehensive error handling:

```javascript
// Updated TaskCard component with error handling
const TaskCard = ({ task, onUpdate }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTaskUpdate = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      await onUpdate(task.id, updates);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Task update error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorBoundary message={error} onRetry={() => setError(null)} />;
  }

  // ... rest of component
};
```

Is this the level of error handling you were looking for?"
```

### Scenario 5: User Requirements Confusion
**Problem**: System generates solutions that don't match user intent

**Diagnosis**: Misunderstanding of user requirements or insufficient clarification

**Solution**:
1. Stop current workflow and clarify requirements
2. Ask specific questions about user intent
3. Provide examples of different solution approaches
4. Get explicit user confirmation before proceeding

**Example Fix**:
```
User: "This isn't what I wanted - I need a simple API, not a full web application"
Claude: "I apologize for the misunderstanding! I created a full-stack web application when you needed just an API.

Let me clarify your requirements:
1. You want ONLY a REST API (no frontend/UI)?
2. What will consume this API? (mobile app, other services, etc.)
3. Do you need a database, or just API endpoints?

Based on your answers, I should use the 'greenfield-service' workflow instead of 'greenfield-fullstack'. 

Would you like me to:
A) Start over with the correct service-only workflow
B) Extract just the API parts from what I've already created
C) Modify the current solution to be API-focused

Which approach would work best for you?"
```

### Scenario 6: Performance and Context Issues
**Problem**: System becomes slow or loses context during long workflows

**Diagnosis**: Context overload or session state issues

**Solution**:
1. Save progress to session files
2. Summarize and compress context
3. Break workflow into smaller sessions
4. Use artifact references instead of inline content

**Example Fix**:
```
User: "The system seems to be getting slower and forgetting things"
Claude: "I notice we're dealing with a lot of context from this complex full-stack project. Let me optimize our session:

1. Saving current progress to session file
2. Moving large artifacts (PRD, architecture docs) to separate files
3. Creating summary references instead of keeping full content in memory

Current status:
✅ Project brief saved to context/artifacts/project-brief.md
✅ PRD saved to context/artifacts/prd.md  
✅ Architecture saved to context/artifacts/fullstack-architecture.md

I can now reference these files by name rather than keeping all content active. This should improve performance for the remaining workflow steps.

Ready to continue with the next step - would you like me to proceed with the implementation phase?"
```

## Prevention Strategies

### Best Practices for Users:
1. **Be Specific**: Provide clear, detailed requirements from the start
2. **Confirm Understanding**: Verify that the system understands your needs correctly
3. **Review Outputs**: Check generated documents before proceeding to next steps
4. **Ask Questions**: Don't hesitate to clarify or request changes
5. **Save Progress**: Regularly confirm that artifacts are saved properly

### System Self-Checks:
1. **Validate Inputs**: Confirm all required information is available before proceeding
2. **Check Dependencies**: Verify previous steps completed successfully
3. **Quality Review**: Validate outputs meet minimum quality standards
4. **Context Management**: Monitor and optimize session state regularly
5. **Error Detection**: Proactively identify and address potential issues

### Recovery Procedures:
1. **State Restoration**: Ability to resume from any saved checkpoint
2. **Artifact Recovery**: Reconstruct missing files from available information
3. **Context Rebuilding**: Regenerate session context from artifacts
4. **Graceful Degradation**: Continue with reduced functionality when possible
5. **User Communication**: Keep users informed of issues and recovery progress

This troubleshooting guide helps users and the system handle common issues that may arise during BMAD-Spec Orchestrator operation, ensuring smooth and reliable workflow execution.