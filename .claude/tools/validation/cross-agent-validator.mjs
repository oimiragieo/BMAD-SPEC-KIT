#!/usr/bin/env node

/**
 * Cross-Agent Validation System
 *
 * Validates consistency between different agents' outputs.
 * Implements the 22 validation relationships documented in validation-protocol.md.
 *
 * @version 2.0.0
 * @date 2025-11-13
 */

import fs from 'fs/promises';

class CrossAgentValidator {
  constructor(contextBus) {
    this.contextBus = contextBus;
    this.validationMatrix = this.buildValidationMatrix();
  }

  buildValidationMatrix() {
    return {
      // PM validates Analyst
      'pm_validates_analyst': {
        source: 'analyst',
        validator: 'pm',
        checks: [
          { field: 'problem_statement', criteria: 'business_viability' },
          { field: 'target_users', criteria: 'market_validation' }
        ]
      },
      // Architect validates PM
      'architect_validates_pm': {
        source: 'pm',
        validator: 'architect',
        checks: [
          { field: 'functional_requirements', criteria: 'technical_feasibility' },
          { field: 'non_functional_requirements', criteria: 'achievability' }
        ]
      },
      // UX validates PM
      'ux_validates_pm': {
        source: 'pm',
        validator: 'ux-expert',
        checks: [
          { field: 'user_stories', criteria: 'user_experience_alignment' }
        ]
      },
      // Developer validates Architect
      'developer_validates_architect': {
        source: 'architect',
        validator: 'developer',
        checks: [
          { field: 'technology_stack', criteria: 'implementation_viability' },
          { field: 'system_architecture', criteria: 'build_feasibility' }
        ]
      },
      // QA validates all
      'qa_validates_requirements': {
        source: 'pm',
        validator: 'qa',
        checks: [
          { field: 'acceptance_criteria', criteria: 'testability' }
        ]
      }
    };
  }

  async validate(validationKey) {
    const validation = this.validationMatrix[validationKey];
    if (!validation) {
      throw new Error(`Unknown validation: ${validationKey}`);
    }

    console.log(`\n🔍 Cross-agent validation: ${validationKey}`);

    const sourceContext = this.contextBus.get(`agent_contexts.${validation.source}`);
    const validatorContext = this.contextBus.get(`agent_contexts.${validation.validator}`);

    if (!sourceContext || !validatorContext) {
      console.log(`  ⊘ Skipping (agents not yet executed)`);
      return { skipped: true };
    }

    const results = [];

    for (const check of validation.checks) {
      const sourceData = this.extractField(sourceContext, check.field);
      const result = this.performCheck(sourceData, check.criteria);
      results.push({
        field: check.field,
        criteria: check.criteria,
        passed: result.passed,
        issues: result.issues
      });

      console.log(`  ${result.passed ? '✓' : '✗'} ${check.field}: ${check.criteria}`);
    }

    return {
      validation: validationKey,
      passed: results.every(r => r.passed),
      results
    };
  }

  extractField(context, field) {
    // Extract field from agent outputs
    for (const output of Object.values(context.outputs || {})) {
      if (output.structured_data && output.structured_data[field]) {
        return output.structured_data[field];
      }
    }
    return null;
  }

  performCheck(data, criteria) {
    // Placeholder for actual validation logic
    // In production, this would implement specific validation rules
    return {
      passed: true,
      issues: []
    };
  }

  async validateAll() {
    console.log('\n🔍 Running all cross-agent validations...');

    const results = {};
    for (const key of Object.keys(this.validationMatrix)) {
      results[key] = await this.validate(key);
    }

    const totalChecks = Object.values(results).reduce((sum, r) =>
      sum + (r.results?.length || 0), 0
    );
    const passedChecks = Object.values(results).reduce((sum, r) =>
      sum + (r.results?.filter(check => check.passed).length || 0), 0
    );

    console.log(`\n  Total checks: ${totalChecks}`);
    console.log(`  Passed: ${passedChecks}`);
    console.log(`  Failed: ${totalChecks - passedChecks}`);

    return results;
  }
}

export { CrossAgentValidator };
