# {{project_name}} Architecture Document

## Introduction

This document outlines the overall project architecture for {{project_name}}, including backend systems, shared services, and technical implementation guidance. It serves as the architectural blueprint for development, ensuring consistency and adherence to chosen patterns and technologies.

### Starter Template or Existing Project
{{starter_template_info}}

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|---------|
| {{date}} | {{version}} | {{description}} | {{author}} |

## High Level Architecture

### Technical Summary
{{technical_summary}}

### High Level Overview
{{architectural_overview}}

### Project Diagram
```mermaid
{{project_diagram}}
```

### Architectural and Design Patterns
- **{{pattern_1_name}}:** {{pattern_1_description}} - _Rationale:_ {{pattern_1_rationale}}
- **{{pattern_2_name}}:** {{pattern_2_description}} - _Rationale:_ {{pattern_2_rationale}}
- **{{pattern_3_name}}:** {{pattern_3_description}} - _Rationale:_ {{pattern_3_rationale}}

## Tech Stack

### Cloud Infrastructure
- **Provider:** {{cloud_provider}}
- **Key Services:** {{core_services_list}}
- **Deployment Regions:** {{regions}}

### Technology Stack Table
| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Language** | {{language}} | {{language_version}} | {{language_purpose}} | {{language_rationale}} |
| **Runtime** | {{runtime}} | {{runtime_version}} | {{runtime_purpose}} | {{runtime_rationale}} |
| **Framework** | {{framework}} | {{framework_version}} | {{framework_purpose}} | {{framework_rationale}} |
| **Database** | {{database}} | {{database_version}} | {{database_purpose}} | {{database_rationale}} |
| **Testing** | {{testing_framework}} | {{testing_version}} | {{testing_purpose}} | {{testing_rationale}} |

## Data Models

### {{model_1_name}}
**Purpose:** {{model_1_purpose}}

**Key Attributes:**
- {{model_1_attr_1}}: {{model_1_type_1}} - {{model_1_desc_1}}
- {{model_1_attr_2}}: {{model_1_type_2}} - {{model_1_desc_2}}
- {{model_1_attr_3}}: {{model_1_type_3}} - {{model_1_desc_3}}

**Relationships:**
- {{model_1_rel_1}}
- {{model_1_rel_2}}

### {{model_2_name}}
**Purpose:** {{model_2_purpose}}

**Key Attributes:**
- {{model_2_attr_1}}: {{model_2_type_1}} - {{model_2_desc_1}}
- {{model_2_attr_2}}: {{model_2_type_2}} - {{model_2_desc_2}}

**Relationships:**
- {{model_2_rel_1}}
- {{model_2_rel_2}}

## Components

### {{component_1_name}}
**Responsibility:** {{component_1_description}}

**Key Interfaces:**
- {{component_1_interface_1}}
- {{component_1_interface_2}}

**Dependencies:** {{component_1_dependencies}}

**Technology Stack:** {{component_1_tech_details}}

### {{component_2_name}}
**Responsibility:** {{component_2_description}}

**Key Interfaces:**
- {{component_2_interface_1}}
- {{component_2_interface_2}}

**Dependencies:** {{component_2_dependencies}}

**Technology Stack:** {{component_2_tech_details}}

### Component Diagrams
```mermaid
{{component_diagram}}
```

## External APIs

### {{api_1_name}} API
- **Purpose:** {{api_1_purpose}}
- **Documentation:** {{api_1_docs_url}}
- **Base URL(s):** {{api_1_base_url}}
- **Authentication:** {{api_1_auth_method}}
- **Rate Limits:** {{api_1_rate_limits}}

**Key Endpoints Used:**
- `{{api_1_method_1}} {{api_1_endpoint_1}}` - {{api_1_endpoint_1_purpose}}
- `{{api_1_method_2}} {{api_1_endpoint_2}}` - {{api_1_endpoint_2_purpose}}

**Integration Notes:** {{api_1_integration_notes}}

## Core Workflows

```mermaid
{{core_workflow_diagram}}
```

## REST API Spec

```yaml
{{rest_api_specification}}
```

## Database Schema

{{database_schema}}

## Source Tree

```
{{project_folder_structure}}
```

## Infrastructure and Deployment

### Infrastructure as Code
- **Tool:** {{iac_tool}} {{iac_version}}
- **Location:** `{{iac_directory}}`
- **Approach:** {{iac_approach}}

### Deployment Strategy
- **Strategy:** {{deployment_strategy}}
- **CI/CD Platform:** {{cicd_platform}}
- **Pipeline Configuration:** `{{pipeline_config_location}}`

### Environments
- **{{env_1_name}}:** {{env_1_purpose}} - {{env_1_details}}
- **{{env_2_name}}:** {{env_2_purpose}} - {{env_2_details}}
- **{{env_3_name}}:** {{env_3_purpose}} - {{env_3_details}}

### Environment Promotion Flow
```
{{promotion_flow_diagram}}
```

### Rollback Strategy
- **Primary Method:** {{rollback_method}}
- **Trigger Conditions:** {{rollback_triggers}}
- **Recovery Time Objective:** {{rto}}

## Error Handling Strategy

### General Approach
- **Error Model:** {{error_model}}
- **Exception Hierarchy:** {{exception_structure}}
- **Error Propagation:** {{propagation_rules}}

### Logging Standards
- **Library:** {{logging_library}} {{logging_version}}
- **Format:** {{log_format}}
- **Levels:** {{log_levels_definition}}
- **Required Context:**
  - Correlation ID: {{correlation_id_format}}
  - Service Context: {{service_context}}
  - User Context: {{user_context_rules}}

### Error Handling Patterns

#### External API Errors
- **Retry Policy:** {{retry_strategy}}
- **Circuit Breaker:** {{circuit_breaker_config}}
- **Timeout Configuration:** {{timeout_settings}}
- **Error Translation:** {{error_mapping_rules}}

#### Business Logic Errors
- **Custom Exceptions:** {{business_exception_types}}
- **User-Facing Errors:** {{user_error_format}}
- **Error Codes:** {{error_code_system}}

#### Data Consistency
- **Transaction Strategy:** {{transaction_approach}}
- **Compensation Logic:** {{compensation_patterns}}
- **Idempotency:** {{idempotency_approach}}

## Coding Standards

### Core Standards
- **Languages & Runtimes:** {{languages_and_versions}}
- **Style & Linting:** {{linter_config}}
- **Test Organization:** {{test_file_convention}}

### Naming Conventions
| Element | Convention | Example |
|---------|------------|---------|
| {{naming_element_1}} | {{naming_convention_1}} | {{naming_example_1}} |
| {{naming_element_2}} | {{naming_convention_2}} | {{naming_example_2}} |

### Critical Rules
- **{{rule_1_name}}:** {{rule_1_description}}
- **{{rule_2_name}}:** {{rule_2_description}}
- **{{rule_3_name}}:** {{rule_3_description}}

## Test Strategy and Standards

### Testing Philosophy
- **Approach:** {{test_approach}}
- **Coverage Goals:** {{coverage_targets}}
- **Test Pyramid:** {{test_distribution}}

### Test Types and Organization

#### Unit Tests
- **Framework:** {{unit_test_framework}} {{unit_test_version}}
- **File Convention:** {{unit_test_naming}}
- **Location:** {{unit_test_location}}
- **Mocking Library:** {{mocking_library}}
- **Coverage Requirement:** {{unit_coverage}}

**AI Agent Requirements:**
- Generate tests for all public methods
- Cover edge cases and error conditions
- Follow AAA pattern (Arrange, Act, Assert)
- Mock all external dependencies

#### Integration Tests
- **Scope:** {{integration_scope}}
- **Location:** {{integration_test_location}}
- **Test Infrastructure:**
  - **{{integration_dependency_1}}:** {{integration_test_approach_1}} ({{integration_test_tool_1}})
  - **{{integration_dependency_2}}:** {{integration_test_approach_2}} ({{integration_test_tool_2}})

#### End-to-End Tests
- **Framework:** {{e2e_framework}} {{e2e_version}}
- **Scope:** {{e2e_scope}}
- **Environment:** {{e2e_environment}}
- **Test Data:** {{e2e_data_strategy}}

### Test Data Management
- **Strategy:** {{test_data_approach}}
- **Fixtures:** {{fixture_location}}
- **Factories:** {{factory_pattern}}
- **Cleanup:** {{cleanup_strategy}}

### Continuous Testing
- **CI Integration:** {{ci_test_stages}}
- **Performance Tests:** {{perf_test_approach}}
- **Security Tests:** {{security_test_approach}}

## Security

### Input Validation
- **Validation Library:** {{validation_library}}
- **Validation Location:** {{where_to_validate}}
- **Required Rules:**
  - All external inputs MUST be validated
  - Validation at API boundary before processing
  - Whitelist approach preferred over blacklist

### Authentication & Authorization
- **Auth Method:** {{auth_implementation}}
- **Session Management:** {{session_approach}}
- **Required Patterns:**
  - {{auth_pattern_1}}
  - {{auth_pattern_2}}

### Secrets Management
- **Development:** {{dev_secrets_approach}}
- **Production:** {{prod_secrets_service}}
- **Code Requirements:**
  - NEVER hardcode secrets
  - Access via configuration service only
  - No secrets in logs or error messages

### API Security
- **Rate Limiting:** {{rate_limit_implementation}}
- **CORS Policy:** {{cors_configuration}}
- **Security Headers:** {{required_headers}}
- **HTTPS Enforcement:** {{https_approach}}

### Data Protection
- **Encryption at Rest:** {{encryption_at_rest}}
- **Encryption in Transit:** {{encryption_in_transit}}
- **PII Handling:** {{pii_rules}}
- **Logging Restrictions:** {{what_not_to_log}}

### Dependency Security
- **Scanning Tool:** {{dependency_scanner}}
- **Update Policy:** {{update_frequency}}
- **Approval Process:** {{new_dep_process}}

### Security Testing
- **SAST Tool:** {{static_analysis}}
- **DAST Tool:** {{dynamic_analysis}}
- **Penetration Testing:** {{pentest_schedule}}

## Next Steps

{{next_steps_guidance}}

### Frontend Architecture Handoff
*If applicable*

{{frontend_architecture_prompt}}