#!/usr/bin/env node

/**
 * Unit Tests - Tool Runner Pattern
 *
 * Tests type-safe tool execution with Zod schema validation
 *
 * @version 2.0.0
 * @date 2025-11-13
 */

import assert from 'assert';
import {
  ToolRunner,
  ValidationTool,
  RenderingTool,
  QualityGateTool,
  ContextUpdateTool,
  CostTrackingTool,
  ToolRegistry,
  globalRegistry
} from '../../tools/sdk/tool-runner.mjs';

// ============================================================================
// Test Suite
// ============================================================================

const tests = {
  async testToolRegistryInitialization() {
    console.log('\n🧪 Test: Tool Registry Initialization');

    const registry = new ToolRegistry();

    assert(registry.tools.size > 0, 'Should have registered tools');
    console.log(`  ✓ Registered ${registry.tools.size} tools`);

    const toolNames = registry.list();
    console.log(`  ✓ Available tools: ${toolNames.join(', ')}`);

    assert(toolNames.includes('bmad_validate'), 'Should have validation tool');
    assert(toolNames.includes('bmad_render'), 'Should have rendering tool');
    assert(toolNames.includes('bmad_quality_gate'), 'Should have quality gate tool');

    console.log('  ✓ PASSED');
  },

  async testToolRetrieval() {
    console.log('\n🧪 Test: Tool Retrieval');

    const validationTool = globalRegistry.get('bmad_validate');

    assert(validationTool instanceof ValidationTool, 'Should retrieve ValidationTool instance');
    assert.strictEqual(validationTool.name, 'bmad_validate');
    console.log(`  ✓ Retrieved tool: ${validationTool.name}`);

    console.log('  ✓ PASSED');
  },

  async testQualityGateTool() {
    console.log('\n🧪 Test: Quality Gate Tool');

    const qualityTool = new QualityGateTool();

    // Test with passing quality metrics
    const passingResult = await qualityTool.execute({
      metrics: {
        completeness: 9.0,
        clarity: 8.5,
        technical_feasibility: 8.0,
        alignment: 9.0
      },
      threshold: 7.0,
      agent: 'analyst',
      step: 1
    });

    assert.strictEqual(passingResult.success, true, 'Should execute successfully');
    assert.strictEqual(passingResult.result.passed, true, 'Should pass quality gate');
    assert(passingResult.result.overall_score > 7.0, 'Should have high overall score');
    console.log(`  ✓ Passing quality: ${passingResult.result.overall_score.toFixed(2)}`);

    // Test with failing quality metrics
    const failingResult = await qualityTool.execute({
      metrics: {
        completeness: 5.0,
        clarity: 6.0,
        technical_feasibility: 5.5
      },
      threshold: 7.0,
      agent: 'pm',
      step: 2
    });

    assert.strictEqual(failingResult.success, true, 'Should execute successfully');
    assert.strictEqual(failingResult.result.passed, false, 'Should fail quality gate');
    assert(failingResult.result.recommendations.length > 0, 'Should have recommendations');
    console.log(`  ✓ Failing quality: ${failingResult.result.overall_score.toFixed(2)}`);
    console.log(`  ✓ Recommendations: ${failingResult.result.recommendations.length}`);

    console.log('  ✓ PASSED');
  },

  async testCostTrackingTool() {
    console.log('\n🧪 Test: Cost Tracking Tool');

    const costTool = new CostTrackingTool();

    const result = await costTool.execute({
      message_id: 'msg_test_123',
      agent: 'developer',
      model: 'claude-sonnet-4-5',
      usage: {
        input_tokens: 10000,
        output_tokens: 2000,
        cache_read_tokens: 5000
      }
    });

    assert.strictEqual(result.success, true, 'Should execute successfully');
    assert.strictEqual(result.result.tracked, true, 'Should track cost');
    assert(result.result.cost_usd > 0, 'Should calculate cost');

    console.log(`  ✓ Tracked cost: $${result.result.cost_usd.toFixed(6)}`);
    console.log(`  ✓ Agent: ${result.result.agent}`);
    console.log(`  ✓ Model: ${result.result.model}`);

    console.log('  ✓ PASSED');
  },

  async testToolValidation() {
    console.log('\n🧪 Test: Tool Parameter Validation');

    const qualityTool = new QualityGateTool();

    // Test with invalid parameters (missing required fields)
    const invalidResult = await qualityTool.execute({
      metrics: {
        completeness: 8.0
      }
      // Missing threshold, agent, step
    });

    assert.strictEqual(invalidResult.success, false, 'Should fail validation');
    assert.strictEqual(invalidResult.error, 'Validation failed');
    assert(invalidResult.details.length > 0, 'Should have validation errors');

    console.log(`  ✓ Validation errors detected: ${invalidResult.details.length}`);
    for (const detail of invalidResult.details) {
      console.log(`    - ${detail.path}: ${detail.message}`);
    }

    console.log('  ✓ PASSED');
  },

  async testToolValidationWithInvalidTypes() {
    console.log('\n🧪 Test: Tool Type Validation');

    const qualityTool = new QualityGateTool();

    // Test with invalid types (string instead of number)
    const invalidResult = await qualityTool.execute({
      metrics: {
        completeness: '8.0' // Should be number
      },
      threshold: 7.0,
      agent: 'analyst',
      step: 1
    });

    assert.strictEqual(invalidResult.success, false, 'Should fail type validation');
    console.log(`  ✓ Type validation enforced`);

    console.log('  ✓ PASSED');
  },

  async testRenderingToolSchema() {
    console.log('\n🧪 Test: Rendering Tool Schema');

    const renderTool = new RenderingTool();

    // Test with invalid template type
    const invalidResult = await renderTool.execute({
      template_type: 'invalid-template',
      artifact_path: '/path/to/artifact.json'
    });

    assert.strictEqual(invalidResult.success, false, 'Should fail with invalid template');
    console.log(`  ✓ Template type validation enforced`);

    console.log('  ✓ PASSED');
  },

  async testToolDefinitionGeneration() {
    console.log('\n🧪 Test: Tool Definition Generation');

    const definitions = globalRegistry.getDefinitions();

    assert(definitions.length > 0, 'Should have tool definitions');
    console.log(`  ✓ Generated ${definitions.length} tool definitions`);

    for (const def of definitions) {
      assert(def.name, 'Definition should have name');
      assert(def.description, 'Definition should have description');
      console.log(`    - ${def.name}: ${def.description.substring(0, 60)}...`);
    }

    console.log('  ✓ PASSED');
  },

  async testCustomToolRegistration() {
    console.log('\n🧪 Test: Custom Tool Registration');

    // Create a custom tool
    class CustomTool extends ToolRunner {
      constructor() {
        super(
          'custom_test_tool',
          'A custom test tool',
          { type: 'object', properties: {} }
        );
      }

      async run(params) {
        return { custom: true };
      }
    }

    const registry = new ToolRegistry();
    const customTool = new CustomTool();
    registry.register(customTool);

    const retrieved = registry.get('custom_test_tool');
    assert(retrieved instanceof CustomTool, 'Should retrieve custom tool');

    console.log(`  ✓ Registered custom tool: ${customTool.name}`);

    console.log('  ✓ PASSED');
  },

  async testQualityGateRecommendations() {
    console.log('\n🧪 Test: Quality Gate Recommendations');

    const qualityTool = new QualityGateTool();

    const result = await qualityTool.execute({
      metrics: {
        completeness: 5.0,
        clarity: 6.0,
        technical_feasibility: 8.0,
        alignment: 4.5
      },
      threshold: 7.0,
      agent: 'architect',
      step: 3
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.result.passed, false);
    assert(result.result.recommendations.length > 0, 'Should have recommendations');

    console.log(`  ✓ Generated ${result.result.recommendations.length} recommendations`);

    for (const rec of result.result.recommendations) {
      console.log(`    - ${rec.metric}: gap ${rec.gap.toFixed(1)}`);
      console.log(`      ${rec.suggestion}`);
    }

    console.log('  ✓ PASSED');
  },

  async testCostCalculationAccuracy() {
    console.log('\n🧪 Test: Cost Calculation Accuracy');

    const costTool = new CostTrackingTool();

    // Test with Haiku (cheapest)
    const haikuResult = await costTool.execute({
      message_id: 'msg_haiku',
      agent: 'qa',
      model: 'claude-haiku-4',
      usage: {
        input_tokens: 10000,
        output_tokens: 2000
      }
    });

    // Test with Sonnet (mid-tier)
    const sonnetResult = await costTool.execute({
      message_id: 'msg_sonnet',
      agent: 'analyst',
      model: 'claude-sonnet-4-5',
      usage: {
        input_tokens: 10000,
        output_tokens: 2000
      }
    });

    // Test with Opus (expensive)
    const opusResult = await costTool.execute({
      message_id: 'msg_opus',
      agent: 'bmad-orchestrator',
      model: 'claude-opus-4-1',
      usage: {
        input_tokens: 10000,
        output_tokens: 2000
      }
    });

    const haikuCost = haikuResult.result.cost_usd;
    const sonnetCost = sonnetResult.result.cost_usd;
    const opusCost = opusResult.result.cost_usd;

    console.log(`  💰 Haiku: $${haikuCost.toFixed(6)}`);
    console.log(`  💰 Sonnet: $${sonnetCost.toFixed(6)}`);
    console.log(`  💰 Opus: $${opusCost.toFixed(6)}`);

    assert(haikuCost < sonnetCost, 'Haiku should be cheaper than Sonnet');
    assert(sonnetCost < opusCost, 'Sonnet should be cheaper than Opus');

    const savings = ((sonnetCost - haikuCost) / sonnetCost * 100).toFixed(1);
    console.log(`  ✓ Haiku saves ${savings}% vs Sonnet`);

    console.log('  ✓ PASSED');
  }
};

// ============================================================================
// Test Runner
// ============================================================================

async function runTests() {
  console.log('============================================================================');
  console.log('Tool Runner Pattern - Unit Tests');
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
