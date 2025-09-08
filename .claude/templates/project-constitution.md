# {{project_name}} Project Constitution

**Project Type**: {{project_type}}  
**Version**: {{constitution_version}}  
**Ratified**: {{ratification_date}}  
**Last Amended**: {{last_amended_date}}

## Core Development Principles

### I. Specification-Driven Development (SDD)
**All development follows SDD principles where specifications drive implementation, not the reverse.**

- Specifications define **WHAT** and **WHY**, never **HOW**
- Implementation decisions trace back to specific requirements
- Changes to requirements must update specifications first
- Code serves specifications, not the other way around
- Business stakeholders can understand and validate all specifications

### II. Quality Standards (NON-NEGOTIABLE)
**Every deliverable must meet production-ready standards.**

- All code must include comprehensive tests
- Documentation must be complete and current
- Security best practices are mandatory
- Performance requirements must be measurable and verified
- Accessibility standards must be followed

### III. Agent Orchestration
**Multi-agent collaboration ensures comprehensive coverage.**

- Each agent has defined expertise and responsibilities
- Agent handoffs preserve context and maintain quality
- All agents follow their persona consistently
- Conflicts between agents are resolved through specification review
- No single agent makes architectural decisions alone

### IV. Template-Driven Consistency
**All outputs use standardized templates to ensure consistency.**

- Templates define structure, agents provide content
- Variable substitution maintains project coherence
- Templates evolve with project needs
- Custom templates require approval through governance process
- Generated documents reference their source templates

### V. Context Preservation
**Project knowledge accumulates and persists throughout development.**

- Session state maintains continuity across interactions
- All artifacts are versioned and traceable
- Context includes rationale for all major decisions
- Previous outputs inform new development
- Knowledge base grows with project complexity

## Technical Constraints

### Architecture Standards
- {{architecture_standards}}
- Microservices must have clear boundaries and contracts
- APIs must follow RESTful principles
- Database schemas require approval for changes
- Integration patterns must be documented

### Technology Stack
- **Frontend**: {{frontend_tech_stack}}
- **Backend**: {{backend_tech_stack}}
- **Database**: {{database_tech_stack}}
- **Infrastructure**: {{infrastructure_tech_stack}}
- **Testing**: {{testing_tech_stack}}

### Security Requirements
- Authentication and authorization for all endpoints
- Input validation and sanitization mandatory
- Secrets management through secure channels only
- Regular security audits and vulnerability assessments
- Compliance with {{compliance_standards}}

## Development Workflow

### Workflow Selection
- **Greenfield Projects**: Use greenfield-* workflows for new development
- **Brownfield Projects**: Use brownfield-* workflows for existing system modifications
- **Feature Development**: Follow feature specification template
- **Bug Fixes**: Require root cause analysis and prevention measures

### Quality Gates
1. **Specification Review**: All requirements must be clear and testable
2. **Architecture Review**: Technical designs must align with principles
3. **Code Review**: Implementation must follow standards and patterns
4. **Testing Review**: Test coverage must be comprehensive
5. **Documentation Review**: All deliverables must be documented

### Agent Responsibilities
- **Analyst**: Requirements gathering and specification creation
- **PM**: Project coordination and stakeholder communication
- **Architect**: Technical design and system architecture
- **Developer**: Implementation and code quality
- **QA**: Testing strategy and quality assurance
- **UX Expert**: User experience and interface design

## Governance

### Constitution Authority
This constitution supersedes all other development practices and guidelines. Any conflicts between this document and other processes must be resolved in favor of constitutional requirements.

### Amendment Process
1. **Proposal**: Document proposed changes with rationale
2. **Review**: All stakeholders review impact and implementation
3. **Approval**: Requires consensus from project leadership
4. **Migration**: Plan transition from current to new requirements
5. **Documentation**: Update all affected templates and workflows

### Compliance Monitoring
- All pull requests must verify constitutional compliance
- Quarterly reviews ensure ongoing adherence
- Violations require immediate remediation
- Repeated violations trigger process review

### Decision Authority
- Technical decisions require Architect approval
- Business decisions require PM approval
- User experience decisions require UX Expert approval
- Quality standards enforcement by QA agent
- Constitutional interpretation by project leadership

## Emergency Procedures

### Critical Issue Response
- Security vulnerabilities: Immediate containment and patching
- Production outages: Follow incident response procedures
- Data loss events: Activate backup and recovery protocols
- Compliance violations: Immediate disclosure and remediation

### Exception Handling
Constitutional exceptions require:
1. **Justification**: Clear rationale for exception
2. **Risk Assessment**: Impact analysis and mitigation plan
3. **Time Limit**: Specific duration for exception
4. **Remediation Plan**: Path back to constitutional compliance
5. **Approval**: Sign-off from project leadership

---

**Governance Note**: This constitution establishes the foundational principles for {{project_name}} development. All agents, workflows, and processes must operate within these constraints to ensure project success and maintainability.

**Review Schedule**: This constitution will be reviewed quarterly and updated as project needs evolve.