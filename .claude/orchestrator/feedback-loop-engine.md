# Feedback Loop Engine - Adaptive Workflow Coordination

## Overview

The Feedback Loop Engine enables bidirectional communication between agents, allowing downstream agents to notify upstream agents of constraints, inconsistencies, or issues discovered during execution. This creates an adaptive workflow that can self-correct and optimize based on real-world implementation findings.

---

## Core Concept

Traditional workflow: `Analyst → PM → Architect → Developer → QA` (one-way)

Feedback-enabled workflow:
```
    ┌─────────────────────────────────────┐
    │                                     │
    ▼                                     │
Analyst → PM → Architect → Developer → QA
    ▲        ▲        ▲          ▲
    │        │        │          │
    └────────┴────────┴──────────┘
    (feedback notifications)
```

---

## Feedback Mechanisms

### 1. Constraint Backpropagation

**Scenario**: Developer discovers implementation constraint that affects architecture

```yaml
constraint_backpropagation:
  trigger:
    agent: developer
    event: "implementation_constraint_discovered"

  examples:
    - constraint: "hosting doesn't support WebSockets"
      requirement_id: "REQ-123"
      affected_agents: ["architect", "pm"]

    - constraint: "database performance insufficient"
      requirement_id: "REQ-045"
      affected_agents: ["architect"]

    - constraint: "third-party API rate limit too restrictive"
      requirement_id: "REQ-078"
      affected_agents: ["architect", "pm"]

  action:
    - pause_workflow: true
    - notify_agents: ["architect", "pm"]
    - request_decision:
        options:
          - "revise_architecture"
          - "change_hosting_provider"
          - "revise_requirement"
          - "accept_limitation"
    - resume_on: "decision_made"
```

**Implementation Pattern**:
```javascript
// During developer agent execution
if (implementationConstraintFound) {
  await feedbackLoop.notifyConstraint({
    source: "developer",
    constraint: {
      type: "technical_limitation",
      description: "WebSocket not supported by current hosting",
      affected_requirement: "REQ-123",
      severity: "blocking"
    },
    request: {
      targets: ["architect", "pm"],
      action_required: "architecture_revision_or_requirement_change",
      options: [
        {
          option: "switch_to_polling",
          impact: "performance_degradation",
          effort: "low"
        },
        {
          option: "change_hosting_provider",
          impact: "deployment_complexity",
          effort: "high"
        },
        {
          option: "revise_realtime_requirement",
          impact: "feature_reduction",
          effort: "medium"
        }
      ]
    }
  });

  // Wait for resolution
  const resolution = await feedbackLoop.waitForResolution("REQ-123");

  // Continue with updated context
  await implementWithResolution(resolution);
}
```

---

### 2. Validation Failure Callbacks

**Scenario**: Architect validates PM requirements and finds technical infeasibility

```yaml
validation_failure_callbacks:
  architect_validates_pm:
    trigger: "architect finds technical infeasibility"

    examples:
      - finding: "requirement X requires technology not in approved stack"
        requirement_id: "REQ-056"

      - finding: "performance requirement Y is not achievable with given constraints"
        requirement_id: "REQ-089"

    action:
      - notify_pm:
          message: "Technical validation failed for requirement X"
          details: "architect's analysis and reasoning"
      - request_revision: true
      - preserve_context:
          - "architect's technical analysis"
          - "alternative approaches evaluated"
      - re_execute:
          - agent: "pm"
          - step: 2
          - context: "with_architect_feedback"

  qa_validates_implementation:
    trigger: "qa finds missing functionality"

    examples:
      - finding: "acceptance criteria not met"
        requirement_id: "REQ-012"
        test_case: "TC-045"

      - finding: "non-functional requirement violated"
        requirement_id: "REQ-067"
        metric: "response_time > 2s (target: 500ms)"

    action:
      - trace_to_requirement: true
      - identify_gap:
          compare:
            - "pm.requirements"
            - "developer.implementation"
      - escalate_to: ["pm", "developer"]
      - decision:
          options:
            - "add_missing_requirement"
            - "fix_implementation"
            - "mark_as_limitation"
            - "revise_acceptance_criteria"
```

---

### 3. Inconsistency Detection

**Scenario**: Multiple agents produce conflicting outputs

```yaml
inconsistency_detection:
  ux_architect_mismatch:
    detection:
      compare:
        - "ux_expert.ui_spec.design_system.breakpoints"
        - "architect.system_architecture.responsive_strategy"

    conflicts:
      - ux_expert: "mobile_first with 320px base"
        architect: "desktop_primary with 1024px base"
        severity: "high"

    resolution:
      - notify_both: ["ux_expert", "architect"]
      - request_alignment:
          method: "consensus_meeting"
          facilitator: "orchestrator"
      - update_both_artifacts: true

  pm_architect_constraint_mismatch:
    detection:
      compare:
        - "pm.prd.technical_constraints"
        - "architect.system_architecture.selected_technologies"

    conflicts:
      - pm: "must support IE11"
        architect: "selected React 18 (no IE11 support)"
        severity: "critical"

    resolution:
      - pause_workflow: true
      - notify_agents: ["pm", "architect"]
      - request_resolution:
          options:
            - "drop_ie11_requirement"
            - "use_polyfills"
            - "downgrade_react_version"
            - "accept_dual_implementation"
      - resume_on: "consensus_reached"
```

---

### 4. Quality Gate Feedback

**Scenario**: Quality gate fails and needs upstream attention

```yaml
quality_gate_feedback:
  accessibility_failure:
    gate: "WCAG_AA_compliance"
    threshold: "zero_violations"
    actual: "12_violations"

    action:
      - notify_ux_expert:
          message: "Accessibility violations detected"
          details: "12 WCAG AA violations in components"
          violations: ["color_contrast", "keyboard_navigation", "aria_labels"]
      - request_fix:
          target: "ux_expert"
          artifact: "ui_spec"
          specific_issues: [...violations]
      - block_developer_step: true
      - resume_on: "ux_spec_revised"

  performance_failure:
    gate: "performance_budget"
    threshold: "lighthouse_score >= 90"
    actual: "lighthouse_score = 67"

    action:
      - trace_root_cause:
          - "bundle_size: 2.5MB (target: 500KB)"
          - "unoptimized_images: 15 files"
          - "blocking_scripts: 8 files"
      - notify_agents: ["architect", "developer", "ux_expert"]
      - request_optimization:
          - architect: "review_technology_choices"
          - developer: "implement_code_splitting"
          - ux_expert: "optimize_image_assets"
      - re_validate_on: "all_fixes_applied"
```

---

## Implementation Architecture

### Feedback Loop State Machine

```yaml
feedback_loop_states:
  IDLE:
    description: "No active feedback loops"
    transitions:
      - event: "feedback_triggered"
        next_state: "NOTIFYING"

  NOTIFYING:
    description: "Sending notifications to target agents"
    actions:
      - create_feedback_record
      - send_notifications
      - update_context_bus
    transitions:
      - event: "notifications_sent"
        next_state: "WAITING_RESPONSE"

  WAITING_RESPONSE:
    description: "Waiting for agent acknowledgment and action"
    timeout: "10_minutes"
    actions:
      - poll_for_acknowledgment
      - track_response_time
    transitions:
      - event: "response_received"
        next_state: "RESOLVING"
      - event: "timeout"
        next_state: "ESCALATING"

  RESOLVING:
    description: "Agents are working on resolution"
    actions:
      - monitor_progress
      - coordinate_updates
      - validate_resolution
    transitions:
      - event: "resolution_complete"
        next_state: "VALIDATING"
      - event: "resolution_failed"
        next_state: "ESCALATING"

  VALIDATING:
    description: "Validating the resolution"
    actions:
      - run_validation_checks
      - verify_consistency
      - update_artifacts
    transitions:
      - event: "validation_passed"
        next_state: "RESOLVED"
      - event: "validation_failed"
        next_state: "ESCALATING"

  RESOLVED:
    description: "Feedback loop successfully resolved"
    actions:
      - update_context
      - log_resolution
      - resume_workflow
    transitions:
      - event: "new_feedback"
        next_state: "NOTIFYING"
      - event: "workflow_complete"
        next_state: "IDLE"

  ESCALATING:
    description: "Escalating to human or system administrator"
    actions:
      - create_escalation_ticket
      - notify_administrators
      - pause_workflow
    transitions:
      - event: "manual_resolution"
        next_state: "RESOLVED"
```

---

### Context Bus Integration

```javascript
// Feedback loop uses context bus for coordination
class FeedbackLoopEngine {
  constructor(contextBus) {
    this.contextBus = contextBus;
    this.activeLoops = new Map();

    // Subscribe to agent completion events
    this.contextBus.subscribe('agent_contexts.*.status', (newStatus, oldStatus, path) => {
      if (newStatus === 'completed') {
        this.onAgentCompleted(path);
      }
    });
  }

  /**
   * Trigger feedback loop
   */
  async trigger(feedbackConfig) {
    const loopId = `loop-${Date.now()}`;

    // Create feedback loop record
    const loop = {
      id: loopId,
      triggered_at: new Date().toISOString(),
      source_agent: feedbackConfig.source,
      target_agents: feedbackConfig.targets,
      issue_type: feedbackConfig.type,
      description: feedbackConfig.description,
      severity: feedbackConfig.severity,
      status: 'pending',
      state: 'NOTIFYING'
    };

    // Store in context
    this.contextBus.push('feedback_loops', loop);
    this.activeLoops.set(loopId, loop);

    // Notify target agents
    await this.notifyAgents(loop);

    return loopId;
  }

  /**
   * Notify target agents
   */
  async notifyAgents(loop) {
    for (const targetAgent of loop.target_agents) {
      const notification = {
        from_agent: loop.source_agent,
        type: loop.issue_type,
        message: loop.description,
        severity: loop.severity,
        resolved: false,
        loop_id: loop.id
      };

      this.contextBus.push(
        `agent_contexts.${targetAgent}.feedback_received`,
        notification
      );
    }

    // Update state
    loop.state = 'WAITING_RESPONSE';
    this.contextBus.update(`feedback_loops.${loop.id}`, { state: 'WAITING_RESPONSE' });
  }

  /**
   * Wait for resolution
   */
  async waitForResolution(loopId, timeout = 600000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkInterval = setInterval(() => {
        const loop = this.activeLoops.get(loopId);

        if (!loop) {
          clearInterval(checkInterval);
          reject(new Error(`Loop not found: ${loopId}`));
          return;
        }

        if (loop.status === 'resolved') {
          clearInterval(checkInterval);
          resolve(loop.resolution);
          return;
        }

        if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          this.escalate(loopId, 'timeout');
          reject(new Error(`Feedback loop timeout: ${loopId}`));
        }
      }, 1000);
    });
  }

  /**
   * Resolve feedback loop
   */
  async resolve(loopId, resolution) {
    const loop = this.activeLoops.get(loopId);

    if (!loop) {
      throw new Error(`Loop not found: ${loopId}`);
    }

    loop.status = 'resolved';
    loop.state = 'RESOLVED';
    loop.resolution = resolution;
    loop.resolved_at = new Date().toISOString();

    // Update context
    this.contextBus.update(`feedback_loops.${loop.id}`, {
      status: 'resolved',
      state: 'RESOLVED',
      resolution: resolution,
      resolved_at: loop.resolved_at
    });

    // Mark notifications as resolved
    for (const targetAgent of loop.target_agents) {
      const feedbacks = this.contextBus.get(`agent_contexts.${targetAgent}.feedback_received`) || [];
      for (const feedback of feedbacks) {
        if (feedback.loop_id === loopId) {
          feedback.resolved = true;
        }
      }
    }

    // Remove from active loops
    this.activeLoops.delete(loopId);

    return resolution;
  }

  /**
   * Escalate unresolved loop
   */
  async escalate(loopId, reason) {
    const loop = this.activeLoops.get(loopId);

    if (!loop) return;

    loop.status = 'escalated';
    loop.state = 'ESCALATING';
    loop.escalation_reason = reason;

    this.contextBus.update(`feedback_loops.${loop.id}`, {
      status: 'escalated',
      state: 'ESCALATING',
      escalation_reason: reason
    });

    // Pause workflow
    this.contextBus.set('workflow_state.paused', true);
    this.contextBus.set('workflow_state.pause_reason', `Feedback loop escalation: ${loopId}`);

    console.error(`\n⚠️  Feedback loop escalated: ${loopId}`);
    console.error(`   Reason: ${reason}`);
    console.error(`   Issue: ${loop.description}`);
    console.error(`   Manual intervention required.\n`);
  }
}
```

---

## Usage Examples

### Example 1: Developer finds WebSocket constraint

```javascript
// In developer agent
const feedbackLoop = new FeedbackLoopEngine(contextBus);

const loopId = await feedbackLoop.trigger({
  source: 'developer',
  targets: ['architect', 'pm'],
  type: 'constraint_violation',
  severity: 'blocking',
  description: 'WebSocket not supported by current hosting (Vercel)',
  details: {
    requirement_id: 'REQ-123',
    requirement_text: 'Real-time collaboration with WebSocket',
    constraint: 'Vercel serverless functions do not support persistent WebSocket connections',
    options: [
      { option: 'Use polling', effort: 'low', impact: 'performance_degradation' },
      { option: 'Switch to AWS with EC2', effort: 'high', impact: 'deployment_change' },
      { option: 'Use third-party service (Pusher)', effort: 'medium', impact: 'cost_increase' }
    ]
  }
});

// Wait for architect and PM to decide
const resolution = await feedbackLoop.waitForResolution(loopId);

console.log(`Resolution: ${resolution.decision}`);
// Implement based on resolution
```

### Example 2: Architect finds performance infeasibility

```javascript
// In architect agent
const feedbackLoop = new FeedbackLoopEngine(contextBus);

const loopId = await feedbackLoop.trigger({
  source: 'architect',
  targets: ['pm'],
  type: 'technical_infeasibility',
  severity: 'high',
  description: 'Performance requirement not achievable with current constraints',
  details: {
    requirement_id: 'REQ-089',
    requirement_text: 'Page load time < 500ms',
    analysis: 'With 50MB of data to load and 3G mobile network (750Kbps), minimum load time is 2.5 seconds',
    recommendation: 'Revise requirement to < 2 seconds OR reduce initial data load'
  }
});

const resolution = await feedbackLoop.waitForResolution(loopId);
```

### Example 3: QA finds missing functionality

```javascript
// In QA agent
const feedbackLoop = new FeedbackLoopEngine(contextBus);

const loopId = await feedbackLoop.trigger({
  source: 'qa',
  targets: ['pm', 'developer'],
  type: 'missing_requirement',
  severity: 'medium',
  description: 'User story acceptance criteria not met',
  details: {
    user_story_id: 'US-045',
    acceptance_criteria: 'User can export data as CSV',
    actual_implementation: 'Only JSON export is implemented',
    gap: 'CSV export functionality missing'
  }
});

const resolution = await feedbackLoop.waitForResolution(loopId);
```

---

## Benefits

1. **Adaptive Workflows**: Workflows can self-correct based on real-world findings
2. **Reduced Rework**: Issues discovered early through validation callbacks
3. **Better Alignment**: Inconsistencies detected and resolved automatically
4. **Transparent Decision-Making**: All feedback and resolutions logged in context
5. **Improved Quality**: Multiple validation passes ensure consistency

---

## Integration with Parallel Execution

Feedback loops work seamlessly with parallel execution:

```yaml
parallel_execution_with_feedback:
  # Architect and UX Expert run in parallel
  - group: design_and_architecture
    parallel: true
    agents: [ux-expert, architect]

  # On completion, check for inconsistencies
  - on_group_complete:
      run: consistency_check
      compare:
        - ux-expert.outputs.design_system
        - architect.outputs.technology_stack

      if: inconsistencies_found
      then:
        trigger_feedback_loop:
          source: orchestrator
          targets: [ux-expert, architect]
          type: inconsistency

  # Wait for resolution before proceeding
  - next_group: implementation
    depends_on: [design_and_architecture, feedback_loops_resolved]
```

---

## Conclusion

The Feedback Loop Engine transforms BMAD-SPEC-KIT from a one-directional pipeline into an adaptive, self-correcting system that can handle real-world complexity and constraints discovered during execution.
