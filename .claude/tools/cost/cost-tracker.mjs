#!/usr/bin/env node

/**
 * Enterprise Cost Tracking System
 *
 * Implements Claude SDK cost tracking best practices:
 * - Message ID deduplication to prevent double-charging
 * - Per-agent cost tracking for workflow optimization
 * - Real-time usage monitoring and budget alerts
 * - Comprehensive cost reporting and analytics
 *
 * Based on: https://docs.claude.com/en/docs/agent-sdk/cost-tracking.md
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
// Pricing Constants (as of 2025-01-13)
// ============================================================================

const PRICING = {
  'claude-sonnet-4-5': {
    input_tokens: 0.00003,        // $3 per MTok
    output_tokens: 0.00015,       // $15 per MTok
    cache_read_tokens: 0.0000075  // $0.75 per MTok
  },
  'claude-opus-4-1': {
    input_tokens: 0.00015,        // $15 per MTok
    output_tokens: 0.00075,       // $75 per MTok
    cache_read_tokens: 0.0000375  // $3.75 per MTok
  },
  'claude-haiku-4': {
    input_tokens: 0.000001,       // $0.10 per MTok
    output_tokens: 0.000005,      // $0.50 per MTok
    cache_read_tokens: 0.0000005  // $0.05 per MTok
  }
};

// ============================================================================
// Cost Tracker Class
// ============================================================================

class CostTracker {
  constructor(sessionId, options = {}) {
    this.sessionId = sessionId;
    this.options = {
      enableAlerts: options.enableAlerts !== false,
      budgetLimit: options.budgetLimit || null,
      alertThreshold: options.alertThreshold || 0.80, // Alert at 80% of budget
      savePath: options.savePath || path.join(PROJECT_ROOT, '.claude/context/history/costs'),
      ...options
    };

    // Track processed message IDs to prevent double-counting
    this.processedMessageIds = new Set();

    // Usage aggregation
    this.usage = {
      total: {
        input_tokens: 0,
        output_tokens: 0,
        cache_creation_tokens: 0,
        cache_read_tokens: 0,
        total_cost_usd: 0
      },
      by_agent: {},
      by_model: {},
      messages: []
    };

    // Budget alerts
    this.budgetAlerts = [];
  }

  /**
   * Process a message and track its usage
   * Implements message ID deduplication as per SDK docs
   */
  processMessage(message, agent = 'unknown', model = 'claude-sonnet-4-5') {
    // Skip if not an assistant message with usage data
    if (message.type !== 'assistant' || !message.usage) {
      return null;
    }

    // Deduplicate based on message ID
    if (this.processedMessageIds.has(message.id)) {
      console.log(`  ⊘ Skipping duplicate message: ${message.id}`);
      return null;
    }

    // Mark as processed
    this.processedMessageIds.add(message.id);

    const usage = message.usage;

    // Calculate cost
    const cost = this.calculateCost(usage, model);

    // Create usage record
    const record = {
      message_id: message.id,
      timestamp: new Date().toISOString(),
      agent,
      model,
      usage: {
        input_tokens: usage.input_tokens || 0,
        output_tokens: usage.output_tokens || 0,
        cache_creation_tokens: usage.cache_creation_input_tokens || 0,
        cache_read_tokens: usage.cache_read_input_tokens || 0
      },
      cost_usd: cost,
      authoritative: message.total_cost_usd !== undefined
    };

    // Update total usage
    this.usage.total.input_tokens += record.usage.input_tokens;
    this.usage.total.output_tokens += record.usage.output_tokens;
    this.usage.total.cache_creation_tokens += record.usage.cache_creation_tokens;
    this.usage.total.cache_read_tokens += record.usage.cache_read_tokens;
    this.usage.total.total_cost_usd += cost;

    // Update per-agent usage
    if (!this.usage.by_agent[agent]) {
      this.usage.by_agent[agent] = {
        input_tokens: 0,
        output_tokens: 0,
        cache_read_tokens: 0,
        total_cost_usd: 0,
        message_count: 0
      };
    }
    this.usage.by_agent[agent].input_tokens += record.usage.input_tokens;
    this.usage.by_agent[agent].output_tokens += record.usage.output_tokens;
    this.usage.by_agent[agent].cache_read_tokens += record.usage.cache_read_tokens;
    this.usage.by_agent[agent].total_cost_usd += cost;
    this.usage.by_agent[agent].message_count++;

    // Update per-model usage
    if (!this.usage.by_model[model]) {
      this.usage.by_model[model] = {
        input_tokens: 0,
        output_tokens: 0,
        cache_read_tokens: 0,
        total_cost_usd: 0
      };
    }
    this.usage.by_model[model].input_tokens += record.usage.input_tokens;
    this.usage.by_model[model].output_tokens += record.usage.output_tokens;
    this.usage.by_model[model].cache_read_tokens += record.usage.cache_read_tokens;
    this.usage.by_model[model].total_cost_usd += cost;

    // Store record
    this.usage.messages.push(record);

    // Check budget
    if (this.options.enableAlerts) {
      this.checkBudget();
    }

    console.log(`  💰 Cost: $${cost.toFixed(6)} (${agent}, ${record.usage.output_tokens} tokens)`);

    return record;
  }

  /**
   * Calculate cost based on usage and model
   */
  calculateCost(usage, model) {
    const pricing = PRICING[model] || PRICING['claude-sonnet-4-5'];

    const inputCost = (usage.input_tokens || 0) * pricing.input_tokens;
    const outputCost = (usage.output_tokens || 0) * pricing.output_tokens;
    const cacheReadCost = (usage.cache_read_input_tokens || 0) * pricing.cache_read_tokens;

    return inputCost + outputCost + cacheReadCost;
  }

  /**
   * Check budget and emit alerts
   */
  checkBudget() {
    if (!this.options.budgetLimit) return;

    const currentCost = this.usage.total.total_cost_usd;
    const budgetUsed = currentCost / this.options.budgetLimit;

    if (budgetUsed >= 1.0 && !this.budgetAlerts.includes('exceeded')) {
      this.budgetAlerts.push('exceeded');
      console.error(`\n⚠️  BUDGET EXCEEDED: $${currentCost.toFixed(2)} / $${this.options.budgetLimit.toFixed(2)}`);
    } else if (budgetUsed >= this.options.alertThreshold && !this.budgetAlerts.includes('warning')) {
      this.budgetAlerts.push('warning');
      console.warn(`\n⚠️  Budget Warning: ${(budgetUsed * 100).toFixed(1)}% used ($${currentCost.toFixed(2)} / $${this.options.budgetLimit.toFixed(2)})`);
    }
  }

  /**
   * Get current usage summary
   */
  getSummary() {
    return {
      session_id: this.sessionId,
      total_cost_usd: this.usage.total.total_cost_usd,
      total_tokens: this.usage.total.input_tokens + this.usage.total.output_tokens,
      messages_processed: this.usage.messages.length,
      by_agent: this.usage.by_agent,
      by_model: this.usage.by_model,
      budget_status: this.options.budgetLimit ? {
        limit: this.options.budgetLimit,
        used: this.usage.total.total_cost_usd,
        percentage: (this.usage.total.total_cost_usd / this.options.budgetLimit) * 100,
        alerts: this.budgetAlerts
      } : null
    };
  }

  /**
   * Save cost report to file
   */
  async save() {
    const filePath = path.join(this.options.savePath, `${this.sessionId}.json`);

    const report = {
      session_id: this.sessionId,
      generated_at: new Date().toISOString(),
      total: this.usage.total,
      by_agent: this.usage.by_agent,
      by_model: this.usage.by_model,
      messages: this.usage.messages,
      budget: this.options.budgetLimit ? {
        limit: this.options.budgetLimit,
        used: this.usage.total.total_cost_usd,
        percentage: (this.usage.total.total_cost_usd / this.options.budgetLimit) * 100,
        alerts: this.budgetAlerts
      } : null
    };

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(report, null, 2));

    console.log(`  ✓ Cost report saved: ${filePath}`);

    return filePath;
  }

  /**
   * Generate cost report
   */
  generateReport() {
    const lines = [];

    lines.push('# Cost Report');
    lines.push('');
    lines.push(`**Session**: ${this.sessionId}`);
    lines.push(`**Generated**: ${new Date().toISOString()}`);
    lines.push('');

    lines.push('## Total Cost');
    lines.push('');
    lines.push(`- **Total**: $${this.usage.total.total_cost_usd.toFixed(4)}`);
    lines.push(`- **Input Tokens**: ${this.usage.total.input_tokens.toLocaleString()}`);
    lines.push(`- **Output Tokens**: ${this.usage.total.output_tokens.toLocaleString()}`);
    lines.push(`- **Cache Read Tokens**: ${this.usage.total.cache_read_tokens.toLocaleString()}`);
    lines.push(`- **Messages**: ${this.usage.messages.length}`);
    lines.push('');

    lines.push('## Cost by Agent');
    lines.push('');
    lines.push('| Agent | Messages | Input Tokens | Output Tokens | Cache Read | Cost |');
    lines.push('|-------|----------|--------------|---------------|------------|------|');

    for (const [agent, usage] of Object.entries(this.usage.by_agent)) {
      lines.push(`| ${agent} | ${usage.message_count} | ${usage.input_tokens.toLocaleString()} | ${usage.output_tokens.toLocaleString()} | ${usage.cache_read_tokens.toLocaleString()} | $${usage.total_cost_usd.toFixed(4)} |`);
    }

    lines.push('');

    lines.push('## Cost by Model');
    lines.push('');
    lines.push('| Model | Input Tokens | Output Tokens | Cache Read | Cost |');
    lines.push('|-------|--------------|---------------|------------|------|');

    for (const [model, usage] of Object.entries(this.usage.by_model)) {
      lines.push(`| ${model} | ${usage.input_tokens.toLocaleString()} | ${usage.output_tokens.toLocaleString()} | ${usage.cache_read_tokens.toLocaleString()} | $${usage.total_cost_usd.toFixed(4)} |`);
    }

    lines.push('');

    if (this.options.budgetLimit) {
      lines.push('## Budget Status');
      lines.push('');
      lines.push(`- **Limit**: $${this.options.budgetLimit.toFixed(2)}`);
      lines.push(`- **Used**: $${this.usage.total.total_cost_usd.toFixed(2)}`);
      lines.push(`- **Remaining**: $${(this.options.budgetLimit - this.usage.total.total_cost_usd).toFixed(2)}`);
      lines.push(`- **Percentage**: ${((this.usage.total.total_cost_usd / this.options.budgetLimit) * 100).toFixed(1)}%`);

      if (this.budgetAlerts.length > 0) {
        lines.push('');
        lines.push('**Alerts**:');
        for (const alert of this.budgetAlerts) {
          lines.push(`- ${alert}`);
        }
      }
    }

    return lines.join('\n');
  }

  /**
   * Get cost optimization recommendations
   */
  getOptimizationRecommendations() {
    const recommendations = [];

    // Check cache usage
    const cacheEfficiency = this.usage.total.cache_read_tokens /
                           (this.usage.total.input_tokens || 1);

    if (cacheEfficiency < 0.1) {
      recommendations.push({
        type: 'cache_optimization',
        priority: 'high',
        message: 'Low cache hit rate detected. Consider implementing prompt caching for repeated contexts.',
        potential_savings: this.usage.total.total_cost_usd * 0.25 // Estimate 25% savings
      });
    }

    // Check model selection
    const agentCosts = Object.entries(this.usage.by_agent)
      .sort((a, b) => b[1].total_cost_usd - a[1].total_cost_usd);

    for (const [agent, usage] of agentCosts) {
      const avgTokensPerMessage = usage.output_tokens / (usage.message_count || 1);

      if (avgTokensPerMessage < 500 && usage.total_cost_usd > 0.01) {
        recommendations.push({
          type: 'model_downgrade',
          priority: 'medium',
          agent,
          message: `Agent "${agent}" produces short outputs. Consider using Claude Haiku for cost savings.`,
          potential_savings: usage.total_cost_usd * 0.90 // Estimate 90% savings
        });
      }
    }

    return recommendations;
  }
}

// ============================================================================
// Billing Aggregator for Multi-Project Tracking
// ============================================================================

class BillingAggregator {
  constructor() {
    this.projects = new Map();
  }

  addSession(projectId, costTracker) {
    if (!this.projects.has(projectId)) {
      this.projects.set(projectId, []);
    }
    this.projects.get(projectId).push(costTracker);
  }

  getProjectCost(projectId) {
    const sessions = this.projects.get(projectId) || [];
    return sessions.reduce((total, tracker) =>
      total + tracker.usage.total.total_cost_usd, 0
    );
  }

  getAllProjectsCost() {
    const costs = {};
    for (const [projectId, sessions] of this.projects.entries()) {
      costs[projectId] = this.getProjectCost(projectId);
    }
    return costs;
  }
}

// ============================================================================
// Export
// ============================================================================

export { CostTracker, BillingAggregator, PRICING };
