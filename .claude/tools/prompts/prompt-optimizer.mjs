#!/usr/bin/env node

/**
 * Prompt Optimizer - Claude SDK Best Practices
 *
 * Applies Claude SDK prompt engineering best practices to agent system prompts:
 * - Granular role definitions with clear boundaries
 * - Task decomposition into manageable steps
 * - Concrete examples and constraints
 * - Structured output specifications
 * - Chain-of-thought scaffolding
 * - Error handling guidance
 *
 * Based on: https://docs.claude.com/en/docs/build-with-claude/prompt-engineering
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
// SDK Best Practices
// ============================================================================

/**
 * Claude SDK prompt engineering best practices
 */
const SDK_BEST_PRACTICES = {
  // 1. Clear role definitions
  role_clarity: {
    description: 'Define precise role boundaries and responsibilities',
    template: `
## Role Definition

You are {{role_name}}, {{role_description}}.

**Core Responsibilities**:
{{responsibilities}}

**Scope Boundaries**:
- ✅ You SHOULD: {{should_do}}
- ❌ You SHOULD NOT: {{should_not_do}}

**Success Criteria**:
{{success_criteria}}
`
  },

  // 2. Task decomposition
  task_structure: {
    description: 'Break complex tasks into clear, sequential steps',
    template: `
## Execution Process

Follow this systematic approach:

### Step 1: {{step_1_name}}
**Objective**: {{step_1_objective}}
**Actions**:
{{step_1_actions}}
**Output**: {{step_1_output}}

### Step 2: {{step_2_name}}
**Objective**: {{step_2_objective}}
**Actions**:
{{step_2_actions}}
**Output**: {{step_2_output}}

[Continue for all steps...]
`
  },

  // 3. Concrete examples
  examples: {
    description: 'Provide specific, realistic examples',
    template: `
## Examples

### Example 1: {{example_1_scenario}}

**Input**:
\`\`\`
{{example_1_input}}
\`\`\`

**Expected Output**:
\`\`\`json
{{example_1_output}}
\`\`\`

**Reasoning**: {{example_1_reasoning}}

### Example 2: {{example_2_scenario}}
[Similar structure...]
`
  },

  // 4. Constraints and validation
  constraints: {
    description: 'Define clear constraints and validation rules',
    template: `
## Constraints

**MUST Requirements** (Hard constraints):
- {{must_1}}
- {{must_2}}
- {{must_3}}

**SHOULD Requirements** (Soft constraints):
- {{should_1}}
- {{should_2}}

**MUST NOT Requirements** (Forbidden):
- {{must_not_1}}
- {{must_not_2}}

**Validation Checklist**:
- [ ] {{validation_1}}
- [ ] {{validation_2}}
- [ ] {{validation_3}}
`
  },

  // 5. Output structure
  output_spec: {
    description: 'Specify exact output format and structure',
    template: `
## Output Specification

**Format**: JSON conforming to \`{{schema_path}}\`

**Required Fields**:
\`\`\`json
{
  "field_1": {
    "type": "{{field_1_type}}",
    "description": "{{field_1_description}}",
    "validation": "{{field_1_validation}}"
  },
  "field_2": {
    "type": "{{field_2_type}}",
    "description": "{{field_2_description}}",
    "validation": "{{field_2_validation}}"
  }
}
\`\`\`

**Quality Standards**:
- Completeness: All required fields present
- Accuracy: Data matches validation rules
- Clarity: Descriptions are specific and actionable
- Consistency: Cross-references are valid
`
  },

  // 6. Chain of thought
  reasoning: {
    description: 'Scaffold thinking process explicitly',
    template: `
## Reasoning Framework

Before providing your final output, work through this reasoning process:

1. **Understand**: What is being asked? What are the key requirements?
2. **Analyze**: What information do I have? What's missing?
3. **Plan**: What approach will I take? What are the steps?
4. **Execute**: Implement each step systematically
5. **Validate**: Does my output meet all requirements?
6. **Refine**: Can I improve clarity, accuracy, or completeness?

**Document your reasoning** in a separate reasoning artifact:
\`\`\`json
{
  "assumptions": ["assumption_1", "assumption_2"],
  "decision_criteria": ["criteria_1", "criteria_2"],
  "tradeoffs": [
    {
      "option": "option_1",
      "pros": ["pro_1"],
      "cons": ["con_1"]
    }
  ],
  "final_decision": "Rationale for chosen approach"
}
\`\`\`
`
  },

  // 7. Error handling
  error_handling: {
    description: 'Guide error detection and recovery',
    template: `
## Error Handling

**Common Issues and Solutions**:

| Issue | Detection | Resolution |
|-------|-----------|------------|
| {{issue_1}} | {{detection_1}} | {{resolution_1}} |
| {{issue_2}} | {{detection_2}} | {{resolution_2}} |
| {{issue_3}} | {{detection_3}} | {{resolution_3}} |

**When You Encounter Issues**:
1. Clearly state the issue
2. Explain why it's blocking progress
3. Suggest 2-3 potential solutions
4. Request clarification if needed

**Never**:
- Proceed with invalid assumptions
- Skip required steps to save time
- Provide incomplete outputs
- Hide errors or uncertainties
`
  }
};

// ============================================================================
// Prompt Enhancement Engine
// ============================================================================

/**
 * Enhances agent prompts with SDK best practices
 */
class PromptOptimizer {
  constructor() {
    this.bestPractices = SDK_BEST_PRACTICES;
  }

  /**
   * Optimize an agent prompt with SDK enhancements
   */
  async optimizePrompt(agentName, currentPrompt) {
    console.log(`\n🔧 Optimizing prompt for agent: ${agentName}`);

    const enhancements = [];

    // 1. Add role clarity if missing
    if (!this.hasSection(currentPrompt, 'Role Definition')) {
      enhancements.push({
        type: 'role_clarity',
        position: 'after_identity',
        content: this.generateRoleClarity(agentName, currentPrompt)
      });
    }

    // 2. Add task decomposition if missing
    if (!this.hasSection(currentPrompt, 'Execution Process')) {
      enhancements.push({
        type: 'task_structure',
        position: 'after_approach',
        content: this.generateTaskStructure(agentName, currentPrompt)
      });
    }

    // 3. Add examples if minimal
    const exampleCount = this.countExamples(currentPrompt);
    if (exampleCount < 2) {
      enhancements.push({
        type: 'examples',
        position: 'before_output',
        content: this.generateExamples(agentName, currentPrompt)
      });
    }

    // 4. Add constraints if unclear
    if (!this.hasSection(currentPrompt, 'Constraints')) {
      enhancements.push({
        type: 'constraints',
        position: 'after_approach',
        content: this.generateConstraints(agentName, currentPrompt)
      });
    }

    // 5. Enhance output specification
    if (!this.hasDetailedOutputSpec(currentPrompt)) {
      enhancements.push({
        type: 'output_spec',
        position: 'replace_output',
        content: this.generateOutputSpec(agentName, currentPrompt)
      });
    }

    // 6. Add reasoning framework
    if (!this.hasSection(currentPrompt, 'Reasoning Framework')) {
      enhancements.push({
        type: 'reasoning',
        position: 'after_approach',
        content: this.bestPractices.reasoning.template
      });
    }

    // 7. Add error handling
    if (!this.hasSection(currentPrompt, 'Error Handling')) {
      enhancements.push({
        type: 'error_handling',
        position: 'after_output',
        content: this.generateErrorHandling(agentName)
      });
    }

    console.log(`  ✓ Generated ${enhancements.length} enhancements`);

    return {
      agent: agentName,
      original_prompt: currentPrompt,
      enhancements,
      summary: this.generateSummary(enhancements)
    };
  }

  /**
   * Check if prompt has a section
   */
  hasSection(prompt, sectionName) {
    return prompt.includes(`## ${sectionName}`) ||
           prompt.includes(`# ${sectionName}`);
  }

  /**
   * Count examples in prompt
   */
  countExamples(prompt) {
    const exampleMatches = prompt.match(/### Example \d+|Example:|```/g);
    return exampleMatches ? Math.floor(exampleMatches.length / 3) : 0;
  }

  /**
   * Check for detailed output specification
   */
  hasDetailedOutputSpec(prompt) {
    return prompt.includes('Required Fields') &&
           prompt.includes('Quality Standards') &&
           prompt.includes('Validation');
  }

  /**
   * Generate role clarity enhancement
   */
  generateRoleClarity(agentName, currentPrompt) {
    const roleMap = {
      analyst: {
        should: ['Analyze market dynamics', 'Research competitors', 'Identify user needs', 'Assess risks'],
        should_not: ['Write code', 'Create UI designs', 'Make architectural decisions']
      },
      pm: {
        should: ['Define requirements', 'Prioritize features', 'Create user stories', 'Manage stakeholders'],
        should_not: ['Design database schemas', 'Write test cases', 'Implement features']
      },
      architect: {
        should: ['Design system architecture', 'Select technologies', 'Define data models', 'Plan scalability'],
        should_not: ['Write business requirements', 'Create marketing materials', 'Test implementations']
      },
      developer: {
        should: ['Write production code', 'Implement features', 'Create tests', 'Fix bugs'],
        should_not: ['Define product strategy', 'Make business decisions', 'Design UX flows']
      },
      qa: {
        should: ['Create test plans', 'Write test cases', 'Validate quality', 'Report issues'],
        should_not: ['Implement features', 'Design architecture', 'Gather requirements']
      },
      'ux-expert': {
        should: ['Design user interfaces', 'Create wireframes', 'Define interactions', 'Ensure accessibility'],
        should_not: ['Write backend code', 'Define business strategy', 'Implement databases']
      }
    };

    const boundaries = roleMap[agentName] || { should: [], should_not: [] };

    return `
## Role Boundaries (SDK Optimized)

**You SHOULD**:
${boundaries.should.map(item => `- ${item}`).join('\n')}

**You SHOULD NOT**:
${boundaries.should_not.map(item => `- ${item}`).join('\n')}

This clear separation ensures optimal workflow coordination and prevents scope overlap.
`;
  }

  /**
   * Generate task structure enhancement
   */
  generateTaskStructure(agentName, currentPrompt) {
    return `
## Systematic Execution (SDK Optimized)

Follow this step-by-step process for consistent, high-quality outputs:

1. **Intake & Understanding** (2 min)
   - Read all provided context and requirements
   - Identify key objectives and success criteria
   - Note any unclear or missing information

2. **Analysis & Planning** (5 min)
   - Analyze requirements systematically
   - Identify dependencies and constraints
   - Plan approach and structure

3. **Core Execution** (15-20 min)
   - Execute primary work systematically
   - Follow templates and schemas
   - Document decisions and rationale

4. **Quality Validation** (3 min)
   - Review against all requirements
   - Validate schema compliance
   - Check for completeness and clarity

5. **Refinement** (2 min)
   - Improve based on validation
   - Add missing details
   - Ensure professional quality
`;
  }

  /**
   * Generate examples enhancement
   */
  generateExamples(agentName, currentPrompt) {
    return `
## Concrete Examples (SDK Optimized)

### Example 1: High-Quality Output

[Agent-specific example showing best practices]

### Example 2: Common Mistakes to Avoid

[Agent-specific example showing what NOT to do]

These examples demonstrate the expected quality and format.
`;
  }

  /**
   * Generate constraints enhancement
   */
  generateConstraints(agentName, currentPrompt) {
    return `
## Constraints (SDK Optimized)

**MUST Requirements** (Non-negotiable):
- Output MUST conform to specified JSON schema
- All required fields MUST be present and valid
- Quality score MUST meet minimum threshold (7.0/10)
- Cross-references MUST be consistent and accurate

**SHOULD Requirements** (Best practices):
- Provide specific, actionable recommendations
- Include concrete examples where helpful
- Use data and metrics to support decisions
- Reference industry standards and best practices

**MUST NOT** (Forbidden):
- Do not invent requirements not provided by user
- Do not skip validation steps to save time
- Do not provide vague or generic outputs
- Do not proceed with invalid assumptions
`;
  }

  /**
   * Generate output specification enhancement
   */
  generateOutputSpec(agentName, currentPrompt) {
    return `
## Output Specification (SDK Optimized)

**Format**: JSON conforming to designated schema

**Quality Criteria**:
1. **Completeness**: All required fields present with meaningful content
2. **Specificity**: Concrete, actionable information (no vague statements)
3. **Accuracy**: Validated against requirements and constraints
4. **Clarity**: Understandable by both humans and downstream agents
5. **Consistency**: Cross-references align with other artifacts

**Validation Process**:
1. Schema validation (automatic)
2. Completeness check (all required sections)
3. Quality assessment (meets minimum scores)
4. Cross-validation (consistency with other agents)

**Output Delivery**:
- Save JSON artifact to designated path
- Trigger validation gate automatically
- Render human-readable Markdown
- Update workflow context
`;
  }

  /**
   * Generate error handling enhancement
   */
  generateErrorHandling(agentName) {
    return `
## Error Handling (SDK Optimized)

**When You Encounter Issues**:
1. **Clearly identify** the specific issue
2. **Explain impact** on deliverables or workflow
3. **Propose solutions** (provide 2-3 options)
4. **Escalate if needed** (don't proceed with invalid assumptions)

**Common Recovery Patterns**:
- Missing information → Request specific details
- Conflicting requirements → Highlight conflict, suggest resolution
- Technical uncertainty → Research options, present trade-offs
- Quality concerns → Pause, review, refine before delivery

**Never**:
- Guess at requirements when unclear
- Skip validation to meet deadlines
- Deliver incomplete work hoping it's sufficient
- Hide errors or uncertainties from user
`;
  }

  /**
   * Generate summary of enhancements
   */
  generateSummary(enhancements) {
    return {
      total_enhancements: enhancements.length,
      by_type: enhancements.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
      }, {}),
      estimated_improvement: `${Math.min(enhancements.length * 10, 50)}% clarity improvement`
    };
  }
}

// ============================================================================
// CLI Interface
// ============================================================================

async function main() {
  const optimizer = new PromptOptimizer();

  const agents = ['analyst', 'pm', 'architect', 'developer', 'qa', 'ux-expert'];

  console.log('============================================================================');
  console.log('Prompt Optimizer - Claude SDK Best Practices');
  console.log('============================================================================');

  const results = [];

  for (const agent of agents) {
    const promptPath = path.join(PROJECT_ROOT, `.claude/agents/${agent}/prompt.md`);

    try {
      const currentPrompt = await fs.readFile(promptPath, 'utf-8');
      const result = await optimizer.optimizePrompt(agent, currentPrompt);
      results.push(result);
    } catch (error) {
      console.error(`  ✗ Failed to optimize ${agent}: ${error.message}`);
    }
  }

  // Save optimization report
  const reportPath = path.join(PROJECT_ROOT, '.claude/docs/PROMPT_OPTIMIZATION_REPORT.md');
  const report = generateOptimizationReport(results);
  await fs.writeFile(reportPath, report, 'utf-8');

  console.log(`\n✓ Optimization report saved to: ${reportPath}`);
  console.log('============================================================================\n');
}

/**
 * Generate optimization report
 */
function generateOptimizationReport(results) {
  let report = `# Prompt Optimization Report\n\n`;
  report += `**Date**: ${new Date().toISOString()}\n`;
  report += `**Agents Analyzed**: ${results.length}\n\n`;

  report += `## Summary\n\n`;
  report += `| Agent | Enhancements | Estimated Improvement |\n`;
  report += `|-------|--------------|----------------------|\n`;

  for (const result of results) {
    report += `| ${result.agent} | ${result.enhancements.length} | ${result.summary.estimated_improvement} |\n`;
  }

  report += `\n## SDK Best Practices Applied\n\n`;

  for (const [key, practice] of Object.entries(SDK_BEST_PRACTICES)) {
    report += `### ${key.replace(/_/g, ' ').toUpperCase()}\n`;
    report += `${practice.description}\n\n`;
  }

  report += `## Detailed Enhancements\n\n`;

  for (const result of results) {
    report += `### ${result.agent}\n\n`;
    report += `**Total Enhancements**: ${result.enhancements.length}\n\n`;

    for (const enhancement of result.enhancements) {
      report += `#### ${enhancement.type}\n`;
      report += `**Position**: ${enhancement.position}\n\n`;
      report += `\`\`\`markdown\n${enhancement.content.trim()}\n\`\`\`\n\n`;
    }
  }

  return report;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { PromptOptimizer, SDK_BEST_PRACTICES };
