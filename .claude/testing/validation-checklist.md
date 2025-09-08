# BMAD-Spec Orchestrator Validation Checklist

## System Structure Validation

### Directory Structure
- [ ] `.claude/` root directory exists
- [ ] `.claude/CLAUDE.md` master instructions file exists
- [ ] `.claude/config.yaml` configuration file exists
- [ ] `.claude/orchestrator/` directory with main.md and context-management.md
- [ ] `.claude/agents/` directory with all 6 agent subdirectories
- [ ] `.claude/workflows/` directory with all 6 workflow files
- [ ] `.claude/templates/` directory with core template files
- [ ] `.claude/tasks/` directory with categorized task files
- [ ] `.claude/system/` directory with constitution and validation files
- [ ] `.claude/context/` directory with session.json template
- [ ] `.claude/examples/` directory with user prompts and examples

### Agent Files Validation
- [ ] analyst/prompt.md exists and is complete
- [ ] pm/prompt.md exists and is complete
- [ ] architect/prompt.md exists and is complete
- [ ] developer/prompt.md exists and is complete
- [ ] qa/prompt.md exists and is complete
- [ ] ux-expert/prompt.md exists and is complete
- [ ] All agents have capabilities.yaml files
- [ ] All agents have context.md files

### Workflow Files Validation
- [ ] greenfield-ui.yaml complete with all steps
- [ ] greenfield-service.yaml complete with all steps
- [ ] greenfield-fullstack.yaml complete with all steps
- [ ] brownfield-ui.yaml complete with all steps
- [ ] brownfield-service.yaml complete with all steps
- [ ] brownfield-fullstack.yaml complete with all steps

### Template Files Validation
- [ ] project-brief.md with proper {{variable}} placeholders
- [ ] prd.md with complete structure
- [ ] architecture.md with comprehensive sections
- [ ] ui-spec.md with design specifications
- [ ] brownfield-prd.md with enhancement focus
- [ ] test-plan.md with testing framework

## Functional Validation

### Workflow Activation
- [ ] System recognizes "Create a web app" type requests
- [ ] System selects appropriate workflow based on request type
- [ ] System can differentiate between greenfield and brownfield requests
- [ ] System loads correct agent prompts for workflow steps

### Agent Functionality
- [ ] Each agent can load its specific prompt file
- [ ] Agents can reference previous step outputs
- [ ] Agents can apply appropriate templates
- [ ] Agent handoffs contain required information
- [ ] Context is maintained between agent switches

### Template Processing
- [ ] Templates load without syntax errors
- [ ] Variable placeholders are clearly marked with {{}}
- [ ] Templates cover all necessary sections for their purpose
- [ ] Template structure supports agent requirements

### Task Execution
- [ ] Task files provide clear, actionable instructions
- [ ] Tasks reference correct file paths and resources
- [ ] Task dependencies are properly defined
- [ ] Task outputs align with workflow requirements

## Integration Testing

### End-to-End Workflow Simulation
Test the complete greenfield-ui workflow:
1. [ ] User request recognition and workflow selection
2. [ ] Analyst agent activation and project brief creation
3. [ ] PM agent activation and PRD creation
4. [ ] UX Expert agent activation and UI spec creation
5. [ ] Architect agent activation and architecture creation
6. [ ] Developer agent activation and implementation
7. [ ] QA agent activation and test plan creation
8. [ ] Final review and handoff completion

### Cross-Agent Communication
- [ ] Analyst → PM handoff includes all necessary context
- [ ] PM → UX Expert handoff includes requirements
- [ ] UX Expert → Architect handoff includes design specs
- [ ] Architect → Developer handoff includes technical details
- [ ] Developer → QA handoff includes implementation details
- [ ] All handoffs preserve context and continuity

### Error Handling
- [ ] System handles missing files gracefully
- [ ] System provides clear error messages
- [ ] System offers recovery options for common failures
- [ ] System validates inputs before processing
- [ ] System maintains safe state during errors

## Content Quality Validation

### Agent Prompts
- [ ] Each agent has a clear, distinct personality and expertise
- [ ] Agent capabilities align with their assigned roles
- [ ] Agent instructions are specific and actionable
- [ ] Agent prompts reference correct file paths and templates

### Templates
- [ ] All templates use consistent formatting
- [ ] Variable placeholders follow {{name}} convention
- [ ] Templates include all sections needed for their purpose
- [ ] Template structure supports both simple and complex projects

### Tasks
- [ ] Task instructions are clear and sequential
- [ ] Tasks include proper error handling guidance
- [ ] Tasks reference correct system files and paths
- [ ] Task outcomes align with workflow requirements

### System Files
- [ ] Constitution provides clear governance principles
- [ ] Validation rules cover all critical failure points
- [ ] Error handling procedures are comprehensive
- [ ] Session management supports workflow continuity

## User Experience Validation

### Ease of Use
- [ ] Activation prompts are intuitive and natural
- [ ] System provides clear feedback at each step
- [ ] User can understand what's happening at all times
- [ ] System explains decisions and recommendations

### Flexibility
- [ ] System handles various project types and sizes
- [ ] System adapts to different user expertise levels
- [ ] System allows for mid-workflow direction changes
- [ ] System provides options when multiple paths are available

### Output Quality
- [ ] Generated documents are complete and professional
- [ ] Code examples follow best practices
- [ ] Architecture decisions are well-reasoned
- [ ] All outputs are ready for practical use

## Performance Validation

### System Responsiveness
- [ ] File loading operations complete quickly
- [ ] Agent switches don't cause significant delays
- [ ] Template processing is efficient
- [ ] Context management doesn't become unwieldy

### Scalability
- [ ] System handles complex, multi-epic projects
- [ ] System maintains performance with large document sets
- [ ] Context doesn't become corrupted during long workflows
- [ ] Memory usage remains reasonable throughout execution

## Security Validation

### File Access
- [ ] System only accesses files within its designated directories
- [ ] System doesn't attempt to modify system files
- [ ] System handles file permissions appropriately
- [ ] System validates file contents before processing

### Data Handling
- [ ] System doesn't expose sensitive information in logs
- [ ] System maintains user data privacy
- [ ] System doesn't persist sensitive information unnecessarily
- [ ] System provides appropriate security guidance in outputs

## Validation Results

### Critical Issues (Must Fix)
- [ ] List any issues that prevent basic functionality

### Major Issues (Should Fix)
- [ ] List any issues that significantly impact user experience

### Minor Issues (Could Fix)
- [ ] List any issues that are cosmetic or low-impact

### Recommendations
- [ ] List any improvements or enhancements identified during testing

## Sign-off

### System Validation Complete
- [ ] All critical functionality tested and working
- [ ] All agent interactions verified
- [ ] All workflows can execute successfully
- [ ] All templates process correctly
- [ ] Error handling functions as expected
- [ ] User experience meets quality standards

**Validated by**: ________________  
**Date**: ________________  
**Version**: ________________  

This validation ensures the BMAD-Spec Orchestrator System is ready for production use and delivers reliable, high-quality software development orchestration.