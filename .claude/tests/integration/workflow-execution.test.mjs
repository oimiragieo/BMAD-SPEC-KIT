#!/usr/bin/env node

/**
 * Integration Tests - Workflow Execution
 *
 * Comprehensive integration tests for workflow execution.
 *
 * @version 2.0.0
 * @date 2025-11-13
 */

import { WorkflowExecutor } from '../../tools/orchestrator/workflow-executor.mjs';
import { createContextBus } from '../../tools/context/context-bus.mjs';
import assert from 'assert';

// Test Suite
const tests = {
  async testWorkflowInitialization() {
    console.log('\n🧪 Test: Workflow Initialization');

    const executor = new WorkflowExecutor('.claude/workflows/greenfield-fullstack-v2.yaml', {
      projectName: 'Test Project'
    });

    await executor.initialize();

    assert(executor.sessionId, 'Session ID should be set');
    assert(executor.workflow, 'Workflow should be loaded');
    assert(executor.contextBus, 'Context bus should be initialized');

    console.log('  ✓ PASSED');
  },

  async testContextBusOperations() {
    console.log('\n🧪 Test: Context Bus Operations');

    const contextBus = await createContextBus();

    // Test set/get
    contextBus.set('test.value', 42);
    assert.strictEqual(contextBus.get('test.value'), 42);

    // Test update
    contextBus.update('test', { another: 'value' });
    assert.strictEqual(contextBus.get('test.another'), 'value');

    // Test checkpoint/restore
    const checkpointId = contextBus.checkpoint('test');
    contextBus.set('test.value', 99);
    contextBus.restore(checkpointId);
    assert.strictEqual(contextBus.get('test.value'), 42);

    console.log('  ✓ PASSED');
  },

  async testParallelGroupConfiguration() {
    console.log('\n🧪 Test: Parallel Group Configuration');

    const executor = new WorkflowExecutor('.claude/workflows/greenfield-fullstack-v2.yaml');
    await executor.initialize();

    const parallelGroups = executor.workflow.parallel_groups || [];
    const designGroup = parallelGroups.find(g => g.parallel === true);

    assert(designGroup, 'Parallel group should exist');
    assert(designGroup.agents.length >= 2, 'Parallel group should have multiple agents');

    console.log('  ✓ PASSED');
  }
};

// Run all tests
async function runTests() {
  console.log('============================================================================');
  console.log('BMAD-SPEC-KIT V2 - Integration Tests');
  console.log('============================================================================');

  let passed = 0;
  let failed = 0;

  for (const [name, test] of Object.entries(tests)) {
    try {
      await test();
      passed++;
    } catch (error) {
      console.error(`  ✗ FAILED: ${error.message}`);
      failed++;
    }
  }

  console.log('\n============================================================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('============================================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
