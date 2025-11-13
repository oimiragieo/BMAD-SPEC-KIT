/**
 * Dependency Validator for BMAD
 * Validates that all workflow and agent references are valid
 */

const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('js-yaml');
const { glob } = require('glob');
const { DependencyError } = require('./errors');

class DependencyValidator {
  /**
   * Create a dependency validator
   * @param {string} projectDir - Project directory
   */
  constructor(projectDir) {
    this.projectDir = projectDir;
    this.errors = [];
    this.warnings = [];
    this.checked = { agents: 0, workflows: 0, references: 0 };
  }

  /**
   * Validate all agent dependencies
   * @param {string} agentPath - Path to agent YAML file
   */
  async validateAgent(agentPath) {
    try {
      const content = await fs.readFile(agentPath, 'utf8');
      const agentData = yaml.load(content);

      if (!agentData || !agentData.agent) {
        this.errors.push({
          file: agentPath,
          type: 'structure',
          message: 'Invalid agent structure - missing "agent" key',
        });
        return;
      }

      const agent = agentData.agent;
      this.checked.agents++;

      // Validate menu item references
      if (agent.menu && Array.isArray(agent.menu)) {
        for (const [index, item] of agent.menu.entries()) {
          await this.validateMenuItem(item, agentPath, index);
        }
      }

      // Validate critical actions references (if they reference files)
      if (agent.critical_actions && Array.isArray(agent.critical_actions)) {
        for (const action of agent.critical_actions) {
          await this.validateActionReferences(action, agentPath);
        }
      }

      // Validate knowledge base if present
      if (agent.knowledge_base) {
        await this.validatePath(agent.knowledge_base, agentPath, 'knowledge_base', item.trigger || 'knowledge_base');
      }
    } catch (error) {
      this.errors.push({
        file: agentPath,
        type: 'parse',
        message: `Failed to parse agent file: ${error.message}`,
      });
    }
  }

  /**
   * Validate a menu item's references
   * @param {Object} item - Menu item
   * @param {string} agentPath - Agent file path
   * @param {number} index - Menu item index
   */
  async validateMenuItem(item, agentPath, index) {
    const itemId = item.trigger || `item-${index}`;

    // Validate workflow reference
    if (item.workflow) {
      this.checked.references++;
      await this.validatePath(item.workflow, agentPath, 'workflow', itemId);
    }

    // Validate exec reference
    if (item.exec) {
      this.checked.references++;
      await this.validatePath(item.exec, agentPath, 'executable', itemId);
    }

    // Validate template reference
    if (item.tmpl) {
      this.checked.references++;
      await this.validatePath(item.tmpl, agentPath, 'template', itemId);
    }

    // Validate data reference
    if (item.data) {
      this.checked.references++;
      await this.validatePath(item.data, agentPath, 'data', itemId);
    }

    // Validate action reference (if it's a file path)
    if (item.action && item.action.includes('/')) {
      this.checked.references++;
      await this.validatePath(item.action, agentPath, 'action', itemId);
    }
  }

  /**
   * Validate action references in critical_actions
   * @param {string} action - Action string
   * @param {string} agentPath - Agent file path
   */
  async validateActionReferences(action, agentPath) {
    // Look for file path patterns in action strings
    // Common patterns: "Load from {path}", "Read {path}", "Execute {path}"
    const pathPattern = /(?:from|at|in)\s+([{][^}]+[}][^\s,]+|[^\s,]+\.(?:md|yaml|yml|json|js|csv))/gi;
    const matches = action.matchAll(pathPattern);

    for (const match of matches) {
      const pathRef = match[1];
      if (pathRef) {
        this.checked.references++;
        await this.validatePath(pathRef, agentPath, 'action-reference', 'critical_actions');
      }
    }
  }

  /**
   * Validate a path reference
   * @param {string} pathRef - Path reference (may contain placeholders)
   * @param {string} sourceFile - Source file containing the reference
   * @param {string} type - Type of reference
   * @param {string} context - Context (trigger/item identifier)
   */
  async validatePath(pathRef, sourceFile, type, context) {
    // Skip validation for runtime placeholders
    const runtimePlaceholders = ['{user_name}', '{output_folder}', '{communication_language}', '{date}', '{version}', '{config_source}'];

    if (runtimePlaceholders.some((p) => pathRef.includes(p))) {
      return; // Runtime-resolved, can't validate at install time
    }

    // Resolve known placeholders for validation
    let resolved = this.resolvePlaceholders(pathRef);

    // Check if path exists
    if (!(await fs.pathExists(resolved))) {
      // Check if it's a pattern/template path that might not exist yet
      if (this.isTemplateOrPattern(pathRef)) {
        this.warnings.push({
          file: sourceFile,
          type,
          context,
          reference: pathRef,
          resolved,
          message: `Template or pattern path may not exist yet: ${pathRef}`,
        });
      } else {
        this.errors.push({
          file: sourceFile,
          type,
          context,
          reference: pathRef,
          resolved,
          message: `Referenced ${type} not found: ${pathRef}`,
        });
      }
    }
  }

  /**
   * Resolve placeholders in path for validation
   * @param {string} pathRef - Path reference
   * @returns {string} Resolved path
   */
  resolvePlaceholders(pathRef) {
    // Try to detect the actual bmad folder
    let bmadFolder = 'bmad';
    const possibleBmadDirs = [path.join(this.projectDir, 'bmad'), path.join(this.projectDir, '.bmad')];

    for (const dir of possibleBmadDirs) {
      if (fs.existsSync(dir)) {
        bmadFolder = path.basename(dir);
        break;
      }
    }

    return pathRef.replaceAll('{project-root}', this.projectDir).replaceAll('{bmad_folder}', bmadFolder).replaceAll('{module}', ''); // Module is context-dependent, skip for now
  }

  /**
   * Check if path is a template or pattern
   * @param {string} pathRef - Path reference
   * @returns {boolean} True if template/pattern
   */
  isTemplateOrPattern(pathRef) {
    // Paths with {module} or other structural placeholders
    return pathRef.includes('{module}') || pathRef.includes('*') || pathRef.includes('[');
  }

  /**
   * Validate a workflow file
   * @param {string} workflowPath - Path to workflow.yaml
   */
  async validateWorkflow(workflowPath) {
    try {
      const content = await fs.readFile(workflowPath, 'utf8');
      const workflow = yaml.load(content);

      if (!workflow) {
        this.errors.push({
          file: workflowPath,
          type: 'structure',
          message: 'Invalid or empty workflow file',
        });
        return;
      }

      this.checked.workflows++;

      // Validate config_source
      if (workflow.config_source) {
        this.checked.references++;
        await this.validatePath(workflow.config_source, workflowPath, 'config', 'config_source');
      }

      // Validate instructions
      if (workflow.instructions) {
        this.checked.references++;
        await this.validatePath(workflow.instructions, workflowPath, 'instructions', 'instructions');
      }

      // Validate template
      if (workflow.template) {
        this.checked.references++;
        await this.validatePath(workflow.template, workflowPath, 'template', 'template');
      }

      // Validate installed_path (if not a placeholder)
      if (workflow.installed_path && !workflow.installed_path.includes('{')) {
        this.checked.references++;
        await this.validatePath(workflow.installed_path, workflowPath, 'installed_path', 'installed_path');
      }
    } catch (error) {
      this.errors.push({
        file: workflowPath,
        type: 'parse',
        message: `Failed to parse workflow file: ${error.message}`,
      });
    }
  }

  /**
   * Run full validation on a BMAD installation
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Object} Validation results
   */
  async validateAll(bmadDir) {
    this.errors = [];
    this.warnings = [];
    this.checked = { agents: 0, workflows: 0, references: 0 };

    // Find and validate all agents
    const agentFiles = await glob(path.join(bmadDir, '**', '*.agent.yaml').replaceAll('\\', '/'));

    for (const agentFile of agentFiles) {
      await this.validateAgent(agentFile);
    }

    // Find and validate all workflows
    const workflowFiles = await glob(path.join(bmadDir, '**', 'workflow.yaml').replaceAll('\\', '/'));

    for (const workflowFile of workflowFiles) {
      await this.validateWorkflow(workflowFile);
    }

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      stats: this.checked,
    };
  }

  /**
   * Format validation results for display
   * @param {Object} results - Validation results
   * @returns {string} Formatted output
   */
  formatResults(results) {
    const chalk = require('chalk');
    let output = '';

    output += chalk.bold('\n📋 Dependency Validation Results\n\n');

    output += chalk.dim(
      `Checked: ${results.stats.agents} agents, ${results.stats.workflows} workflows, ${results.stats.references} references\n\n`,
    );

    if (results.errors.length > 0) {
      output += chalk.red(`✗ ${results.errors.length} Error(s):\n\n`);
      for (const error of results.errors) {
        output += chalk.red(`  • ${error.message}\n`);
        output += chalk.dim(`    File: ${error.file}\n`);
        if (error.context) {
          output += chalk.dim(`    Context: ${error.context}\n`);
        }
        if (error.reference) {
          output += chalk.dim(`    Reference: ${error.reference}\n`);
        }
        output += '\n';
      }
    }

    if (results.warnings.length > 0) {
      output += chalk.yellow(`⚠ ${results.warnings.length} Warning(s):\n\n`);
      for (const warning of results.warnings) {
        output += chalk.yellow(`  • ${warning.message}\n`);
        output += chalk.dim(`    File: ${warning.file}\n`);
        output += '\n';
      }
    }

    if (results.success) {
      output += chalk.green('✓ All dependencies validated successfully!\n');
    } else {
      output += chalk.red(`\n✗ Validation failed with ${results.errors.length} error(s)\n`);
    }

    return output;
  }
}

module.exports = { DependencyValidator };
