# Context Engine - Advanced Context Management

## System Overview

The Context Engine provides structured data passing, validation, and transformation between agents to ensure consistent, high-quality outputs across the entire workflow.

## Context Schema Definition

### Session Context Structure
```json
{
  "session_id": "bmad-session-{{timestamp}}-{{random}}",
  "project_metadata": {
    "name": "{{project_name}}",
    "workflow_type": "{{workflow_type}}",
    "complexity_score": 0,
    "project_type": "{{project_type}}",
    "created_at": "{{iso_timestamp}}",
    "estimated_duration": "{{duration_estimate}}"
  },
  "workflow_state": {
    "current_step": 0,
    "completed_steps": [],
    "failed_steps": [],
    "quality_gates_passed": [],
    "overall_quality_score": 0.0
  },
  "agent_contexts": {
    "analyst": {
      "status": "pending|in_progress|completed|failed",
      "execution_start": null,
      "execution_end": null,
      "outputs": {
        "project_brief": {
          "file_reference": "artifacts/project-brief.md",
          "structured_data": {
            "problem_statement": "",
            "target_users": [],
            "core_features": [],
            "success_metrics": [],
            "technical_constraints": [],
            "complexity_indicators": {
              "feature_count": 0,
              "integration_complexity": 0,
              "user_type_complexity": 0,
              "data_complexity": 0
            }
          },
          "quality_metrics": {
            "completeness_score": 0,
            "clarity_score": 0,
            "feasibility_score": 0,
            "overall_score": 0
          }
        }
      },
      "validation_results": [],
      "retries": 0
    },
    "pm": {
      "status": "pending",
      "inputs": {
        "required": ["analyst.outputs.project_brief"],
        "optional": ["global_context.technical_preferences"]
      },
      "outputs": {
        "prd": {
          "file_reference": "artifacts/prd.md",
          "structured_data": {
            "user_stories": [],
            "functional_requirements": [],
            "non_functional_requirements": [],
            "acceptance_criteria": [],
            "priority_matrix": {},
            "success_metrics": []
          },
          "quality_metrics": {
            "requirements_coverage": 0,
            "story_completeness": 0,
            "testability_score": 0,
            "overall_score": 0
          }
        }
      }
    },
    "architect": {
      "status": "pending",
      "inputs": {
        "required": ["pm.outputs.prd", "analyst.outputs.project_brief.structured_data.technical_constraints"],
        "optional": ["global_context.technology_preferences"]
      },
      "outputs": {
        "architecture": {
          "file_reference": "artifacts/architecture.md",
          "structured_data": {
            "technology_stack": {},
            "system_architecture": {},
            "database_design": {},
            "api_specifications": {},
            "security_architecture": {},
            "performance_considerations": {}
          },
          "quality_metrics": {
            "technical_feasibility": 0,
            "scalability_assessment": 0,
            "security_coverage": 0,
            "overall_score": 0
          }
        }
      }
    },
    "ux_expert": {
      "status": "pending", 
      "inputs": {
        "required": ["pm.outputs.prd", "analyst.outputs.project_brief.structured_data.target_users"],
        "optional": ["architect.outputs.architecture.structured_data.system_architecture"]
      },
      "outputs": {
        "ui_spec": {
          "file_reference": "artifacts/ui-spec.md",
          "structured_data": {
            "user_personas": [],
            "user_journeys": [],
            "component_specifications": {},
            "design_system": {},
            "accessibility_requirements": [],
            "responsive_specifications": {}
          },
          "quality_metrics": {
            "user_experience_score": 0,
            "accessibility_score": 0,
            "design_completeness": 0,
            "overall_score": 0
          }
        }
      }
    },
    "developer": {
      "status": "pending",
      "inputs": {
        "required": ["architect.outputs.architecture", "ux_expert.outputs.ui_spec", "pm.outputs.prd"],
        "optional": ["global_context.coding_standards"]
      },
      "outputs": {
        "implementation": {
          "file_references": ["src/frontend/", "src/backend/", "config/"],
          "structured_data": {
            "component_list": [],
            "api_endpoints": [],
            "database_schema": {},
            "configuration_files": [],
            "test_coverage": {}
          },
          "quality_metrics": {
            "code_quality_score": 0,
            "test_coverage_score": 0,
            "security_implementation": 0,
            "overall_score": 0
          }
        }
      }
    },
    "qa": {
      "status": "pending",
      "inputs": {
        "required": ["developer.outputs.implementation", "pm.outputs.prd"],
        "optional": ["architect.outputs.architecture.structured_data.performance_considerations"]
      },
      "outputs": {
        "test_plan": {
          "file_reference": "artifacts/test-plan.md",
          "structured_data": {
            "test_scenarios": [],
            "coverage_analysis": {},
            "quality_gates": [],
            "risk_assessment": {},
            "performance_tests": []
          },
          "quality_metrics": {
            "coverage_completeness": 0,
            "risk_assessment_quality": 0,
            "test_scenario_quality": 0,
            "overall_score": 0
          }
        }
      }
    }
  },
  "global_context": {
    "project_constraints": {
      "budget_level": "startup|enterprise|unlimited",
      "timeline": "rush|normal|extended",
      "team_size": 0,
      "complexity_tolerance": "simple|moderate|complex"
    },
    "technical_preferences": {
      "frontend_framework": "",
      "backend_technology": "",
      "database_preference": "",
      "deployment_target": "",
      "performance_requirements": {}
    },
    "quality_standards": {
      "minimum_test_coverage": 80,
      "code_quality_threshold": 8.0,
      "accessibility_level": "WCAG-AA",
      "security_requirements": []
    },
    "business_context": {
      "industry_sector": "",
      "target_market": "",
      "competitive_landscape": "",
      "regulatory_requirements": []
    }
  },
  "validation_history": [],
  "decision_log": []
}
```

## Context Validation Rules

### Input Validation for Each Agent
```yaml
validation_rules:
  analyst:
    inputs:
      user_specification:
        required: true
        min_length: 50
        must_contain: ["problem", "solution", "users"]
    
  pm:
    inputs:
      analyst_project_brief:
        required: true
        required_sections: ["problem_statement", "target_users", "core_features"]
        quality_threshold: 6.0
        
  architect:
    inputs:
      pm_prd:
        required: true
        required_sections: ["functional_requirements", "non_functional_requirements"]
        quality_threshold: 7.0
      technical_constraints:
        source: "analyst.outputs.project_brief.structured_data.technical_constraints"
        format: "array"
        
  ux_expert:
    inputs:
      user_requirements:
        source: "pm.outputs.prd.structured_data.user_stories"
        min_count: 3
      target_users:
        source: "analyst.outputs.project_brief.structured_data.target_users" 
        min_count: 1
        
  developer:
    inputs:
      architecture_spec:
        source: "architect.outputs.architecture"
        required_sections: ["technology_stack", "system_architecture", "database_design"]
        quality_threshold: 7.0
      ui_specifications:
        source: "ux_expert.outputs.ui_spec"
        required_sections: ["component_specifications", "user_journeys"]
        quality_threshold: 6.5
        
  qa:
    inputs:
      implementation_artifacts:
        source: "developer.outputs.implementation"
        required_data: ["component_list", "api_endpoints", "test_coverage"]
      requirements_traceability:
        source: "pm.outputs.prd.structured_data.user_stories"
        format: "array"
```

## Context Transformation Engine

### Data Extraction and Transformation
```yaml
transformations:
  complexity_scoring:
    trigger: "analyst_completion"
    inputs:
      - "analyst.outputs.project_brief.structured_data.core_features"
      - "analyst.outputs.project_brief.structured_data.target_users"
      - "analyst.outputs.project_brief.structured_data.technical_constraints"
    algorithm: |
      feature_complexity = len(core_features) * 2
      user_complexity = len(target_users) * 1.5
      technical_complexity = len(technical_constraints) * 3
      complexity_score = (feature_complexity + user_complexity + technical_complexity) / 3
    output: "project_metadata.complexity_score"
    
  workflow_adaptation:
    trigger: "complexity_scoring_completion"
    logic: |
      if complexity_score <= 4:
        workflow_type = "simplified"
        skip_steps = ["optional_architectural_review"]
      elif complexity_score <= 7:
        workflow_type = "standard"
      else:
        workflow_type = "comprehensive"  
        add_steps = ["detailed_security_review", "performance_analysis"]
        
  technology_constraints_propagation:
    trigger: "analyst_completion"
    source: "analyst.outputs.project_brief.structured_data.technical_constraints"
    destinations:
      - "architect.inputs.technical_constraints"
      - "global_context.technical_preferences.constraints"
      
  user_persona_enrichment:
    trigger: "pm_completion"
    inputs:
      - "analyst.outputs.project_brief.structured_data.target_users"
      - "pm.outputs.prd.structured_data.user_stories"
    transformation: |
      for user_type in target_users:
        related_stories = filter_stories_by_user(user_stories, user_type)
        enhanced_persona = create_detailed_persona(user_type, related_stories)
        enriched_personas.append(enhanced_persona)
    output: "ux_expert.inputs.enriched_personas"
```

## Context Access Methods

### Agent Context Injection System
Each agent prompt receives structured context through these injection points:

```yaml
# Agent prompt enhancement template
agent_context_injection: |
  ## <available_context>
  You have access to the following structured context from previous agents:
  
  {{#if analyst.completed}}
  ### From Analyst Agent:
  **Problem Statement**: {{analyst.outputs.project_brief.structured_data.problem_statement}}
  **Target Users**: {{#each analyst.outputs.project_brief.structured_data.target_users}}{{this}}, {{/each}}
  **Core Features**: {{#each analyst.outputs.project_brief.structured_data.core_features}}{{this}}, {{/each}}
  **Technical Constraints**: {{#each analyst.outputs.project_brief.structured_data.technical_constraints}}{{this}}, {{/each}}
  **Complexity Score**: {{project_metadata.complexity_score}}
  {{/if}}
  
  {{#if pm.completed}}
  ### From PM Agent:
  **Functional Requirements**: {{pm.outputs.prd.structured_data.functional_requirements}}
  **User Stories Count**: {{pm.outputs.prd.structured_data.user_stories.length}}
  **Success Metrics**: {{pm.outputs.prd.structured_data.success_metrics}}
  {{/if}}
  
  ### Project Context:
  **Budget Level**: {{global_context.project_constraints.budget_level}}
  **Timeline**: {{global_context.project_constraints.timeline}}
  **Quality Standards**: Minimum {{global_context.quality_standards.minimum_test_coverage}}% test coverage required
  </available_context>
  
  ## <context_validation>
  Before proceeding, confirm you have received the required context:
  {{#each required_inputs}}
  - [ ] {{this}}: {{lookup ../context this}}
  {{/each}}
  
  If any required context is missing, request it explicitly before proceeding.
  </context_validation>
```

## Context Persistence and Recovery

### Session Management
```yaml
context_persistence:
  storage_location: ".claude/context/sessions/"
  file_naming: "session-{{session_id}}.json"
  backup_frequency: "after_each_agent_completion"
  retention_policy: "30_days"
  
recovery_mechanisms:
  session_restoration:
    trigger: "context_corruption_detected"
    fallback: "restore_from_latest_backup"
    validation: "validate_context_schema"
    
  partial_recovery:
    trigger: "agent_failure_with_partial_completion"
    action: "preserve_completed_outputs"
    recovery: "resume_from_last_checkpoint"
```

This Context Engine provides the foundation for all other system improvements - structured data flow, validation, and intelligent context management between agents.