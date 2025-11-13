#!/usr/bin/env node

/**
 * Unified Step Executor for BMAD-SPEC-KIT
 *
 * Automates the complete pipeline: validate → render → update
 * Eliminates manual tool invocation errors and provides unified error handling
 *
 * Usage:
 *   node .claude/tools/orchestrator/execute-step.mjs \
 *     --config <step-config.json> \
 *     --context <session-context.json>
 *
 * Features:
 *   - Automatic schema validation with auto-fix
 *   - Artifact rendering (JSON → Markdown)
 *   - Session context updates (transactional)
 *   - Unified error handling with recovery options
 *   - Execution trace logging
 *   - Quality metrics tracking
 *
 * @version 2.0.0
 * @date 2025-11-13
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

// ============================================================================
// Configuration & Constants
// ============================================================================

const CONFIG = {
  TOOLS: {
    GATE: path.join(PROJECT_ROOT, '.claude/tools/gates/gate.mjs'),
    RENDER: path.join(PROJECT_ROOT, '.claude/tools/renderers/bmad-render.mjs'),
    UPDATE_SESSION: path.join(PROJECT_ROOT, '.claude/tools/context/update-session.mjs')
  },
  PATHS: {
    CONTEXT: path.join(PROJECT_ROOT, '.claude/context'),
    ARTIFACTS: path.join(PROJECT_ROOT, '.claude/context/artifacts'),
    GATES: path.join(PROJECT_ROOT, '.claude/context/history/gates'),
    TRACES: path.join(PROJECT_ROOT, '.claude/context/history/traces'),
    SCHEMAS: path.join(PROJECT_ROOT, '.claude/schemas')
  },
  RETRY: {
    MAX_ATTEMPTS: 2,
    BACKOFF_MS: 1000,
    BACKOFF_MULTIPLIER: 2
  }
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Parse command-line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    parsed[key] = value;
  }

  return parsed;
}

/**
 * Load JSON file
 */
async function loadJSON(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load JSON from ${filePath}: ${error.message}`);
  }
}

/**
 * Save JSON file
 */
async function saveJSON(filePath, data) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to save JSON to ${filePath}: ${error.message}`);
  }
}

/**
 * Execute shell command with error handling
 */
function executeCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: error.stdout || '',
      stderr: error.stderr || ''
    };
  }
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate timestamp
 */
function timestamp() {
  return new Date().toISOString();
}

// ============================================================================
// Core Pipeline Functions
// ============================================================================

/**
 * Step 1: Validate Output with Schema and Auto-Fix
 */
async function validateOutput(stepConfig, agentOutput, sessionContext) {
  console.log('\n[1/4] Validating output...');

  const { schema, agent, step } = stepConfig;
  const { workflow_name } = sessionContext.project_metadata;

  // Determine gate file path
  const gateFile = path.join(
    CONFIG.PATHS.GATES,
    workflow_name,
    `${String(step).padStart(2, '0')}-${agent}.json`
  );

  // Ensure gate directory exists
  await fs.mkdir(path.dirname(gateFile), { recursive: true });

  // Build gate command
  const schemaPath = path.join(CONFIG.PATHS.SCHEMAS, schema);
  const inputPath = path.join(CONFIG.PATHS.ARTIFACTS, `${agent}-output-temp.json`);

  // Save temporary input
  await saveJSON(inputPath, agentOutput);

  // Execute gate validation
  const gateCommand = `node ${CONFIG.TOOLS.GATE} --schema ${schemaPath} --input ${inputPath} --gate ${gateFile} --autofix 1`;

  console.log(`  Schema: ${schema}`);
  console.log(`  Auto-fix: enabled`);

  const result = executeCommand(gateCommand, { silent: true });

  // Load gate result
  let gateResult;
  try {
    gateResult = await loadJSON(gateFile);
  } catch (error) {
    gateResult = {
      passed: false,
      errors: ['Failed to read gate result'],
      auto_fixed: false
    };
  }

  // Clean up temp file
  try {
    await fs.unlink(inputPath);
  } catch (error) {
    // Ignore cleanup errors
  }

  if (!gateResult.passed) {
    console.error('  ✗ Validation failed');
    console.error(`  Errors: ${JSON.stringify(gateResult.errors, null, 2)}`);
    throw new ValidationError('Schema validation failed', gateResult);
  }

  console.log(`  ✓ Validation passed${gateResult.auto_fixed ? ' (with auto-fix)' : ''}`);

  return {
    passed: true,
    auto_fixed: gateResult.auto_fixed,
    gate_file: gateFile,
    gate_result: gateResult
  };
}

/**
 * Step 2: Render Artifact (JSON → Markdown)
 */
async function renderArtifact(stepConfig, agentOutput, sessionContext) {
  console.log('\n[2/4] Rendering artifact...');

  const { render } = stepConfig;

  if (!render) {
    console.log('  ⊘ No rendering required');
    return { skipped: true };
  }

  const { renderer, from: fromPath, to: toPath } = render;

  // Save JSON artifact
  const jsonPath = path.join(PROJECT_ROOT, fromPath);
  await saveJSON(jsonPath, agentOutput);

  // Execute renderer
  const mdPath = path.join(PROJECT_ROOT, toPath);
  const renderCommand = `node ${CONFIG.TOOLS.RENDER} ${renderer} ${jsonPath} > ${mdPath}`;

  console.log(`  Renderer: ${renderer}`);
  console.log(`  Output: ${toPath}`);

  const result = executeCommand(renderCommand, { silent: false });

  if (!result.success) {
    console.error('  ✗ Rendering failed');
    throw new RenderError('Artifact rendering failed', result.error);
  }

  console.log('  ✓ Rendering complete');

  return {
    success: true,
    json_path: fromPath,
    markdown_path: toPath
  };
}

/**
 * Step 3: Update Session Context (Transactional)
 */
async function updateSessionContext(stepConfig, agentOutput, validationResult, renderResult, sessionContext) {
  console.log('\n[3/4] Updating session context...');

  const { agent, step, creates } = stepConfig;

  // Create context update payload
  const contextUpdate = {
    timestamp: timestamp(),
    step_id: step,
    agent: agent,
    status: 'completed',
    outputs: {
      [path.basename(creates, '.json')]: {
        file_reference: renderResult.markdown_path || creates,
        structured_data: agentOutput,
        validation_passed: validationResult.passed,
        auto_fixed: validationResult.auto_fixed,
        quality_metrics: agentOutput.quality_metrics || {}
      }
    },
    validation_results: [
      {
        type: 'schema',
        passed: validationResult.passed,
        auto_fixed: validationResult.auto_fixed,
        gate_file: validationResult.gate_file
      }
    ]
  };

  // Update agent context
  if (!sessionContext.agent_contexts[agent]) {
    sessionContext.agent_contexts[agent] = {
      status: 'pending',
      outputs: {}
    };
  }

  Object.assign(sessionContext.agent_contexts[agent], {
    status: 'completed',
    execution_end: timestamp(),
    ...contextUpdate
  });

  // Update workflow state
  if (!sessionContext.workflow_state.completed_steps.includes(step)) {
    sessionContext.workflow_state.completed_steps.push(step);
  }
  sessionContext.workflow_state.current_step = step + 1;

  // Update artifacts registry
  if (!sessionContext.artifacts) {
    sessionContext.artifacts = {
      generated: [],
      schemas_used: [],
      context_files: []
    };
  }

  if (renderResult.json_path && !sessionContext.artifacts.generated.includes(renderResult.json_path)) {
    sessionContext.artifacts.generated.push(renderResult.json_path);
  }
  if (renderResult.markdown_path && !sessionContext.artifacts.generated.includes(renderResult.markdown_path)) {
    sessionContext.artifacts.generated.push(renderResult.markdown_path);
  }

  const schemaName = path.basename(stepConfig.schema);
  if (!sessionContext.artifacts.schemas_used.includes(schemaName)) {
    sessionContext.artifacts.schemas_used.push(schemaName);
  }

  // Save updated session context
  const sessionPath = path.join(CONFIG.PATHS.CONTEXT, 'session.json');
  await saveJSON(sessionPath, sessionContext);

  console.log('  ✓ Context updated');

  return {
    success: true,
    session_path: sessionPath
  };
}

/**
 * Step 4: Log Execution Trace
 */
async function logExecutionTrace(stepConfig, executionResult, sessionContext) {
  console.log('\n[4/4] Logging execution trace...');

  const { agent, step } = stepConfig;
  const { session_id, project_metadata } = sessionContext;

  // Load or create execution trace
  const traceFile = path.join(CONFIG.PATHS.TRACES, `${session_id}.json`);

  let trace;
  try {
    trace = await loadJSON(traceFile);
  } catch (error) {
    // Initialize new trace
    trace = {
      session_id: session_id,
      workflow_name: project_metadata.workflow_type,
      workflow_version: project_metadata.workflow_version || '1.0.0',
      started_at: project_metadata.created_at,
      status: 'in_progress',
      execution_mode: sessionContext.workflow_state.execution_mode || 'sequential',
      execution_log: []
    };
  }

  // Add execution log entry
  const logEntry = {
    timestamp: timestamp(),
    step_id: step,
    agent: agent,
    action: 'completed',
    status: 'completed',
    duration_ms: executionResult.duration_ms,
    quality_score: executionResult.quality_score,
    artifacts_created: executionResult.artifacts_created,
    validation_results: {
      schema_validation: {
        passed: executionResult.validation_result.passed,
        auto_fixed: executionResult.validation_result.auto_fixed
      }
    }
  };

  trace.execution_log.push(logEntry);

  // Update trace metadata
  trace.completed_at = timestamp();
  trace.total_duration_ms = Date.now() - new Date(trace.started_at).getTime();

  // Check if workflow is complete
  const totalSteps = Object.keys(sessionContext.agent_contexts).length;
  const completedSteps = sessionContext.workflow_state.completed_steps.length;

  if (completedSteps >= totalSteps) {
    trace.status = 'completed';
  }

  // Save trace
  await saveJSON(traceFile, trace);

  console.log('  ✓ Trace logged');

  return {
    success: true,
    trace_file: traceFile
  };
}

// ============================================================================
// Error Handling
// ============================================================================

class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class RenderError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'RenderError';
    this.details = details;
  }
}

/**
 * Handle step errors with recovery options
 */
async function handleStepError(error, stepConfig, sessionContext, attemptNumber = 1) {
  console.error(`\n✗ Step execution failed (attempt ${attemptNumber}/${CONFIG.RETRY.MAX_ATTEMPTS + 1})`);
  console.error(`  Error: ${error.message}`);

  // Check if we should retry
  if (attemptNumber <= CONFIG.RETRY.MAX_ATTEMPTS && stepConfig.execution?.retry_on_failure) {
    const backoffMs = CONFIG.RETRY.BACKOFF_MS * Math.pow(CONFIG.RETRY.BACKOFF_MULTIPLIER, attemptNumber - 1);

    console.log(`  Retrying in ${backoffMs}ms...`);
    await sleep(backoffMs);

    return { retry: true, attempt: attemptNumber + 1 };
  }

  // Check if we should escalate
  if (stepConfig.execution?.escalate_to) {
    console.log(`  Escalating to: ${stepConfig.execution.escalate_to}`);

    return {
      escalate: true,
      escalate_to: stepConfig.execution.escalate_to,
      original_error: error
    };
  }

  // No recovery options - fail
  return {
    failed: true,
    error: error,
    recoverable: false
  };
}

// ============================================================================
// Main Execution Function
// ============================================================================

/**
 * Execute a complete workflow step
 */
async function executeStep(stepConfig, agentOutput, sessionContext) {
  const startTime = Date.now();

  console.log(`\n${'='.repeat(80)}`);
  console.log(`Executing Step ${stepConfig.step}: ${stepConfig.agent}`);
  console.log(`${'='.repeat(80)}`);

  try {
    // Pipeline Step 1: Validate
    const validationResult = await validateOutput(stepConfig, agentOutput, sessionContext);

    // Pipeline Step 2: Render
    const renderResult = await renderArtifact(stepConfig, agentOutput, sessionContext);

    // Pipeline Step 3: Update Context
    const updateResult = await updateSessionContext(
      stepConfig,
      agentOutput,
      validationResult,
      renderResult,
      sessionContext
    );

    // Calculate execution metrics
    const duration_ms = Date.now() - startTime;
    const quality_score = agentOutput.quality_metrics?.overall_score || 0;
    const artifacts_created = [renderResult.json_path, renderResult.markdown_path].filter(Boolean);

    const executionResult = {
      success: true,
      duration_ms,
      quality_score,
      artifacts_created,
      validation_result: validationResult,
      render_result: renderResult,
      update_result: updateResult
    };

    // Pipeline Step 4: Log Trace
    await logExecutionTrace(stepConfig, executionResult, sessionContext);

    console.log(`\n${'='.repeat(80)}`);
    console.log(`✓ Step ${stepConfig.step} completed successfully in ${duration_ms}ms`);
    console.log(`${'='.repeat(80)}\n`);

    return executionResult;

  } catch (error) {
    const duration_ms = Date.now() - startTime;

    console.error(`\n${'='.repeat(80)}`);
    console.error(`✗ Step ${stepConfig.step} failed after ${duration_ms}ms`);
    console.error(`${'='.repeat(80)}\n`);

    throw error;
  }
}

// ============================================================================
// CLI Entry Point
// ============================================================================

async function main() {
  try {
    // Parse arguments
    const args = parseArgs();

    if (!args.config || !args.agentOutput || !args.context) {
      console.error('Usage: node execute-step.mjs --config <config.json> --agentOutput <output.json> --context <session.json>');
      process.exit(1);
    }

    // Load inputs
    const stepConfig = await loadJSON(args.config);
    const agentOutput = await loadJSON(args.agentOutput);
    const sessionContext = await loadJSON(args.context);

    // Execute step
    const result = await executeStep(stepConfig, agentOutput, sessionContext);

    // Output result
    console.log('\nExecution Result:');
    console.log(JSON.stringify(result, null, 2));

    process.exit(0);

  } catch (error) {
    console.error('\nFatal Error:', error.message);
    if (error.stack) {
      console.error('\nStack Trace:');
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
export {
  executeStep,
  validateOutput,
  renderArtifact,
  updateSessionContext,
  logExecutionTrace,
  handleStepError
};
