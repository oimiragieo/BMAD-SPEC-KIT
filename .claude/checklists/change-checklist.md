# Change Navigation Checklist

## Purpose
Systematic framework to guide teams through analysis and planning when significant changes (pivots, technical issues, missing requirements, failed implementations) are identified during development. This ensures changes are handled strategically while minimizing wasted work and maintaining project momentum.

## Change Types Covered
- Technical limitations or dead-ends requiring pivot
- Newly discovered requirements not captured initially  
- Fundamental misunderstanding of existing requirements
- Strategic pivots based on user feedback or market changes
- Failed implementations needing alternative approaches

---

## 1. Understand the Trigger & Context

### Issue Identification & Analysis
- [ ] Triggering story or issue clearly identified
- [ ] Root cause analysis completed (technical vs. requirements vs. strategic)
- [ ] Issue scope and blast radius assessed
- [ ] Specific evidence gathered (logs, errors, user feedback, analysis)
- [ ] Similar issues in project history reviewed for patterns

### Context Assessment
- [ ] Current project state documented (completed stories, active epics)
- [ ] Remaining planned work inventory reviewed
- [ ] Key stakeholder perspectives gathered
- [ ] Timeline and budget impact preliminarily assessed
- [ ] Team capacity and morale considerations noted

### Impact Classification
- [ ] **TECHNICAL**: Implementation challenge or technology limitation
- [ ] **REQUIREMENTS**: Missing, incorrect, or changed requirements
- [ ] **STRATEGIC**: Business direction or market condition change
- [ ] **RESOURCE**: Team, timeline, or budget constraint
- [ ] **QUALITY**: User experience or performance issue

**Issue Summary**: {{issue_description}}
**Root Cause**: {{root_cause_analysis}}
**Impact Level**: {{impact_level}} (Low/Medium/High/Critical)

---

## 2. Epic Impact Assessment

### Current Epic Analysis
- [ ] Current epic completion status assessed
- [ ] Remaining stories in current epic evaluated for viability
- [ ] Epic goal achievement likelihood reassessed
- [ ] Story modifications needed for current epic identified
- [ ] Current epic salvageability determined

### Future Epic Analysis
- [ ] All planned future epics reviewed for impact
- [ ] Dependencies on changed elements identified
- [ ] Epic priorities and sequencing reconsidered
- [ ] New epics required for change implementation identified
- [ ] Epics that may be eliminated or combined evaluated

### Epic Restructuring Options
- [ ] **MODIFY**: Adjust existing epics to accommodate change
- [ ] **RESEQUENCE**: Change epic order to optimize for new direction
- [ ] **ELIMINATE**: Remove epics no longer needed
- [ ] **CREATE**: Add new epics to handle change requirements
- [ ] **MERGE**: Combine epics for efficiency

**Epic Impact Summary**: {{epic_impact_summary}}

---

## 3. Artifact Conflict & Impact Analysis

### Product Requirements Document (PRD) Review
- [ ] Core goals and requirements alignment assessed
- [ ] User personas and journeys impact evaluated
- [ ] Success metrics and KPIs relevance reviewed
- [ ] Business case and value proposition alignment checked
- [ ] Market positioning and competitive analysis updated if needed

### Architecture Document Review
- [ ] Fundamental architecture assumptions validated
- [ ] Technology stack choices impact assessed
- [ ] System integration points evaluated
- [ ] Performance and scalability implications reviewed
- [ ] Security architecture alignment maintained

### Design & UX Specifications Review
- [ ] User interface design consistency evaluated
- [ ] User experience flow impact assessed
- [ ] Design system and component library implications reviewed
- [ ] Accessibility requirements maintained
- [ ] Mobile and responsive design considerations preserved

### Technical Documentation Review
- [ ] API specifications and contracts evaluated
- [ ] Database schema and data model implications assessed
- [ ] Deployment and infrastructure requirements reviewed
- [ ] Testing strategies and coverage plans updated
- [ ] Documentation consistency across all artifacts maintained

**Artifact Updates Required**: {{artifact_updates_required}}

---

## 4. Path Forward Evaluation

### Option 1: Direct Integration & Adjustment
- [ ] Scope and nature of required adjustments defined
- [ ] Implementation effort and timeline estimated
- [ ] Technical feasibility and risks assessed
- [ ] Resource requirements and team impact evaluated
- [ ] User experience and business value impact analyzed

**Effort Estimate**: {{direct_adjustment_effort}}
**Risk Level**: {{direct_adjustment_risk}}
**Pros**: {{direct_adjustment_pros}}
**Cons**: {{direct_adjustment_cons}}

### Option 2: Strategic Rollback & Restart
- [ ] Specific stories or implementations for rollback identified
- [ ] Rollback effort and complexity assessed
- [ ] Data integrity and deployment implications evaluated
- [ ] Lost work and sunk cost impact calculated
- [ ] Net benefit vs. alternative approaches compared

**Rollback Scope**: {{rollback_scope}}
**Recovery Effort**: {{rollback_effort}}
**Pros**: {{rollback_pros}}
**Cons**: {{rollback_cons}}

### Option 3: MVP Re-scoping & Refinement
- [ ] Original MVP viability given new information assessed
- [ ] Feature prioritization revisited with new constraints
- [ ] Core value proposition preserved while reducing scope
- [ ] Alternative approaches to meet original MVP intent explored
- [ ] Stakeholder expectations for reduced scope managed

**Scope Changes**: {{scope_changes}}
**Value Preservation**: {{value_preservation_strategy}}
**Pros**: {{rescoping_pros}}
**Cons**: {{rescoping_cons}}

### Recommended Path Selection
**Selected Option**: {{selected_option}}
**Rationale**: {{selection_rationale}}
**Expected Outcome**: {{expected_outcome}}

---

## 5. Change Implementation Planning

### Immediate Actions (Next 7 Days)
- [ ] **Action 1**: {{immediate_action_1}}
  - Owner: {{immediate_owner_1}}
  - Deadline: {{immediate_deadline_1}}
  - Success Criteria: {{immediate_criteria_1}}

- [ ] **Action 2**: {{immediate_action_2}}  
  - Owner: {{immediate_owner_2}}
  - Deadline: {{immediate_deadline_2}}
  - Success Criteria: {{immediate_criteria_2}}

### Short-term Adjustments (Next 30 Days)
- [ ] **Adjustment 1**: {{short_term_action_1}}
  - Owner: {{short_term_owner_1}}
  - Resources Needed: {{short_term_resources_1}}
  - Milestones: {{short_term_milestones_1}}

- [ ] **Adjustment 2**: {{short_term_action_2}}
  - Owner: {{short_term_owner_2}}  
  - Resources Needed: {{short_term_resources_2}}
  - Milestones: {{short_term_milestones_2}}

### Long-term Strategy (Next 90 Days)
- [ ] **Strategic Initiative 1**: {{long_term_action_1}}
  - Strategic Goal: {{long_term_goal_1}}
  - Approach: {{long_term_approach_1}}
  - Success Metrics: {{long_term_metrics_1}}

- [ ] **Strategic Initiative 2**: {{long_term_action_2}}
  - Strategic Goal: {{long_term_goal_2}}
  - Approach: {{long_term_approach_2}}
  - Success Metrics: {{long_term_metrics_2}}

---

## 6. Stakeholder Communication Plan

### Change Communication Strategy
- [ ] Key stakeholders identified and informed
- [ ] Communication timeline established
- [ ] Change rationale clearly articulated
- [ ] Impact on deliverables and timelines communicated
- [ ] Mitigation strategies and recovery plans shared

### Team Alignment & Morale
- [ ] Development team briefed on changes and rationale
- [ ] Team concerns and questions addressed
- [ ] Workload redistribution planned fairly
- [ ] Learning opportunities from change identified
- [ ] Team confidence in new direction established

### Client & Business Stakeholder Management
- [ ] Business impact clearly quantified and communicated
- [ ] Alternative options presented with trade-offs
- [ ] Updated timeline and milestone expectations set
- [ ] Value delivery preservation emphasized
- [ ] Future risk mitigation measures outlined

**Communication Plan**: {{communication_strategy}}

---

## 7. Risk Mitigation & Monitoring

### Change Implementation Risks
- [ ] **Risk 1**: {{implementation_risk_1}}
  - Probability: {{risk_1_probability}}
  - Impact: {{risk_1_impact}}
  - Mitigation: {{risk_1_mitigation}}

- [ ] **Risk 2**: {{implementation_risk_2}}
  - Probability: {{risk_2_probability}}
  - Impact: {{risk_2_impact}}
  - Mitigation: {{risk_2_mitigation}}

### Success Monitoring Framework
- [ ] Progress tracking metrics defined
- [ ] Success criteria and checkpoints established
- [ ] Early warning indicators identified
- [ ] Course correction triggers defined
- [ ] Review and retrospective schedule set

### Fallback Planning
- [ ] Alternative approaches if primary change fails identified
- [ ] Minimum viable fallback options prepared
- [ ] Decision points for fallback activation defined
- [ ] Resource allocation for fallback scenarios planned
- [ ] Stakeholder communication for fallback prepared

**Risk Mitigation Strategy**: {{risk_mitigation_summary}}

---

## 8. Final Review & Approval

### Change Proposal Validation
- [ ] All analysis sections completed thoroughly
- [ ] Proposed solution addresses root cause effectively
- [ ] Resource requirements realistic and available
- [ ] Timeline expectations achievable and communicated
- [ ] Success criteria measurable and agreed upon

### Stakeholder Sign-off
- [ ] Team lead approval obtained
- [ ] Product owner/manager approval secured
- [ ] Technical lead agreement confirmed
- [ ] Business stakeholder buy-in achieved
- [ ] Implementation authority granted

### Next Steps Confirmation
- [ ] Specific action items assigned with owners
- [ ] Timeline and milestones clearly established
- [ ] Success metrics and review checkpoints scheduled
- [ ] Communication plan activated
- [ ] Change tracking and monitoring initiated

---

## Change Summary Report

### Executive Summary
**Change Type**: {{change_type}}
**Change Trigger**: {{change_trigger}}
**Chosen Solution**: {{chosen_solution}}
**Timeline Impact**: {{timeline_impact}}
**Resource Impact**: {{resource_impact}}

### Implementation Plan
**Phase 1** (Immediate): {{phase_1_summary}}
**Phase 2** (Short-term): {{phase_2_summary}}
**Phase 3** (Long-term): {{phase_3_summary}}

### Success Criteria
1. {{success_criterion_1}}
2. {{success_criterion_2}}
3. {{success_criterion_3}}

### Next Review Date
**Review Date**: {{next_review_date}}
**Review Scope**: {{review_scope}}

---

## Sign-off

**Change Initiator**: {{change_initiator}}
**Project Lead**: {{project_lead}}
**Date**: {{change_date}}
**Change ID**: {{change_id}}

**Final Notes**: {{final_change_notes}}