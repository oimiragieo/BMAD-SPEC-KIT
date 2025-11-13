#!/usr/bin/env node

/**
 * Programmatic Agent Definitions
 *
 * Implements Claude SDK best practices for agent definitions:
 * - Programmatic agent configuration instead of file-based
 * - Tool restrictions by agent role for security and efficiency
 * - Smart model selection (haiku/sonnet/opus) based on task complexity
 * - Integration with workflow executor and Task tool
 *
 * Based on: https://docs.claude.com/en/docs/agent-sdk/subagents.md
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
// Tool Restriction Sets
// ============================================================================

/**
 * Tool restriction sets for different agent roles
 * Following principle of least privilege
 */
const TOOL_SETS = {
  // Research and analysis - read-only access
  READ_ONLY: [
    'Read',
    'Grep',
    'Glob',
    'WebFetch',
    'WebSearch'
  ],

  // Planning and documentation - read + write docs
  PLANNING: [
    'Read',
    'Grep',
    'Glob',
    'Write',
    'WebFetch',
    'WebSearch'
  ],

  // Testing and validation - read + execute
  TESTING: [
    'Read',
    'Grep',
    'Glob',
    'Bash',
    'WebFetch'
  ],

  // Code modification - full development tools
  DEVELOPMENT: [
    'Read',
    'Grep',
    'Glob',
    'Edit',
    'Write',
    'Bash',
    'WebFetch'
  ],

  // Design and UX - read + write + visual tools
  DESIGN: [
    'Read',
    'Grep',
    'Glob',
    'Write',
    'WebFetch',
    'WebSearch'
  ],

  // Orchestration - all tools for coordination
  ORCHESTRATION: [
    'Read',
    'Grep',
    'Glob',
    'Write',
    'Edit',
    'Bash',
    'Task',
    'WebFetch',
    'WebSearch',
    'TodoWrite'
  ]
};

// ============================================================================
// Model Selection Strategy
// ============================================================================

/**
 * Model selection based on agent role and task complexity
 *
 * Cost optimization:
 * - Haiku: $0.10/$0.50 per MTok (input/output) - 90% cheaper than Sonnet
 * - Sonnet: $3/$15 per MTok - balanced performance/cost
 * - Opus: $15/$75 per MTok - premium for critical tasks
 */
const MODEL_STRATEGY = {
  // Simple, routine tasks
  haiku: {
    agents: ['qa'],  // Test execution is routine
    use_case: 'Routine validation and testing with clear pass/fail criteria',
    cost_benefit: '90% cost reduction vs Sonnet'
  },

  // Complex analysis and implementation
  sonnet: {
    agents: ['analyst', 'pm', 'architect', 'developer', 'ux-expert'],
    use_case: 'Complex reasoning, design decisions, code implementation',
    cost_benefit: 'Optimal balance for enterprise workflows'
  },

  // Specialized critical work
  opus: {
    agents: ['bmad-orchestrator', 'bmad-master'],
    use_case: 'Strategic orchestration, quality assurance, critical decisions',
    cost_benefit: 'Premium quality for workflow coordination'
  }
};

/**
 * Get recommended model for an agent
 */
function getRecommendedModel(agentName) {
  for (const [model, config] of Object.entries(MODEL_STRATEGY)) {
    if (config.agents.includes(agentName)) {
      return `claude-${model}-4${model === 'sonnet' ? '-5' : model === 'opus' ? '-1' : ''}`;
    }
  }
  return 'claude-sonnet-4-5'; // Default
}

// ============================================================================
// Agent Definitions
// ============================================================================

/**
 * Base agent definition class
 */
class AgentDefinition {
  constructor(config) {
    this.name = config.name;
    this.title = config.title;
    this.description = config.description;
    this.icon = config.icon;
    this.systemPrompt = config.systemPrompt;
    this.tools = config.tools;
    this.model = config.model || getRecommendedModel(config.name);
    this.capabilities = config.capabilities || [];
    this.whenToUse = config.whenToUse || '';
  }

  /**
   * Load system prompt from file if not provided inline
   */
  async loadSystemPrompt() {
    if (this.systemPrompt) {
      return this.systemPrompt;
    }

    const promptPath = path.join(PROJECT_ROOT, `.claude/agents/${this.name}/prompt.md`);
    try {
      this.systemPrompt = await fs.readFile(promptPath, 'utf-8');
      return this.systemPrompt;
    } catch (error) {
      throw new Error(`Failed to load system prompt for agent ${this.name}: ${error.message}`);
    }
  }

  /**
   * Get agent configuration for Task tool
   */
  getTaskConfig() {
    return {
      subagent_type: this.name,
      description: this.description,
      model: this.model
    };
  }

  /**
   * Validate agent configuration
   */
  validate() {
    const errors = [];

    if (!this.name) errors.push('Agent name is required');
    if (!this.description) errors.push('Agent description is required');
    if (!this.tools || this.tools.length === 0) errors.push('Agent must have at least one tool');

    if (errors.length > 0) {
      throw new Error(`Agent validation failed for ${this.name}:\n${errors.join('\n')}`);
    }

    return true;
  }
}

// ============================================================================
// BMAD Agent Registry
// ============================================================================

/**
 * Programmatic agent definitions for BMAD-SPEC-KIT
 */
const AGENT_DEFINITIONS = {
  'analyst': new AgentDefinition({
    name: 'analyst',
    title: 'Business Analyst',
    icon: '📊',
    description: 'Market research, competitive analysis, requirements gathering, and project brief creation',
    tools: TOOL_SETS.READ_ONLY,
    model: 'claude-sonnet-4-5',
    capabilities: [
      'Market research and competitive landscape analysis',
      'Requirements elicitation and stakeholder analysis',
      'Business case development with ROI projections',
      'User journey mapping and persona development',
      'Risk assessment and mitigation strategies'
    ],
    whenToUse: 'Initial project discovery, market validation, competitive analysis, requirements documentation'
  }),

  'pm': new AgentDefinition({
    name: 'pm',
    title: 'Product Manager',
    icon: '📋',
    description: 'Product requirements definition, feature prioritization, and product roadmap creation',
    tools: TOOL_SETS.PLANNING,
    model: 'claude-sonnet-4-5',
    capabilities: [
      'Product requirements documentation (PRD)',
      'Feature prioritization with MoSCoW method',
      'User story creation with acceptance criteria',
      'Product roadmap and release planning',
      'Stakeholder communication and alignment'
    ],
    whenToUse: 'Defining product requirements, prioritizing features, creating user stories, planning releases'
  }),

  'architect': new AgentDefinition({
    name: 'architect',
    title: 'Software Architect',
    icon: '🏗️',
    description: 'System architecture design, technology selection, and technical planning',
    tools: TOOL_SETS.PLANNING,
    model: 'claude-sonnet-4-5',
    capabilities: [
      'System architecture design and documentation',
      'Technology stack selection with rationale',
      'Database schema design and optimization',
      'API design and integration planning',
      'Security architecture and compliance',
      'Performance and scalability planning'
    ],
    whenToUse: 'System design, architecture decisions, technical planning, technology evaluation'
  }),

  'developer': new AgentDefinition({
    name: 'developer',
    title: 'Full-Stack Developer',
    icon: '💻',
    description: 'Code implementation, testing, debugging, and technical documentation',
    tools: TOOL_SETS.DEVELOPMENT,
    model: 'claude-sonnet-4-5',
    capabilities: [
      'Frontend development (React, Vue, Angular)',
      'Backend development (Node.js, Python, Java)',
      'Database integration and optimization',
      'API development (REST, GraphQL)',
      'Testing (unit, integration, e2e)',
      'Security implementation and best practices'
    ],
    whenToUse: 'Code implementation, debugging, refactoring, technical documentation'
  }),

  'qa': new AgentDefinition({
    name: 'qa',
    title: 'QA Engineer',
    icon: '🧪',
    description: 'Test planning, test case creation, quality assurance, and validation',
    tools: TOOL_SETS.TESTING,
    model: 'claude-haiku-4',  // Routine testing tasks - cost optimized
    capabilities: [
      'Test plan creation with comprehensive coverage',
      'Test case development (Gherkin format)',
      'Automated testing (unit, integration, e2e)',
      'Performance and security testing',
      'Accessibility compliance (WCAG 2.1 AA)',
      'Bug tracking and quality metrics'
    ],
    whenToUse: 'Test planning, quality validation, bug identification, compliance testing'
  }),

  'ux-expert': new AgentDefinition({
    name: 'ux-expert',
    title: 'UX/UI Designer',
    icon: '🎨',
    description: 'User experience design, interface design, and design system creation',
    tools: TOOL_SETS.DESIGN,
    model: 'claude-sonnet-4-5',
    capabilities: [
      'User experience research and design',
      'Interface design and prototyping',
      'Design system creation (Tailwind CSS)',
      'Accessibility design (WCAG compliance)',
      'Mobile-first responsive design',
      'Interaction design and usability testing'
    ],
    whenToUse: 'UI/UX design, user flows, wireframes, design systems, accessibility design'
  }),

  'scrum-master': new AgentDefinition({
    name: 'scrum-master',
    title: 'Scrum Master',
    icon: '🏃',
    description: 'Agile facilitation, sprint planning, and team coordination',
    tools: TOOL_SETS.PLANNING,
    model: 'claude-sonnet-4-5',
    capabilities: [
      'Sprint planning and backlog management',
      'Agile ceremony facilitation',
      'Team velocity tracking and optimization',
      'Impediment removal and issue resolution',
      'Process improvement and retrospectives'
    ],
    whenToUse: 'Sprint planning, agile ceremonies, team coordination, process optimization'
  }),

  'product-owner': new AgentDefinition({
    name: 'product-owner',
    title: 'Product Owner',
    icon: '👔',
    description: 'Product vision, backlog prioritization, and stakeholder management',
    tools: TOOL_SETS.PLANNING,
    model: 'claude-sonnet-4-5',
    capabilities: [
      'Product vision and strategy definition',
      'Backlog creation and prioritization',
      'User story refinement and acceptance',
      'Stakeholder communication and alignment',
      'ROI analysis and business value assessment'
    ],
    whenToUse: 'Product strategy, backlog management, stakeholder communication, value definition'
  }),

  'bmad-orchestrator': new AgentDefinition({
    name: 'bmad-orchestrator',
    title: 'BMAD Orchestrator',
    icon: '🎯',
    description: 'Multi-agent workflow coordination, context management, and quality assurance',
    tools: TOOL_SETS.ORCHESTRATION,
    model: 'claude-opus-4-1',  // Premium for critical orchestration
    capabilities: [
      'Workflow execution and coordination',
      'Context management and state tracking',
      'Quality gate validation and enforcement',
      'Error recovery and fallback handling',
      'Performance optimization and monitoring'
    ],
    whenToUse: 'Workflow orchestration, multi-agent coordination, quality assurance'
  }),

  'bmad-master': new AgentDefinition({
    name: 'bmad-master',
    title: 'BMAD Master',
    icon: '🧙',
    description: 'Strategic guidance, pattern recognition, and system optimization',
    tools: TOOL_SETS.ORCHESTRATION,
    model: 'claude-opus-4-1',  // Premium for strategic decisions
    capabilities: [
      'Strategic pattern recognition and guidance',
      'System optimization and improvement',
      'Architecture review and recommendations',
      'Quality standards enforcement',
      'Best practice application and mentoring'
    ],
    whenToUse: 'Strategic decisions, system optimization, quality review, best practices'
  })
};

// ============================================================================
// Agent Registry API
// ============================================================================

/**
 * Get agent definition by name
 */
export function getAgentDefinition(agentName) {
  const agent = AGENT_DEFINITIONS[agentName];
  if (!agent) {
    throw new Error(`Unknown agent: ${agentName}. Available agents: ${Object.keys(AGENT_DEFINITIONS).join(', ')}`);
  }
  return agent;
}

/**
 * Get all agent definitions
 */
export function getAllAgents() {
  return AGENT_DEFINITIONS;
}

/**
 * Get agents by tool capability
 */
export function getAgentsByTool(toolName) {
  return Object.values(AGENT_DEFINITIONS).filter(agent =>
    agent.tools.includes(toolName)
  );
}

/**
 * Get agents by model
 */
export function getAgentsByModel(modelName) {
  return Object.values(AGENT_DEFINITIONS).filter(agent =>
    agent.model === modelName
  );
}

/**
 * Validate all agent definitions
 */
export function validateAllAgents() {
  const results = {
    valid: [],
    invalid: []
  };

  for (const [name, agent] of Object.entries(AGENT_DEFINITIONS)) {
    try {
      agent.validate();
      results.valid.push(name);
    } catch (error) {
      results.invalid.push({ name, error: error.message });
    }
  }

  return results;
}

/**
 * Get cost estimate for agent
 */
export function getAgentCostEstimate(agentName, inputTokens = 10000, outputTokens = 2000) {
  const agent = getAgentDefinition(agentName);

  const PRICING = {
    'claude-sonnet-4-5': {
      input: 0.00003,
      output: 0.00015
    },
    'claude-opus-4-1': {
      input: 0.00015,
      output: 0.00075
    },
    'claude-haiku-4': {
      input: 0.000001,
      output: 0.000005
    }
  };

  const pricing = PRICING[agent.model];
  if (!pricing) {
    throw new Error(`Unknown model pricing: ${agent.model}`);
  }

  const cost = (inputTokens * pricing.input) + (outputTokens * pricing.output);

  return {
    agent: agentName,
    model: agent.model,
    estimated_cost: cost,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    breakdown: {
      input_cost: inputTokens * pricing.input,
      output_cost: outputTokens * pricing.output
    }
  };
}

/**
 * Generate agent usage report
 */
export function generateAgentReport() {
  const report = {
    total_agents: Object.keys(AGENT_DEFINITIONS).length,
    by_model: {},
    by_tool_set: {},
    cost_optimization: {
      haiku_agents: [],
      sonnet_agents: [],
      opus_agents: []
    }
  };

  for (const [name, agent] of Object.entries(AGENT_DEFINITIONS)) {
    // Group by model
    if (!report.by_model[agent.model]) {
      report.by_model[agent.model] = [];
    }
    report.by_model[agent.model].push(name);

    // Group by cost tier
    if (agent.model.includes('haiku')) {
      report.cost_optimization.haiku_agents.push(name);
    } else if (agent.model.includes('sonnet')) {
      report.cost_optimization.sonnet_agents.push(name);
    } else if (agent.model.includes('opus')) {
      report.cost_optimization.opus_agents.push(name);
    }
  }

  return report;
}

// ============================================================================
// Export
// ============================================================================

export {
  AgentDefinition,
  TOOL_SETS,
  MODEL_STRATEGY,
  getRecommendedModel,
  AGENT_DEFINITIONS
};
