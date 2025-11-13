#!/usr/bin/env node

/**
 * Workflow Executor - Main Orchestration Engine
 *
 * Reads workflow YAML files and executes them with full support for:
 * - Sequential and parallel execution
 * - Dependency management
 * - Error recovery and retry logic
 * - Quality gates and validation
 * - Context management
 * - Execution tracing
 *
 * This is the MAIN entry point for executing BMAD workflows.
 *
 * Usage:
 *   node workflow-executor.mjs --workflow <workflow.yaml> --input <user-spec.md>
 *
 * @version 2.0.0
 * @date 2025-11-13
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { createContextBus } from '../context/context-bus.mjs';
import { executeStep } from './execute-step.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  PATHS: {
    WORKFLOWS: path.join(PROJECT_ROOT, '.claude/workflows'),
    AGENTS: path.join(PROJECT_ROOT, '.claude/agents'),
    CONTEXT: path.join(PROJECT_ROOT, '.claude/context'),
    SCHEMAS: path.join(PROJECT_ROOT, '.claude/schemas'),
    TRACES: path.join(PROJECT_ROOT, '.claude/context/history/traces')
  },
  RETRY: {
    MAX_ATTEMPTS: 2,
    BACKOFF_MS: 2000
  },
  TIMEOUT: {
    STEP_DEFAULT: 600000, // 10 minutes
    PARALLEL_GROUP: 900000 // 15 minutes
  }
};

// ============================================================================
// Workflow Executor Class
// ============================================================================

class WorkflowExecutor {
  constructor(workflowPath, options = {}) {
    this.workflowPath = workflowPath;
    this.options = options;
    this.workflow = null;
    this.contextBus = null;
    this.sessionId = null;
    this.executionTrace = [];
    this.startTime = null;
    this.status = 'pending';
  }

  /**
   * Initialize the workflow executor
   */
  async initialize() {
    console.log('\n' + '='.repeat(80));
    console.log('BMAD-SPEC-KIT Workflow Executor v2.0');
    console.log('='.repeat(80));

    // Load workflow definition
    await this.loadWorkflow();

    // Initialize session
    await this.initializeSession();

    // Initialize context bus
    await this.initializeContext();

    console.log(`\n✓ Workflow initialized: ${this.workflow.workflow.name}`);
    console.log(`✓ Session ID: ${this.sessionId}`);
    console.log(`✓ Execution mode: ${this.workflow.execution_strategy?.execution_mode || 'sequential'}\n`);
  }

  /**
   * Load workflow YAML file
   */
  async loadWorkflow() {
    try {
      const content = await fs.readFile(this.workflowPath, 'utf-8');
      this.workflow = yaml.load(content);

      // Validate workflow structure
      if (!this.workflow.workflow || !this.workflow.workflow.name) {
        throw new Error('Invalid workflow: missing workflow.name');
      }

      // Support both 'sequence' (v1) and 'parallel_groups' (v2) formats
      if (!this.workflow.sequence && !this.workflow.parallel_groups) {
        throw new Error('Invalid workflow: missing sequence or parallel_groups');
      }

    } catch (error) {
      throw new Error(`Failed to load workflow: ${error.message}`);
    }
  }

  /**
   * Initialize session
   */
  async initializeSession() {
    this.sessionId = `bmad-session-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    this.startTime = new Date();

    // Create session directory
    const sessionDir = path.join(CONFIG.PATHS.CONTEXT, 'sessions', this.sessionId);
    await fs.mkdir(sessionDir, { recursive: true });
  }

  /**
   * Initialize context bus
   */
  async initializeContext() {
    const contextSchemaPath = path.join(CONFIG.PATHS.SCHEMAS, 'context_state.schema.json');
    this.contextBus = await createContextBus(contextSchemaPath);

    // Initialize context structure
    this.contextBus.set('session_id', this.sessionId);
    this.contextBus.set('project_metadata', {
      name: this.options.projectName || 'Unnamed Project',
      workflow_type: this.workflow.workflow.name,
      workflow_version: this.workflow.metadata?.version || '1.0.0',
      created_at: this.startTime.toISOString(),
      estimated_duration: this.workflow.metadata?.estimated_duration || 'unknown'
    });

    this.contextBus.set('workflow_state', {
      current_step: 0,
      completed_steps: [],
      failed_steps: [],
      skipped_steps: [],
      quality_gates_passed: [],
      quality_gates_failed: [],
      overall_quality_score: 0,
      execution_mode: this.workflow.execution_strategy?.execution_mode || 'sequential',
      paused: false
    });

    this.contextBus.set('agent_contexts', {});
    this.contextBus.set('global_context', this.options.globalContext || {});
    this.contextBus.set('artifacts', {
      generated: [],
      schemas_used: [],
      context_files: []
    });
    this.contextBus.set('feedback_loops', []);
    this.contextBus.set('checkpoints', []);
  }

  /**
   * Execute the workflow
   */
  async execute() {
    try {
      this.status = 'running';
      console.log(`\n${'='.repeat(80)}`);
      console.log(`Starting workflow execution: ${this.workflow.workflow.name}`);
      console.log(`${'='.repeat(80)}\n`);

      // Determine execution path (v1 sequence or v2 parallel groups)
      if (this.workflow.parallel_groups) {
        await this.executeParallelGroups();
      } else {
        await this.executeSequential();
      }

      this.status = 'completed';
      await this.finalize();

      console.log(`\n${'='.repeat(80)}`);
      console.log(`✓ Workflow completed successfully`);
      console.log(`${'='.repeat(80)}\n`);

      return {
        success: true,
        sessionId: this.sessionId,
        duration: Date.now() - this.startTime.getTime(),
        trace: this.executionTrace
      };

    } catch (error) {
      this.status = 'failed';
      await this.handleWorkflowFailure(error);
      throw error;
    }
  }

  /**
   * Execute workflow in parallel groups (v2)
   */
  async executeParallelGroups() {
    for (const group of this.workflow.parallel_groups) {
      console.log(`\n--- Group: ${group.group_name || group.group_id} ---`);

      if (group.parallel) {
        // Execute agents in this group concurrently
        await this.executeParallelGroup(group);
      } else {
        // Execute agents sequentially
        for (const stepConfig of group.agents) {
          await this.executeAgentStep(stepConfig);
        }
      }
    }
  }

  /**
   * Execute a parallel group
   */
  async executeParallelGroup(group) {
    console.log(`\n⚡ Parallel execution enabled for ${group.agents.length} agents`);

    const startTime = Date.now();
    const promises = group.agents.map(stepConfig =>
      this.executeAgentStep(stepConfig).catch(error => ({
        error,
        stepConfig
      }))
    );

    // Wait for all with timeout
    const timeout = group.synchronization?.timeout || CONFIG.TIMEOUT.PARALLEL_GROUP;
    const results = await Promise.race([
      Promise.allSettled(promises),
      this.timeout(timeout, 'Parallel group timeout')
    ]);

    const duration = Date.now() - startTime;

    // Check results
    const failures = results.filter(r => r.status === 'rejected' || r.value?.error);
    const successes = results.filter(r => r.status === 'fulfilled' && !r.value?.error);

    console.log(`\n✓ Parallel group completed in ${duration}ms`);
    console.log(`  Successes: ${successes.length}/${group.agents.length}`);
    if (failures.length > 0) {
      console.log(`  Failures: ${failures.length}`);
    }

    // Handle partial completion
    const partialOk = group.synchronization?.partial_completion === 'allow_with_one_success';
    if (failures.length > 0 && !(partialOk && successes.length > 0)) {
      throw new Error(`Parallel group failed: ${failures.length} agent(s) failed`);
    }

    return results;
  }

  /**
   * Execute workflow sequentially (v1 compatibility)
   */
  async executeSequential() {
    for (const stepConfig of this.workflow.sequence) {
      await this.executeAgentStep(stepConfig);
    }
  }

  /**
   * Execute a single agent step
   */
  async executeAgentStep(stepConfig) {
    const { step, agent, optional } = stepConfig;

    console.log(`\n[Step ${step}] ${agent}`);
    console.log(`Description: ${stepConfig.description}`);

    // Check dependencies
    if (stepConfig.depends_on) {
      const ready = this.checkDependencies(stepConfig.depends_on);
      if (!ready) {
        if (optional) {
          console.log(`⊘ Skipping optional step (dependencies not met)`);
          this.contextBus.push('workflow_state.skipped_steps', step);
          return;
        }
        throw new Error(`Dependencies not met for step ${step}: ${stepConfig.depends_on}`);
      }
    }

    // Update workflow state
    this.contextBus.set('workflow_state.current_step', step);

    try {
      // Execute agent (this is where we'd spawn with Task tool in production)
      const agentOutput = await this.executeAgent(stepConfig);

      // Validate, render, and update context using unified API
      if (agentOutput) {
        await executeStep(stepConfig, agentOutput, this.contextBus.context);
      }

      // Mark step as completed
      this.contextBus.push('workflow_state.completed_steps', step);

      console.log(`✓ Step ${step} completed`);

    } catch (error) {
      console.error(`✗ Step ${step} failed: ${error.message}`);

      // Handle failure
      const shouldRetry = stepConfig.execution?.retry_on_failure &&
                          error.retryCount < (CONFIG.RETRY.MAX_ATTEMPTS || 1);

      if (shouldRetry) {
        console.log(`  Retrying step ${step}...`);
        error.retryCount = (error.retryCount || 0) + 1;
        await this.sleep(CONFIG.RETRY.BACKOFF_MS * error.retryCount);
        return this.executeAgentStep(stepConfig);
      }

      // Record failure
      this.contextBus.push('workflow_state.failed_steps', {
        step_id: step,
        agent: agent,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      if (!optional) {
        throw error;
      } else {
        console.log(`⊘ Skipping optional step due to failure`);
        this.contextBus.push('workflow_state.skipped_steps', step);
      }
    }
  }

  /**
   * Execute agent (placeholder - in production this would use Task tool)
   */
  async executeAgent(stepConfig) {
    // For now, this is a placeholder that loads agent prompts
    // In production, this would spawn agents using the Task tool

    console.log(`  Loading agent: ${stepConfig.agent}`);

    // Load agent prompt
    const agentPath = path.join(CONFIG.PATHS.AGENTS, stepConfig.agent, 'prompt.md');

    try {
      await fs.access(agentPath);
      console.log(`  Agent prompt loaded: ${agentPath}`);
    } catch (error) {
      console.log(`  ⚠ Agent prompt not found: ${agentPath}`);
    }

    // In production implementation, this would:
    // 1. Load agent prompt
    // 2. Prepare context from contextBus
    // 3. Spawn agent using Task tool
    // 4. Wait for agent completion
    // 5. Return agent output

    // For now, return a placeholder indicating the agent would be executed
    return {
      _placeholder: true,
      agent: stepConfig.agent,
      step: stepConfig.step,
      note: 'Agent execution requires Task tool integration - see task-tool-integration.mjs'
    };
  }

  /**
   * Check if dependencies are met
   */
  checkDependencies(dependencies) {
    const completed = this.contextBus.get('workflow_state.completed_steps') || [];
    return dependencies.every(dep => completed.includes(dep));
  }

  /**
   * Finalize workflow execution
   */
  async finalize() {
    const endTime = new Date();
    const duration = endTime.getTime() - this.startTime.getTime();

    // Save final context
    const sessionPath = path.join(CONFIG.PATHS.CONTEXT, 'sessions', this.sessionId, 'final-context.json');
    await this.contextBus.saveToFile(sessionPath);

    // Save execution trace
    const tracePath = path.join(CONFIG.PATHS.TRACES, `${this.sessionId}.json`);
    const trace = {
      session_id: this.sessionId,
      workflow_name: this.workflow.workflow.name,
      started_at: this.startTime.toISOString(),
      completed_at: endTime.toISOString(),
      total_duration_ms: duration,
      status: this.status,
      execution_log: this.executionTrace
    };
    await fs.mkdir(path.dirname(tracePath), { recursive: true });
    await fs.writeFile(tracePath, JSON.stringify(trace, null, 2));

    console.log(`\n📊 Execution Summary:`);
    console.log(`  Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`  Steps completed: ${this.contextBus.get('workflow_state.completed_steps').length}`);
    console.log(`  Steps failed: ${this.contextBus.get('workflow_state.failed_steps').length}`);
    console.log(`  Steps skipped: ${this.contextBus.get('workflow_state.skipped_steps').length}`);
    console.log(`  Session: ${sessionPath}`);
    console.log(`  Trace: ${tracePath}`);
  }

  /**
   * Handle workflow failure
   */
  async handleWorkflowFailure(error) {
    console.error(`\n❌ Workflow execution failed: ${error.message}`);

    // Save failure state
    const failurePath = path.join(CONFIG.PATHS.CONTEXT, 'sessions', this.sessionId, 'failure.json');
    await fs.mkdir(path.dirname(failurePath), { recursive: true });
    await fs.writeFile(failurePath, JSON.stringify({
      error: error.message,
      stack: error.stack,
      context: this.contextBus.export(),
      timestamp: new Date().toISOString()
    }, null, 2));

    console.error(`  Failure details saved: ${failurePath}`);
  }

  /**
   * Utility: Sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Utility: Timeout
   */
  timeout(ms, message) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    );
  }
}

// ============================================================================
// CLI Entry Point
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const parseArg = (flag) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : null;
  };

  const workflowFile = parseArg('--workflow');
  const inputFile = parseArg('--input');
  const projectName = parseArg('--project') || 'Unnamed Project';

  if (!workflowFile) {
    console.error(`
Usage: node workflow-executor.mjs --workflow <workflow.yaml> [options]

Options:
  --workflow <file>    Path to workflow YAML file (required)
  --input <file>       Input specification file
  --project <name>     Project name
  --help               Show this help

Examples:
  node workflow-executor.mjs --workflow .claude/workflows/greenfield-fullstack-v2.yaml
  node workflow-executor.mjs --workflow greenfield-ui.yaml --input user-spec.md
    `);
    process.exit(1);
  }

  try {
    // Resolve workflow path
    let workflowPath = workflowFile;
    if (!path.isAbsolute(workflowPath)) {
      // Try relative to workflows directory
      const relPath = path.join(CONFIG.PATHS.WORKFLOWS, workflowFile);
      try {
        await fs.access(relPath);
        workflowPath = relPath;
      } catch {
        // Use as-is
      }
    }

    // Create executor
    const executor = new WorkflowExecutor(workflowPath, {
      projectName,
      inputFile
    });

    // Initialize and execute
    await executor.initialize();
    const result = await executor.execute();

    console.log('\n✓ Execution complete');
    console.log(`  Session ID: ${result.sessionId}`);
    console.log(`  Duration: ${(result.duration / 1000).toFixed(2)}s\n`);

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Export for use as module
export { WorkflowExecutor };
