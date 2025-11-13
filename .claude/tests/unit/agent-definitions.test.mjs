#!/usr/bin/env node

/**
 * Unit Tests - Agent Definitions
 *
 * Tests programmatic agent definitions with tool restrictions
 *
 * @version 2.0.0
 * @date 2025-11-13
 */

import assert from 'assert';
import {
  getAgentDefinition,
  getAllAgents,
  getAgentsByTool,
  getAgentsByModel,
  validateAllAgents,
  getAgentCostEstimate,
  generateAgentReport,
  TOOL_SETS
} from '../../tools/agents/agent-definitions.mjs';

// ============================================================================
// Test Suite
// ============================================================================

const tests = {
  async testAgentDefinitionRetrieval() {
    console.log('\n🧪 Test: Agent Definition Retrieval');

    const analyst = getAgentDefinition('analyst');
    assert(analyst, 'Should retrieve analyst definition');
    assert.strictEqual(analyst.name, 'analyst');
    assert.strictEqual(analyst.title, 'Business Analyst');
    assert(analyst.tools.length > 0, 'Should have tools defined');

    console.log('  ✓ PASSED');
  },

  async testToolRestrictions() {
    console.log('\n🧪 Test: Tool Restrictions');

    const analyst = getAgentDefinition('analyst');
    const developer = getAgentDefinition('developer');
    const qa = getAgentDefinition('qa');

    // Analyst should only have read-only tools
    assert.deepStrictEqual(analyst.tools, TOOL_SETS.READ_ONLY);
    console.log(`  ✓ Analyst has read-only tools: ${analyst.tools.join(', ')}`);

    // Developer should have development tools
    assert.deepStrictEqual(developer.tools, TOOL_SETS.DEVELOPMENT);
    console.log(`  ✓ Developer has development tools: ${developer.tools.join(', ')}`);

    // QA should have testing tools
    assert.deepStrictEqual(qa.tools, TOOL_SETS.TESTING);
    console.log(`  ✓ QA has testing tools: ${qa.tools.join(', ')}`);

    console.log('  ✓ PASSED');
  },

  async testModelSelection() {
    console.log('\n🧪 Test: Model Selection');

    const qa = getAgentDefinition('qa');
    const analyst = getAgentDefinition('analyst');
    const orchestrator = getAgentDefinition('bmad-orchestrator');

    // QA should use Haiku (cost optimization for routine tasks)
    assert.strictEqual(qa.model, 'claude-haiku-4');
    console.log(`  ✓ QA uses Haiku: ${qa.model}`);

    // Analyst should use Sonnet (complex analysis)
    assert.strictEqual(analyst.model, 'claude-sonnet-4-5');
    console.log(`  ✓ Analyst uses Sonnet: ${analyst.model}`);

    // Orchestrator should use Opus (premium coordination)
    assert.strictEqual(orchestrator.model, 'claude-opus-4-1');
    console.log(`  ✓ Orchestrator uses Opus: ${orchestrator.model}`);

    console.log('  ✓ PASSED');
  },

  async testCostEstimation() {
    console.log('\n🧪 Test: Cost Estimation');

    const haikuCost = getAgentCostEstimate('qa', 10000, 2000);
    const sonnetCost = getAgentCostEstimate('analyst', 10000, 2000);
    const opusCost = getAgentCostEstimate('bmad-orchestrator', 10000, 2000);

    console.log(`  💰 Haiku cost: $${haikuCost.estimated_cost.toFixed(6)}`);
    console.log(`  💰 Sonnet cost: $${sonnetCost.estimated_cost.toFixed(6)}`);
    console.log(`  💰 Opus cost: $${opusCost.estimated_cost.toFixed(6)}`);

    // Haiku should be cheaper than Sonnet
    assert(haikuCost.estimated_cost < sonnetCost.estimated_cost,
      'Haiku should be cheaper than Sonnet');

    // Sonnet should be cheaper than Opus
    assert(sonnetCost.estimated_cost < opusCost.estimated_cost,
      'Sonnet should be cheaper than Opus');

    console.log('  ✓ PASSED');
  },

  async testAgentValidation() {
    console.log('\n🧪 Test: Agent Validation');

    const results = validateAllAgents();

    console.log(`  ✓ Valid agents: ${results.valid.length}`);
    console.log(`  ✓ Invalid agents: ${results.invalid.length}`);

    if (results.invalid.length > 0) {
      console.error('  ✗ Invalid agents found:');
      for (const invalid of results.invalid) {
        console.error(`    - ${invalid.name}: ${invalid.error}`);
      }
    }

    assert(results.valid.length > 0, 'Should have valid agents');
    assert.strictEqual(results.invalid.length, 0, 'Should have no invalid agents');

    console.log('  ✓ PASSED');
  },

  async testAgentQueryByTool() {
    console.log('\n🧪 Test: Query Agents by Tool');

    const readAgents = getAgentsByTool('Read');
    const bashAgents = getAgentsByTool('Bash');
    const editAgents = getAgentsByTool('Edit');

    console.log(`  ✓ Agents with Read tool: ${readAgents.map(a => a.name).join(', ')}`);
    console.log(`  ✓ Agents with Bash tool: ${bashAgents.map(a => a.name).join(', ')}`);
    console.log(`  ✓ Agents with Edit tool: ${editAgents.map(a => a.name).join(', ')}`);

    assert(readAgents.length > 0, 'Should have agents with Read tool');
    assert(bashAgents.length > 0, 'Should have agents with Bash tool');
    assert(editAgents.length > 0, 'Should have agents with Edit tool');

    console.log('  ✓ PASSED');
  },

  async testAgentQueryByModel() {
    console.log('\n🧪 Test: Query Agents by Model');

    const haikuAgents = getAgentsByModel('claude-haiku-4');
    const sonnetAgents = getAgentsByModel('claude-sonnet-4-5');
    const opusAgents = getAgentsByModel('claude-opus-4-1');

    console.log(`  ✓ Haiku agents: ${haikuAgents.map(a => a.name).join(', ')}`);
    console.log(`  ✓ Sonnet agents: ${sonnetAgents.map(a => a.name).join(', ')}`);
    console.log(`  ✓ Opus agents: ${opusAgents.map(a => a.name).join(', ')}`);

    console.log('  ✓ PASSED');
  },

  async testAgentReport() {
    console.log('\n🧪 Test: Agent Usage Report');

    const report = generateAgentReport();

    console.log(`  ✓ Total agents: ${report.total_agents}`);
    console.log(`  ✓ Haiku agents: ${report.cost_optimization.haiku_agents.join(', ')}`);
    console.log(`  ✓ Sonnet agents: ${report.cost_optimization.sonnet_agents.join(', ')}`);
    console.log(`  ✓ Opus agents: ${report.cost_optimization.opus_agents.join(', ')}`);

    assert(report.total_agents > 0, 'Should have agents');
    assert(Object.keys(report.by_model).length > 0, 'Should have model groupings');

    console.log('  ✓ PASSED');
  },

  async testAgentCapabilities() {
    console.log('\n🧪 Test: Agent Capabilities');

    const developer = getAgentDefinition('developer');
    const architect = getAgentDefinition('architect');

    assert(developer.capabilities.length > 0, 'Developer should have capabilities');
    assert(architect.capabilities.length > 0, 'Architect should have capabilities');

    console.log(`  ✓ Developer capabilities: ${developer.capabilities.length}`);
    console.log(`  ✓ Architect capabilities: ${architect.capabilities.length}`);

    console.log('  ✓ PASSED');
  },

  async testSystemPromptLoading() {
    console.log('\n🧪 Test: System Prompt Loading');

    const analyst = getAgentDefinition('analyst');

    // Load system prompt
    const systemPrompt = await analyst.loadSystemPrompt();

    assert(systemPrompt, 'Should load system prompt');
    assert(systemPrompt.length > 0, 'System prompt should not be empty');
    assert(systemPrompt.includes('Analyst'), 'Should contain agent identity');

    console.log(`  ✓ Loaded system prompt: ${systemPrompt.length} characters`);

    console.log('  ✓ PASSED');
  }
};

// ============================================================================
// Test Runner
// ============================================================================

async function runTests() {
  console.log('============================================================================');
  console.log('Agent Definitions - Unit Tests');
  console.log('============================================================================');

  let passed = 0;
  let failed = 0;

  for (const [name, test] of Object.entries(tests)) {
    try {
      await test();
      passed++;
    } catch (error) {
      console.error(`  ✗ FAILED: ${error.message}`);
      console.error(error.stack);
      failed++;
    }
  }

  console.log('\n============================================================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('============================================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { tests, runTests };
