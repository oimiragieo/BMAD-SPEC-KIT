#!/usr/bin/env node

/**
 * Tool Runner Pattern with Type-Safe Zod Schemas
 *
 * Implements Claude SDK best practices for custom tool definitions:
 * - Type-safe tool invocation with Zod schema validation
 * - Automatic parameter validation and error messages
 * - Reusable tool definitions for BMAD operations
 * - Integration with workflow executor
 *
 * Based on: https://docs.claude.com/en/docs/agent-sdk/tool-use.md
 *
 * @version 2.0.0
 * @date 2025-11-13
 */

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

// ============================================================================
// Base Tool Runner Class
// ============================================================================

/**
 * Base class for type-safe tool execution
 */
class ToolRunner {
  constructor(name, description, inputSchema) {
    this.name = name;
    this.description = description;
    this.inputSchema = inputSchema;
  }

  /**
   * Validate and execute tool
   */
  async execute(params) {
    try {
      // Validate parameters using Zod schema
      const validatedParams = await this.inputSchema.parseAsync(params);

      // Execute tool implementation
      const result = await this.run(validatedParams);

      return {
        success: true,
        tool: this.name,
        result
      };

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Type validation error
        return {
          success: false,
          tool: this.name,
          error: 'Validation failed',
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message,
            code: e.code
          }))
        };
      }

      // Runtime error
      return {
        success: false,
        tool: this.name,
        error: error.message,
        stack: error.stack
      };
    }
  }

  /**
   * Tool implementation - to be overridden by subclasses
   */
  async run(params) {
    throw new Error('Tool.run() must be implemented by subclass');
  }

  /**
   * Get tool definition for Claude SDK
   */
  getDefinition() {
    return {
      name: this.name,
      description: this.description,
      input_schema: this.zodToJsonSchema(this.inputSchema)
    };
  }

  /**
   * Convert Zod schema to JSON Schema for Claude
   */
  zodToJsonSchema(zodSchema) {
    // Simplified conversion - in production, use @anatine/zod-to-json-schema
    // For now, we'll use a basic manual conversion
    return {
      type: 'object',
      properties: {},
      required: []
    };
  }
}

// ============================================================================
// BMAD Custom Tools
// ============================================================================

/**
 * Validation Tool - Validates JSON against schema
 */
class ValidationTool extends ToolRunner {
  constructor() {
    super(
      'bmad_validate',
      'Validate JSON artifact against JSON Schema with auto-fix capability',
      z.object({
        schema_path: z.string().describe('Path to JSON Schema file'),
        artifact_path: z.string().describe('Path to JSON artifact to validate'),
        autofix: z.boolean().optional().default(false).describe('Attempt automatic fixes for common issues'),
        gate_path: z.string().optional().describe('Path to save validation gate record')
      })
    );
  }

  async run(params) {
    const { schema_path, artifact_path, autofix, gate_path } = params;

    // Build validation command
    const cmd = [
      'node',
      path.join(PROJECT_ROOT, '.claude/tools/gates/gate.mjs'),
      '--schema', schema_path,
      '--input', artifact_path
    ];

    if (autofix) {
      cmd.push('--autofix', '1');
    }

    if (gate_path) {
      cmd.push('--gate', gate_path);
    }

    try {
      const { stdout, stderr } = await execAsync(cmd.join(' '));

      return {
        validated: true,
        schema: schema_path,
        artifact: artifact_path,
        output: stdout,
        warnings: stderr || null
      };

    } catch (error) {
      return {
        validated: false,
        schema: schema_path,
        artifact: artifact_path,
        error: error.message,
        output: error.stdout,
        stderr: error.stderr
      };
    }
  }
}

/**
 * Rendering Tool - Renders JSON to Markdown
 */
class RenderingTool extends ToolRunner {
  constructor() {
    super(
      'bmad_render',
      'Render JSON artifact to human-readable Markdown using BMAD templates',
      z.object({
        template_type: z.enum([
          'project-brief',
          'prd',
          'architecture',
          'ux-spec',
          'test-plan'
        ]).describe('Type of artifact to render'),
        artifact_path: z.string().describe('Path to JSON artifact'),
        output_path: z.string().optional().describe('Path to save rendered Markdown')
      })
    );
  }

  async run(params) {
    const { template_type, artifact_path, output_path } = params;

    // Build rendering command
    const cmd = [
      'node',
      path.join(PROJECT_ROOT, '.claude/tools/renderers/bmad-render.mjs'),
      template_type,
      artifact_path
    ];

    try {
      const { stdout, stderr } = await execAsync(cmd.join(' '));

      // Save to file if output path provided
      if (output_path) {
        await fs.writeFile(output_path, stdout, 'utf-8');
      }

      return {
        rendered: true,
        template: template_type,
        artifact: artifact_path,
        output_path: output_path || null,
        markdown: stdout,
        warnings: stderr || null
      };

    } catch (error) {
      return {
        rendered: false,
        template: template_type,
        artifact: artifact_path,
        error: error.message,
        stderr: error.stderr
      };
    }
  }
}

/**
 * Quality Gate Tool - Check quality metrics and enforce thresholds
 */
class QualityGateTool extends ToolRunner {
  constructor() {
    super(
      'bmad_quality_gate',
      'Evaluate quality metrics and enforce quality thresholds',
      z.object({
        metrics: z.object({
          completeness: z.number().min(0).max(10).optional(),
          clarity: z.number().min(0).max(10).optional(),
          technical_feasibility: z.number().min(0).max(10).optional(),
          alignment: z.number().min(0).max(10).optional()
        }).describe('Quality metrics to evaluate'),
        threshold: z.number().min(0).max(10).default(7.0).describe('Minimum acceptable quality score'),
        agent: z.string().describe('Agent that produced the artifact'),
        step: z.number().describe('Workflow step number')
      })
    );
  }

  async run(params) {
    const { metrics, threshold, agent, step } = params;

    // Calculate overall quality score (weighted average)
    const scores = Object.values(metrics).filter(v => typeof v === 'number');
    const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    const passed = overallScore >= threshold;

    // Generate recommendations if quality is low
    const recommendations = [];
    if (!passed) {
      for (const [metric, score] of Object.entries(metrics)) {
        if (score < threshold) {
          recommendations.push({
            metric,
            current_score: score,
            target_score: threshold,
            gap: threshold - score,
            suggestion: this.getImprovementSuggestion(metric, score)
          });
        }
      }
    }

    return {
      passed,
      overall_score: overallScore,
      threshold,
      agent,
      step,
      metrics,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }

  getImprovementSuggestion(metric, score) {
    const suggestions = {
      completeness: 'Add missing sections and ensure all required fields are populated',
      clarity: 'Improve documentation clarity with specific examples and concrete details',
      technical_feasibility: 'Review technical decisions and ensure they are implementable',
      alignment: 'Verify consistency with previous agent outputs and business requirements'
    };

    return suggestions[metric] || 'Review and improve this metric';
  }
}

/**
 * Context Update Tool - Update workflow context bus
 */
class ContextUpdateTool extends ToolRunner {
  constructor() {
    super(
      'bmad_context_update',
      'Update workflow context with agent outputs and metadata',
      z.object({
        agent: z.string().describe('Agent name'),
        step: z.number().describe('Step number'),
        artifact_path: z.string().describe('Path to artifact JSON'),
        quality_score: z.number().min(0).max(10).optional().describe('Quality score'),
        metadata: z.record(z.any()).optional().describe('Additional metadata')
      })
    );
  }

  async run(params) {
    const { agent, step, artifact_path, quality_score, metadata } = params;

    // Build context update command
    const cmd = [
      'node',
      path.join(PROJECT_ROOT, '.claude/tools/context/update-session.mjs'),
      '--agent', agent,
      '--step', step.toString(),
      '--artifact', artifact_path
    ];

    if (quality_score !== undefined) {
      cmd.push('--quality', quality_score.toString());
    }

    if (metadata) {
      cmd.push('--metadata', JSON.stringify(metadata));
    }

    try {
      const { stdout, stderr } = await execAsync(cmd.join(' '));

      return {
        updated: true,
        agent,
        step,
        artifact: artifact_path,
        output: stdout,
        warnings: stderr || null
      };

    } catch (error) {
      return {
        updated: false,
        agent,
        step,
        error: error.message,
        stderr: error.stderr
      };
    }
  }
}

/**
 * Cost Tracking Tool - Track and report costs
 */
class CostTrackingTool extends ToolRunner {
  constructor() {
    super(
      'bmad_cost_track',
      'Track API costs by agent and generate cost reports',
      z.object({
        message_id: z.string().describe('Message ID for deduplication'),
        agent: z.string().describe('Agent name'),
        model: z.string().describe('Model used'),
        usage: z.object({
          input_tokens: z.number(),
          output_tokens: z.number(),
          cache_creation_tokens: z.number().optional(),
          cache_read_tokens: z.number().optional()
        }).describe('Token usage data')
      })
    );
  }

  async run(params) {
    const { message_id, agent, model, usage } = params;

    // This would integrate with the CostTracker class
    // For now, we'll return a simulated response

    // Calculate cost (simplified)
    const pricing = {
      'claude-sonnet-4-5': { input: 0.00003, output: 0.00015 },
      'claude-haiku-4': { input: 0.000001, output: 0.000005 },
      'claude-opus-4-1': { input: 0.00015, output: 0.00075 }
    };

    const modelPricing = pricing[model] || pricing['claude-sonnet-4-5'];
    const cost = (usage.input_tokens * modelPricing.input) +
                 (usage.output_tokens * modelPricing.output);

    return {
      tracked: true,
      message_id,
      agent,
      model,
      usage,
      cost_usd: cost,
      timestamp: new Date().toISOString()
    };
  }
}

// ============================================================================
// Tool Registry
// ============================================================================

/**
 * Registry of all BMAD tools
 */
class ToolRegistry {
  constructor() {
    this.tools = new Map();
    this.registerDefaultTools();
  }

  /**
   * Register default BMAD tools
   */
  registerDefaultTools() {
    this.register(new ValidationTool());
    this.register(new RenderingTool());
    this.register(new QualityGateTool());
    this.register(new ContextUpdateTool());
    this.register(new CostTrackingTool());
  }

  /**
   * Register a tool
   */
  register(tool) {
    if (!(tool instanceof ToolRunner)) {
      throw new Error('Tool must be an instance of ToolRunner');
    }
    this.tools.set(tool.name, tool);
  }

  /**
   * Get a tool by name
   */
  get(name) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }
    return tool;
  }

  /**
   * Execute a tool
   */
  async execute(name, params) {
    const tool = this.get(name);
    return await tool.execute(params);
  }

  /**
   * Get all tool definitions for Claude SDK
   */
  getDefinitions() {
    return Array.from(this.tools.values()).map(tool => tool.getDefinition());
  }

  /**
   * List all available tools
   */
  list() {
    return Array.from(this.tools.keys());
  }
}

// ============================================================================
// Export
// ============================================================================

// Create global registry instance
const globalRegistry = new ToolRegistry();

export {
  ToolRunner,
  ValidationTool,
  RenderingTool,
  QualityGateTool,
  ContextUpdateTool,
  CostTrackingTool,
  ToolRegistry,
  globalRegistry
};
