# Risk Profile Generation Task

## Purpose

Generate a comprehensive risk assessment matrix for story implementation using probability × impact analysis. Identify, assess, and prioritize risks while providing mitigation strategies and testing focus areas.

## Risk Assessment Framework

### Risk Categories

**Category Prefixes:**
- `TECH`: Technical Risks
- `SEC`: Security Risks  
- `PERF`: Performance Risks
- `DATA`: Data Risks
- `BUS`: Business Risks
- `OPS`: Operational Risks

### 1. Technical Risks (TECH)
- **Architecture Complexity**: System integration challenges and technical debt
- **Integration Dependencies**: Third-party services and API reliability
- **Scalability Concerns**: Performance under load and growth requirements
- **Technology Stack**: Framework limitations and version compatibility
- **Development Complexity**: Implementation difficulty and team expertise

### 2. Security Risks (SEC)  
- **Authentication/Authorization**: Access control and identity management
- **Data Protection**: Encryption, storage security, and privacy compliance
- **Input Validation**: Injection attacks and malicious input handling
- **Communication Security**: API security and data transmission
- **Compliance**: Regulatory requirements (GDPR, HIPAA, PCI-DSS)

### 3. Performance Risks (PERF)
- **Response Time**: User experience degradation under normal load
- **Scalability**: System behavior under peak usage
- **Resource Usage**: Memory, CPU, and database performance
- **Network Dependencies**: External service latency and availability
- **Caching Strategy**: Data consistency and performance optimization

### 4. Data Risks (DATA)
- **Data Integrity**: Corruption, loss, or inconsistency
- **Migration Risks**: Data transformation and backward compatibility
- **Backup/Recovery**: Business continuity and disaster recovery
- **Data Quality**: Validation, cleansing, and accuracy
- **Synchronization**: Consistency across distributed systems

### 5. Business Risks (BUS)
- **User Adoption**: Feature acceptance and user experience impact
- **Market Timing**: Competitive positioning and release timing
- **Revenue Impact**: Financial implications of delays or failures
- **Regulatory Changes**: Compliance requirements evolution
- **Stakeholder Alignment**: Requirement changes and scope creep

### 6. Operational Risks (OPS)
- **Deployment**: Release process and rollback procedures
- **Monitoring**: Observability and alerting coverage
- **Support**: Documentation and troubleshooting capabilities
- **Team Dependencies**: Knowledge gaps and resource availability
- **Infrastructure**: Cloud services and hosting reliability

## Risk Assessment Matrix

### Probability Scale (1-5)
- **1 - Very Low (1-5%)**: Highly unlikely to occur
- **2 - Low (6-20%)**: Unlikely but possible
- **3 - Medium (21-50%)**: Moderate chance of occurrence  
- **4 - High (51-80%)**: Likely to occur
- **5 - Very High (81-100%)**: Almost certain to occur

### Impact Scale (1-5)
- **1 - Minimal**: Minor inconvenience, easy workaround
- **2 - Low**: Some impact but business continues normally
- **3 - Medium**: Noticeable impact requiring attention
- **4 - High**: Significant business disruption
- **5 - Critical**: Major business disruption or failure

### Risk Score Calculation
**Risk Score = Probability × Impact**

### Priority Classification
- **P1 - Critical (20-25)**: Immediate attention required
- **P2 - High (12-19)**: Address before release
- **P3 - Medium (8-11)**: Monitor and plan mitigation
- **P4 - Low (1-7)**: Accept or address if resources allow

## Task Execution Process

### 1. Context Analysis
- Review story requirements and acceptance criteria
- Examine technical dependencies and integrations
- Identify stakeholders and business impact areas
- Consider system architecture and current technical debt

### 2. Risk Identification
For each category (TECH, SEC, PERF, DATA, BUS, OPS):
- Brainstorm potential failure scenarios
- Consider edge cases and unusual conditions
- Review historical issues and lessons learned
- Consult domain expertise and best practices

### 3. Risk Assessment
For each identified risk:
- Estimate probability based on complexity and historical data
- Assess business and technical impact
- Calculate risk score (Probability × Impact)
- Assign priority classification (P1-P4)

### 4. Mitigation Strategy Development
For each high-priority risk (P1-P2):
- **Prevention**: Actions to reduce probability
- **Mitigation**: Actions to reduce impact
- **Contingency**: Response plan if risk occurs
- **Testing**: Specific validation approaches

### 5. Output Format

```markdown
# Risk Assessment: [Story Title]

## Executive Summary
- **Total Risks Identified**: [number]
- **Critical Risks (P1)**: [number] 
- **High Priority Risks (P2)**: [number]
- **Recommended Actions**: [top 3 mitigation priorities]

## Risk Matrix

| Risk ID | Category | Description | Probability | Impact | Score | Priority | Mitigation Strategy |
|---------|----------|-------------|-------------|--------|-------|----------|-------------------|
| TECH-01 | Technical | [description] | 4 | 5 | 20 | P1 | [strategy] |
| SEC-01 | Security | [description] | 3 | 4 | 12 | P2 | [strategy] |

## Detailed Risk Analysis

### Critical Risks (P1)
[Detailed analysis of each P1 risk with specific mitigation plans]

### High Priority Risks (P2)  
[Analysis of P2 risks with recommended actions]

### Testing Focus Areas
Based on risk analysis, prioritize testing in these areas:
1. [High-risk functionality requiring comprehensive testing]
2. [Integration points needing validation]
3. [Performance scenarios under load]

## Monitoring and Review
- **Risk Review Frequency**: [daily/weekly/sprint]
- **Key Metrics to Track**: [specific metrics]
- **Escalation Triggers**: [conditions requiring immediate attention]
```

## Quality Criteria

### Risk Assessment Quality
- **Comprehensive Coverage**: All relevant risk categories addressed
- **Realistic Scoring**: Probability and impact assessments based on evidence
- **Actionable Mitigation**: Specific, implementable mitigation strategies
- **Testing Alignment**: Risk priorities reflected in test strategy

### Documentation Quality
- **Clear Communication**: Risk descriptions understandable to all stakeholders
- **Prioritization Clarity**: Clear rationale for priority assignments
- **Mitigation Specificity**: Concrete actions rather than vague recommendations
- **Measurable Outcomes**: Success criteria for risk mitigation efforts

## Integration with Other Tasks

**Test Design Integration**:
- High-priority risks receive comprehensive test coverage
- Risk scenarios become specific test cases
- Performance risks drive load testing requirements

**Quality Gate Integration**:
- P1 risks must have mitigation plans before development
- Risk mitigation progress tracked through quality gates
- Post-implementation risk validation required

**Story Review Integration**:
- Risk assessment influences story complexity estimates
- High-risk stories may require additional review cycles
- Risk mitigation tasks may be added to story definition

## Success Indicators

- **Risk Prevention**: Proactive identification prevents issues in production
- **Mitigation Effectiveness**: Planned mitigation strategies reduce actual impact
- **Testing Optimization**: Risk-based testing finds issues earlier in development cycle
- **Stakeholder Confidence**: Clear risk communication enables informed decision-making