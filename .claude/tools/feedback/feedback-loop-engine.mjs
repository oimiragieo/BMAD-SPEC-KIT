#!/usr/bin/env node

/**
 * Feedback Loop Engine - Adaptive Workflow Coordination
 *
 * Enables bidirectional communication between agents for adaptive workflows.
 * Implements constraint backpropagation, validation callbacks, and inconsistency detection.
 *
 * Features:
 * - Constraint backpropagation (Developer → Architect → PM)
 * - Validation failure callbacks (Architect → PM, QA → Developer)
 * - Inconsistency detection (UX ↔ Architect)
 * - Quality gate feedback
 * - Resolution tracking and escalation
 *
 * @version 2.0.0
 * @date 2025-11-13
 */

import fs from 'fs/promises';
import path from 'path';
import { EventEmitter } from 'events';

// ============================================================================
// Feedback Loop States
// ============================================================================

const STATES = {
  IDLE: 'IDLE',
  NOTIFYING: 'NOTIFYING',
  WAITING_RESPONSE: 'WAITING_RESPONSE',
  RESOLVING: 'RESOLVING',
  VALIDATING: 'VALIDATING',
  RESOLVED: 'RESOLVED',
  ESCALATING: 'ESCALATING'
};

const ISSUE_TYPES = {
  CONSTRAINT_VIOLATION: 'constraint_violation',
  TECHNICAL_INFEASIBILITY: 'technical_infeasibility',
  INCONSISTENCY: 'inconsistency',
  MISSING_REQUIREMENT: 'missing_requirement',
  VALIDATION_FAILURE: 'validation_failure',
  QUALITY_GATE_FAILURE: 'quality_gate_failure'
};

const SEVERITIES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  BLOCKING: 'blocking',
  CRITICAL: 'critical'
};

// ============================================================================
// Feedback Loop Engine Class
// ============================================================================

class FeedbackLoopEngine extends EventEmitter {
  constructor(contextBus, options = {}) {
    super();

    this.contextBus = contextBus;
    this.options = {
      timeout: options.timeout || 600000, // 10 minutes default
      pollInterval: options.pollInterval || 1000, // 1 second
      maxEscalations: options.maxEscalations || 3,
      autoResolve: options.autoResolve !== false,
      ...options
    };

    this.activeLoops = new Map();
    this.resolvedLoops = [];
    this.escalationCount = 0;

    // Initialize feedback loops in context if not present
    if (!this.contextBus.get('feedback_loops')) {
      this.contextBus.set('feedback_loops', []);
    }
  }

  // ==========================================================================
  // Core Feedback Loop Operations
  // ==========================================================================

  /**
   * Trigger a new feedback loop
   */
  async trigger(config) {
    const {
      source,
      targets,
      type,
      severity = SEVERITIES.ERROR,
      description,
      details = {},
      options = []
    } = config;

    // Validate
    if (!source || !targets || !type || !description) {
      throw new Error('Missing required feedback loop parameters');
    }

    // Create loop
    const loopId = `loop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const loop = {
      id: loopId,
      triggered_at: new Date().toISOString(),
      source_agent: source,
      target_agents: Array.isArray(targets) ? targets : [targets],
      issue_type: type,
      severity,
      description,
      details,
      options,
      status: 'pending',
      state: STATES.NOTIFYING,
      notifications_sent: [],
      responses: [],
      resolution: null,
      resolved_at: null,
      escalation_count: 0
    };

    // Store
    this.activeLoops.set(loopId, loop);
    this.contextBus.push('feedback_loops', loop);

    console.log(`\n🔄 Feedback loop triggered: ${loopId}`);
    console.log(`   Source: ${source}`);
    console.log(`   Targets: ${targets.join(', ')}`);
    console.log(`   Type: ${type}`);
    console.log(`   Severity: ${severity}`);

    // Notify targets
    await this.notifyAgents(loop);

    // Emit event
    this.emit('loop:triggered', loop);

    // Auto-handle based on severity
    if (severity === SEVERITIES.BLOCKING || severity === SEVERITIES.CRITICAL) {
      await this.pauseWorkflow(loopId, `${severity} issue detected`);
    }

    return loopId;
  }

  /**
   * Notify target agents
   */
  async notifyAgents(loop) {
    console.log(`   📤 Notifying ${loop.target_agents.length} agent(s)...`);

    loop.state = STATES.NOTIFYING;

    for (const targetAgent of loop.target_agents) {
      const notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        loop_id: loop.id,
        from_agent: loop.source_agent,
        to_agent: targetAgent,
        type: loop.issue_type,
        severity: loop.severity,
        message: loop.description,
        details: loop.details,
        options: loop.options,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        resolved: false
      };

      // Add to agent's feedback queue
      const feedbackPath = `agent_contexts.${targetAgent}.feedback_received`;
      const existing = this.contextBus.get(feedbackPath) || [];
      existing.push(notification);
      this.contextBus.set(feedbackPath, existing);

      loop.notifications_sent.push(notification.id);

      console.log(`      ✓ Notified: ${targetAgent}`);
    }

    // Update state
    loop.state = STATES.WAITING_RESPONSE;
    loop.waiting_since = new Date().toISOString();

    this.emit('loop:notified', loop);
  }

  /**
   * Wait for resolution
   */
  async waitForResolution(loopId, customTimeout = null) {
    const loop = this.activeLoops.get(loopId);
    if (!loop) {
      throw new Error(`Feedback loop not found: ${loopId}`);
    }

    const timeout = customTimeout || this.options.timeout;
    const startTime = Date.now();

    console.log(`   ⏳ Waiting for resolution (timeout: ${timeout}ms)...`);

    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const currentLoop = this.activeLoops.get(loopId);

        // Check if resolved
        if (!currentLoop) {
          clearInterval(checkInterval);
          const resolved = this.resolvedLoops.find(l => l.id === loopId);
          if (resolved) {
            resolve(resolved.resolution);
          } else {
            reject(new Error(`Loop ${loopId} disappeared`));
          }
          return;
        }

        if (currentLoop.status === 'resolved') {
          clearInterval(checkInterval);
          resolve(currentLoop.resolution);
          return;
        }

        // Check timeout
        if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          this.handleTimeout(loopId);
          reject(new Error(`Feedback loop timeout: ${loopId}`));
        }
      }, this.options.pollInterval);

      // Cleanup on promise rejection
      const cleanup = () => clearInterval(checkInterval);
      this.once(`loop:resolved:${loopId}`, cleanup);
      this.once(`loop:escalated:${loopId}`, cleanup);
    });
  }

  /**
   * Acknowledge feedback
   */
  async acknowledge(loopId, respondingAgent, acknowledgment) {
    const loop = this.activeLoops.get(loopId);
    if (!loop) {
      throw new Error(`Feedback loop not found: ${loopId}`);
    }

    console.log(`   ✓ Acknowledgment from: ${respondingAgent}`);

    const response = {
      agent: respondingAgent,
      acknowledged_at: new Date().toISOString(),
      message: acknowledgment.message,
      action: acknowledgment.action,
      eta: acknowledgment.eta
    };

    loop.responses.push(response);
    loop.state = STATES.RESOLVING;

    this.emit('loop:acknowledged', { loop, response });
  }

  /**
   * Resolve feedback loop
   */
  async resolve(loopId, resolution) {
    const loop = this.activeLoops.get(loopId);
    if (!loop) {
      throw new Error(`Feedback loop not found: ${loopId}`);
    }

    console.log(`\n   ✅ Feedback loop resolved: ${loopId}`);
    console.log(`      Decision: ${resolution.decision || 'N/A'}`);

    // Update loop
    loop.status = 'resolved';
    loop.state = STATES.RESOLVED;
    loop.resolution = resolution;
    loop.resolved_at = new Date().toISOString();
    loop.duration_ms = Date.now() - new Date(loop.triggered_at).getTime();

    // Mark notifications as resolved
    for (const targetAgent of loop.target_agents) {
      const feedbackPath = `agent_contexts.${targetAgent}.feedback_received`;
      const feedbacks = this.contextBus.get(feedbackPath) || [];

      for (const feedback of feedbacks) {
        if (feedback.loop_id === loopId) {
          feedback.resolved = true;
          feedback.resolution = resolution;
        }
      }

      this.contextBus.set(feedbackPath, feedbacks);
    }

    // Move to resolved
    this.activeLoops.delete(loopId);
    this.resolvedLoops.push(loop);

    // Update context
    const allLoops = this.contextBus.get('feedback_loops') || [];
    const index = allLoops.findIndex(l => l.id === loopId);
    if (index >= 0) {
      allLoops[index] = loop;
      this.contextBus.set('feedback_loops', allLoops);
    }

    // Resume workflow if paused
    if (this.contextBus.get('workflow_state.paused')) {
      await this.resumeWorkflow(loopId);
    }

    this.emit('loop:resolved', loop);
    this.emit(`loop:resolved:${loopId}`, loop);

    return resolution;
  }

  /**
   * Handle timeout
   */
  async handleTimeout(loopId) {
    console.log(`\n   ⏱️  Feedback loop timeout: ${loopId}`);

    const loop = this.activeLoops.get(loopId);
    if (!loop) return;

    // Escalate
    await this.escalate(loopId, 'timeout');
  }

  /**
   * Escalate unresolved loop
   */
  async escalate(loopId, reason) {
    const loop = this.activeLoops.get(loopId);
    if (!loop) return;

    loop.escalation_count = (loop.escalation_count || 0) + 1;
    this.escalationCount++;

    console.log(`\n   ⚠️  Escalating feedback loop: ${loopId}`);
    console.log(`      Reason: ${reason}`);
    console.log(`      Escalation count: ${loop.escalation_count}`);

    loop.status = 'escalated';
    loop.state = STATES.ESCALATING;
    loop.escalation_reason = reason;
    loop.escalated_at = new Date().toISOString();

    // Check if max escalations reached
    if (loop.escalation_count >= this.options.maxEscalations) {
      console.error(`      ❌ Max escalations reached. Manual intervention required.`);

      // Pause workflow
      await this.pauseWorkflow(loopId, `Escalation limit reached for loop ${loopId}`);
    }

    this.emit('loop:escalated', loop);
    this.emit(`loop:escalated:${loopId}`, loop);
  }

  // ==========================================================================
  // Workflow Control
  // ==========================================================================

  /**
   * Pause workflow
   */
  async pauseWorkflow(loopId, reason) {
    console.log(`\n   ⏸️  Pausing workflow`);
    console.log(`      Loop: ${loopId}`);
    console.log(`      Reason: ${reason}`);

    this.contextBus.set('workflow_state.paused', true);
    this.contextBus.set('workflow_state.pause_reason', reason);
    this.contextBus.set('workflow_state.paused_by_loop', loopId);

    this.emit('workflow:paused', { loopId, reason });
  }

  /**
   * Resume workflow
   */
  async resumeWorkflow(loopId) {
    console.log(`\n   ▶️  Resuming workflow (loop ${loopId} resolved)`);

    this.contextBus.set('workflow_state.paused', false);
    this.contextBus.set('workflow_state.pause_reason', null);
    this.contextBus.set('workflow_state.paused_by_loop', null);

    this.emit('workflow:resumed', { loopId });
  }

  // ==========================================================================
  // Specialized Feedback Patterns
  // ==========================================================================

  /**
   * Constraint backpropagation (Developer → Architect/PM)
   */
  async triggerConstraint(config) {
    const {
      requirement_id,
      constraint,
      affected_agents = ['architect', 'pm'],
      options = []
    } = config;

    return this.trigger({
      source: 'developer',
      targets: affected_agents,
      type: ISSUE_TYPES.CONSTRAINT_VIOLATION,
      severity: SEVERITIES.BLOCKING,
      description: `Implementation constraint discovered: ${constraint}`,
      details: {
        requirement_id,
        constraint,
        discovered_at: new Date().toISOString()
      },
      options
    });
  }

  /**
   * Validation failure callback (Architect → PM)
   */
  async triggerValidationFailure(config) {
    const {
      requirement_id,
      finding,
      source_agent,
      target_agent = 'pm'
    } = config;

    return this.trigger({
      source: source_agent,
      targets: [target_agent],
      type: ISSUE_TYPES.VALIDATION_FAILURE,
      severity: SEVERITIES.ERROR,
      description: `Validation failed: ${finding}`,
      details: {
        requirement_id,
        finding,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Inconsistency detection (UX ↔ Architect)
   */
  async triggerInconsistency(config) {
    const {
      agents,
      field,
      values,
      severity = SEVERITIES.WARNING
    } = config;

    return this.trigger({
      source: 'orchestrator',
      targets: agents,
      type: ISSUE_TYPES.INCONSISTENCY,
      severity,
      description: `Inconsistency detected in ${field}`,
      details: {
        field,
        values,
        agents,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Quality gate failure
   */
  async triggerQualityGateFailure(config) {
    const {
      gate_name,
      threshold,
      actual,
      affected_agents
    } = config;

    return this.trigger({
      source: 'qa',
      targets: affected_agents,
      type: ISSUE_TYPES.QUALITY_GATE_FAILURE,
      severity: SEVERITIES.ERROR,
      description: `Quality gate failed: ${gate_name}`,
      details: {
        gate_name,
        threshold,
        actual,
        gap: threshold - actual,
        timestamp: new Date().toISOString()
      }
    });
  }

  // ==========================================================================
  // Monitoring & Reporting
  // ==========================================================================

  /**
   * Get active loops
   */
  getActiveLoops() {
    return Array.from(this.activeLoops.values());
  }

  /**
   * Get loop by ID
   */
  getLoop(loopId) {
    return this.activeLoops.get(loopId) ||
           this.resolvedLoops.find(l => l.id === loopId);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      active: this.activeLoops.size,
      resolved: this.resolvedLoops.length,
      total: this.activeLoops.size + this.resolvedLoops.length,
      escalations: this.escalationCount,
      by_type: this.getCountsByType(),
      by_severity: this.getCountsBySeverity()
    };
  }

  /**
   * Get counts by type
   */
  getCountsByType() {
    const counts = {};
    const allLoops = [...this.activeLoops.values(), ...this.resolvedLoops];

    for (const loop of allLoops) {
      counts[loop.issue_type] = (counts[loop.issue_type] || 0) + 1;
    }

    return counts;
  }

  /**
   * Get counts by severity
   */
  getCountsBySeverity() {
    const counts = {};
    const allLoops = [...this.activeLoops.values(), ...this.resolvedLoops];

    for (const loop of allLoops) {
      counts[loop.severity] = (counts[loop.severity] || 0) + 1;
    }

    return counts;
  }

  /**
   * Export report
   */
  async exportReport(filePath) {
    const report = {
      generated_at: new Date().toISOString(),
      statistics: this.getStatistics(),
      active_loops: this.getActiveLoops(),
      resolved_loops: this.resolvedLoops
    };

    await fs.writeFile(filePath, JSON.stringify(report, null, 2));
    return report;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create feedback loop engine
 */
function createFeedbackLoopEngine(contextBus, options = {}) {
  return new FeedbackLoopEngine(contextBus, options);
}

// ============================================================================
// Export
// ============================================================================

export {
  FeedbackLoopEngine,
  createFeedbackLoopEngine,
  STATES,
  ISSUE_TYPES,
  SEVERITIES
};
