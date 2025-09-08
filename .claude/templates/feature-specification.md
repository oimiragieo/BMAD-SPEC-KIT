# Feature Specification: {{feature_name}}

**Feature ID**: {{feature_id}}  
**Created**: {{creation_date}}  
**Status**: {{status}}  
**Priority**: {{priority}}
**Input**: User description: "{{user_description}}"

## Execution Flow (SDD Approach)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: {{specific_question}}]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for implementation planning)
```

---

## ⚡ SDD Guidelines
- ✅ Focus on **WHAT** users need and **WHY**
- ❌ Avoid **HOW** to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, **specifications drive code**
- 🔄 Specifications are **executable** - they generate implementation

## Problem Statement

### What Problem Does This Solve?
{{problem_description}}

### Who Is Affected?
- **Primary Users**: {{primary_users}}
- **Secondary Users**: {{secondary_users}}
- **Stakeholders**: {{stakeholders}}

### Current Pain Points
- {{pain_point_1}}
- {{pain_point_2}}
- {{pain_point_3}}

## Success Criteria

### Business Objectives
- {{business_objective_1}}
- {{business_objective_2}}
- {{business_objective_3}}

### User Success Metrics  
- {{user_metric_1}}
- {{user_metric_2}}
- {{user_metric_3}}

### Acceptance Definition
{{acceptance_definition}}

## User Scenarios & Testing

### Primary User Flow
```
Given {{precondition}}
When {{user_action}}
Then {{expected_outcome}}
```

### Edge Cases & Error Scenarios
1. **{{edge_case_1}}**: {{edge_case_1_behavior}}
2. **{{edge_case_2}}**: {{edge_case_2_behavior}}
3. **{{edge_case_3}}**: {{edge_case_3_behavior}}

### Integration Points
- {{integration_point_1}}
- {{integration_point_2}}
- {{integration_point_3}}

## Functional Requirements

### Core Requirements
1. **FR1**: {{functional_requirement_1}}
2. **FR2**: {{functional_requirement_2}}
3. **FR3**: {{functional_requirement_3}}

### Data Requirements
- **Input Data**: {{input_data_requirements}}
- **Output Data**: {{output_data_requirements}}
- **Data Validation**: {{data_validation_rules}}
- **Data Retention**: {{data_retention_policy}}

### Business Rules
- {{business_rule_1}}
- {{business_rule_2}}
- {{business_rule_3}}

## Non-Functional Requirements

### Performance Requirements
- **Response Time**: {{response_time_requirement}}
- **Throughput**: {{throughput_requirement}}
- **Concurrent Users**: {{concurrency_requirement}}

### Security Requirements
- **Authentication**: {{auth_requirements}}
- **Authorization**: {{authorization_requirements}}
- **Data Protection**: {{data_protection_requirements}}

### Usability Requirements
- **Accessibility**: {{accessibility_requirements}}
- **User Experience**: {{ux_requirements}}
- **Browser Support**: {{browser_support_requirements}}

## Key Entities & Relationships

### Data Entities
- **{{entity_1}}**: {{entity_1_description}}
  - Attributes: {{entity_1_attributes}}
  - Relationships: {{entity_1_relationships}}

- **{{entity_2}}**: {{entity_2_description}}
  - Attributes: {{entity_2_attributes}}
  - Relationships: {{entity_2_relationships}}

### State Management
- **States**: {{possible_states}}
- **Transitions**: {{state_transitions}}
- **Triggers**: {{state_triggers}}

## Constraints & Assumptions

### Technical Constraints
- {{technical_constraint_1}}
- {{technical_constraint_2}}
- {{technical_constraint_3}}

### Business Constraints
- {{business_constraint_1}}
- {{business_constraint_2}}
- {{business_constraint_3}}

### Key Assumptions
- {{assumption_1}}
- {{assumption_2}}
- {{assumption_3}}

## Dependencies & Prerequisites

### Internal Dependencies
- {{internal_dependency_1}}
- {{internal_dependency_2}}
- {{internal_dependency_3}}

### External Dependencies
- {{external_dependency_1}}
- {{external_dependency_2}}
- {{external_dependency_3}}

### Prerequisites
- {{prerequisite_1}}
- {{prerequisite_2}}
- {{prerequisite_3}}

## Open Questions & Clarifications

### Needs Clarification
- [NEEDS CLARIFICATION: {{clarification_1}}]
- [NEEDS CLARIFICATION: {{clarification_2}}]
- [NEEDS CLARIFICATION: {{clarification_3}}]

### Research Required
- {{research_item_1}}
- {{research_item_2}}
- {{research_item_3}}

## Review Checklist

- [ ] **Testable Requirements**: Every requirement has clear acceptance criteria
- [ ] **No Implementation Details**: Specification focuses on WHAT, not HOW
- [ ] **Complete User Flows**: All primary and edge case scenarios covered
- [ ] **Clear Business Value**: Success criteria directly relate to user/business needs
- [ ] **Unambiguous Language**: No room for multiple interpretations
- [ ] **Data Model Clarity**: All entities and relationships clearly defined
- [ ] **Error Handling**: All failure scenarios have defined behaviors
- [ ] **Integration Points**: All external dependencies identified
- [ ] **Performance Criteria**: Non-functional requirements are measurable
- [ ] **Security Considerations**: Authentication, authorization, and data protection addressed

---

## Implementation Handoff

### For Architect Agent
This specification defines **WHAT** needs to be built. Create technical architecture that determines **HOW** to implement these requirements using appropriate technologies and patterns.

### For Developer Agent  
Implementation must satisfy **ALL** functional requirements and success criteria. Generated code should include comprehensive tests that validate specification compliance.

### For QA Agent
Test plans must verify **EVERY** requirement and scenario defined in this specification. Focus on specification compliance, not just code coverage.

---

*This specification follows Specification-Driven Development (SDD) principles where specifications are executable and generate implementation. Changes to requirements should update this specification first, then propagate to implementation.*