#!/usr/bin/env node

/**
 * Task Tool Integration Layer
 *
 * Provides abstraction for spawning BMAD agents using Claude Code's Task tool.
 * Enables true parallel execution with isolated agent contexts.
 *
 * Features:
 * - Agent prompt loading and preparation
 * - Context injection from context bus
 * - Task tool invocation with proper configuration
 * - Result collection and validation
 * - Error handling and retry logic
 *
 * @version 2.0.0
 * @date 2025-11-13
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  PATHS: {
    AGENTS: path.join(PROJECT_ROOT, '.claude/agents'),
    RULES: path.join(PROJECT_ROOT, '.claude/rules'),
    TEMPLATES: path.join(PROJECT_ROOT, '.claude/templates'),
    SCHEMAS: path.join(PROJECT_ROOT, '.claude/schemas')
  },
  MODELS: {
    default: 'sonnet',
    fast: 'haiku',
    powerful: 'opus'
  },
  TIMEOUTS: {
    analyst: 300000,      // 5 min
    pm: 360000,           // 6 min
    architect: 600000,    // 10 min
    developer: 900000,    // 15 min
    qa: 360000,           // 6 min
    'ux-expert': 480000,  // 8 min
    default: 600000       // 10 min
  }
};

// ============================================================================
// Agent Spawner Class
// ============================================================================

class AgentSpawner {
  constructor(contextBus) {
    this.contextBus = contextBus;
  }

  /**
   * Spawn an agent using Task tool
   */
  async spawnAgent(stepConfig, agentInputs) {
    const { agent, step, template, task } = stepConfig;

    console.log(`  🚀 Spawning agent: ${agent} (step ${step})`);

    // Load agent prompt
    const agentPrompt = await this.loadAgentPrompt(agent);

    // Prepare context for agent
    const contextData = this.prepareContext(stepConfig, agentInputs);

    // Load enterprise rules
    const rules = await this.loadRelevantRules(agent, stepConfig);

    // Build complete prompt
    const fullPrompt = this.buildPrompt({
      agentPrompt,
      contextData,
      rules,
      template,
      task,
      stepConfig
    });

    // Determine model and timeout
    const model = this.selectModel(agent, stepConfig);
    const timeout = CONFIG.TIMEOUTS[agent] || CONFIG.TIMEOUTS.default;

    // Create Task invocation
    const taskConfig = {
      subagent_type: 'general-purpose',
      description: `${agent} agent: ${stepConfig.description}`,
      model: model,
      prompt: fullPrompt
    };

    try {
      // In production, this would actually invoke the Task tool
      // For now, we return the configuration for manual invocation
      console.log(`  ⚡ Agent configured for Task tool invocation`);
      console.log(`     Model: ${model}`);
      console.log(`     Timeout: ${timeout}ms`);

      // PRODUCTION IMPLEMENTATION:
      // const result = await this.invokeTask(taskConfig, timeout);
      // return this.parseAgentOutput(result, stepConfig);

      // CURRENT (returns config for now):
      return {
        _taskConfig: taskConfig,
        _timeout: timeout,
        _note: 'This would invoke Task tool in production. For manual testing, use the task configuration provided.',
        agent,
        step
      };

    } catch (error) {
      throw new Error(`Agent ${agent} (step ${step}) failed: ${error.message}`);
    }
  }

  /**
   * Spawn multiple agents in parallel
   */
  async spawnParallelAgents(stepConfigs, groupInputs) {
    console.log(`\n  ⚡ Spawning ${stepConfigs.length} agents in parallel...`);

    const promises = stepConfigs.map(async (stepConfig, index) => {
      const agentInputs = groupInputs[index] || {};
      try {
        const result = await this.spawnAgent(stepConfig, agentInputs);
        return { success: true, stepConfig, result };
      } catch (error) {
        return { success: false, stepConfig, error };
      }
    });

    const results = await Promise.allSettled(promises);

    const successes = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failures = results.filter(r => r.status === 'rejected' || !r.value.success);

    console.log(`  ✓ Parallel spawn complete: ${successes.length} success, ${failures.length} failed`);

    return {
      successes: successes.map(r => r.value),
      failures: failures.map(r => r.value || r.reason),
      all: results
    };
  }

  /**
   * Load agent prompt from file
   */
  async loadAgentPrompt(agentName) {
    const promptPath = path.join(CONFIG.PATHS.AGENTS, agentName, 'prompt.md');

    try {
      const content = await fs.readFile(promptPath, 'utf-8');
      return content;
    } catch (error) {
      throw new Error(`Failed to load agent prompt: ${promptPath}`);
    }
  }

  /**
   * Load relevant enterprise rules
   */
  async loadRelevantRules(agentName, stepConfig) {
    const rules = [];

    // Always load core rules
    try {
      const writingRules = await fs.readFile(
        path.join(CONFIG.PATHS.RULES, 'writing.md'),
        'utf-8'
      );
      rules.push({ type: 'writing', content: writingRules });
    } catch (error) {
      console.warn(`    ⚠ Could not load writing rules: ${error.message}`);
    }

    // Load agent-specific rules based on context
    // (This would be expanded based on manifest.yaml in production)

    return rules;
  }

  /**
   * Prepare context data for agent
   */
  prepareContext(stepConfig, agentInputs) {
    const { agent, step, inputs } = stepConfig;

    // Gather required inputs from context bus
    const contextData = {
      step_id: step,
      agent_name: agent,
      inputs: {}
    };

    // Load required inputs
    if (inputs && Array.isArray(inputs)) {
      for (const inputPath of inputs) {
        const value = this.contextBus.get(this.resolveContextPath(inputPath));
        if (value) {
          contextData.inputs[inputPath] = value;
        }
      }
    }

    // Add any direct inputs
    if (agentInputs) {
      contextData.direct_inputs = agentInputs;
    }

    // Add global context
    contextData.global_context = this.contextBus.get('global_context') || {};

    // Add project metadata
    contextData.project = this.contextBus.get('project_metadata') || {};

    return contextData;
  }

  /**
   * Resolve context path (handles both relative and absolute paths)
   */
  resolveContextPath(inputPath) {
    // Remove leading ./ or /
    let cleanPath = inputPath.replace(/^\.\//, '').replace(/^\//, '');

    // Handle .claude/context/artifacts/ prefix
    if (cleanPath.startsWith('.claude/context/artifacts/')) {
      cleanPath = cleanPath.replace('.claude/context/artifacts/', '');
      return `artifacts.generated.${cleanPath}`;
    }

    return cleanPath;
  }

  /**
   * Build complete prompt for agent
   */
  buildPrompt({ agentPrompt, contextData, rules, template, task, stepConfig }) {
    const sections = [];

    // 1. Agent prompt (core identity and instructions)
    sections.push('# Agent Instructions');
    sections.push(agentPrompt);

    // 2. Enterprise rules
    if (rules && rules.length > 0) {
      sections.push('\n# Enterprise Rules & Standards');
      sections.push('You MUST follow these enterprise standards:');
      for (const rule of rules) {
        sections.push(`\n## ${rule.type} Standards`);
        sections.push(rule.content);
      }
    }

    // 3. Context injection
    sections.push('\n# Available Context');
    sections.push('You have access to the following context from previous agents:');
    sections.push('```json');
    sections.push(JSON.stringify(contextData, null, 2));
    sections.push('```');

    // 4. Task-specific instructions
    if (task) {
      sections.push(`\n# Task: ${task}`);
      sections.push(`Execute the task: ${task}`);
    }

    // 5. Template reference
    if (template) {
      sections.push(`\n# Output Template`);
      sections.push(`Use template: ${template}`);
      sections.push(`Template path: .claude/templates/${template}.md`);
    }

    // 6. Schema requirements
    if (stepConfig.validators) {
      sections.push('\n# Validation Requirements');
      for (const validator of stepConfig.validators) {
        if (validator.schema) {
          sections.push(`- Output MUST conform to schema: ${validator.schema}`);
        }
      }
    }

    // 7. Output format
    sections.push('\n# Output Format');
    sections.push('Return ONLY valid JSON conforming to the specified schema.');
    sections.push('Do NOT include explanatory text outside the JSON.');
    sections.push('The JSON will be automatically validated and rendered.');

    return sections.join('\n');
  }

  /**
   * Select appropriate model for agent
   */
  selectModel(agentName, stepConfig) {
    // Check explicit configuration
    if (stepConfig.execution?.model) {
      return stepConfig.execution.model;
    }

    // Use haiku for fast agents
    if (['analyst', 'pm'].includes(agentName)) {
      return CONFIG.MODELS.fast;
    }

    // Use sonnet for most agents
    if (['ux-expert', 'qa'].includes(agentName)) {
      return CONFIG.MODELS.default;
    }

    // Use opus for complex agents
    if (['architect', 'developer'].includes(agentName)) {
      return CONFIG.MODELS.powerful;
    }

    return CONFIG.MODELS.default;
  }

  /**
   * Invoke Task tool (production implementation)
   */
  async invokeTask(taskConfig, timeout) {
    // PRODUCTION IMPLEMENTATION:
    // This would actually invoke the Task tool through Claude Code's API
    //
    // The implementation depends on the environment:
    // - In Claude Code CLI: Use Task tool directly
    // - In custom environment: Use Claude API with proper tool configuration
    //
    // Example pseudo-code:
    // ```
    // const response = await claude.tools.invoke('Task', {
    //   subagent_type: taskConfig.subagent_type,
    //   description: taskConfig.description,
    //   prompt: taskConfig.prompt,
    //   model: taskConfig.model
    // });
    //
    // return response.result;
    // ```

    throw new Error('Task tool invocation not implemented - see production TODO');
  }

  /**
   * Parse agent output
   */
  parseAgentOutput(rawOutput, stepConfig) {
    try {
      // Attempt to parse JSON from output
      const jsonMatch = rawOutput.match(/```json\n([\s\S]*?)\n```/) ||
                        rawOutput.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in agent output');
      }

      const jsonText = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonText);

      return parsed;

    } catch (error) {
      throw new Error(`Failed to parse agent output: ${error.message}`);
    }
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create agent spawner
 */
function createAgentSpawner(contextBus) {
  return new AgentSpawner(contextBus);
}

/**
 * Test agent spawn configuration
 */
async function testAgentSpawn(agentName, stepConfig, contextBus) {
  const spawner = new AgentSpawner(contextBus);

  try {
    const result = await spawner.spawnAgent(stepConfig, {});
    console.log('\n✓ Agent spawn configuration generated:');
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('\n✗ Agent spawn failed:', error.message);
    throw error;
  }
}

// ============================================================================
// CLI Entry Point (for testing)
// ============================================================================

async function main() {
  console.log('Task Tool Integration Layer - Test Mode');
  console.log('This module provides agent spawning capabilities.');
  console.log('\nUse createAgentSpawner(contextBus) to create a spawner instance.');
  console.log('\nProduction implementation requires Task tool integration.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Export
export {
  AgentSpawner,
  createAgentSpawner,
  testAgentSpawn,
  CONFIG as AgentSpawnerConfig
};
