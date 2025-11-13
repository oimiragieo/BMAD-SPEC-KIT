/**
 * Enhanced Error Classes for BMAD CLI
 * Provides context-rich error handling with recovery suggestions
 */

class ErrorWithContext extends Error {
  /**
   * Create an error with additional context
   * @param {string} message - Error message
   * @param {Object} context - Additional context information
   */
  constructor(message, context = {}) {
    super(message);
    this.name = 'BMadError';
    this.context = context;
    this.timestamp = new Date().toISOString();
    this.recovery = context.recovery || null;
  }

  /**
   * Convert error to JSON for logging
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp,
      recovery: this.recovery,
      stack: this.stack,
    };
  }

  /**
   * Wrap an existing error with additional context
   * @param {Error} error - Original error
   * @param {Object} context - Additional context
   * @returns {ErrorWithContext} Wrapped error
   */
  static wrap(error, context = {}) {
    if (error instanceof ErrorWithContext) {
      return new ErrorWithContext(error.message, { ...error.context, ...context });
    }
    return new ErrorWithContext(error.message || String(error), { originalError: error, ...context });
  }

  /**
   * Format error for display to user
   * @returns {string} Formatted error message
   */
  format() {
    const chalk = require('chalk');
    let output = chalk.red(`✗ ${this.message}`);

    if (this.context.file) {
      output += chalk.dim(`\n  File: ${this.context.file}`);
    }

    if (this.context.line) {
      output += chalk.dim(`\n  Line: ${this.context.line}`);
    }

    if (this.recovery) {
      output += chalk.yellow(`\n\n💡 Suggestion: ${this.recovery}`);
    }

    return output;
  }
}

/**
 * Validation error - for schema/input validation failures
 */
class ValidationError extends ErrorWithContext {
  constructor(message, details = {}) {
    super(message, { ...details, type: 'validation' });
    this.name = 'ValidationError';

    if (!this.recovery && details.field) {
      this.recovery = `Check the '${details.field}' field in your configuration`;
    }
  }
}

/**
 * Configuration error - for config file/settings issues
 */
class ConfigurationError extends ErrorWithContext {
  constructor(message, details = {}) {
    super(message, { ...details, type: 'configuration' });
    this.name = 'ConfigurationError';

    if (!this.recovery) {
      this.recovery = 'Run "bmad status" to check your configuration or "bmad install" to reconfigure';
    }
  }
}

/**
 * Installation error - for installation process failures
 */
class InstallationError extends ErrorWithContext {
  constructor(message, details = {}) {
    super(message, { ...details, type: 'installation' });
    this.name = 'InstallationError';

    if (!this.recovery) {
      this.recovery = 'Try running "bmad install --full" to perform a complete reinstallation';
    }
  }
}

/**
 * Dependency error - for missing or invalid dependencies
 */
class DependencyError extends ErrorWithContext {
  constructor(message, details = {}) {
    super(message, { ...details, type: 'dependency' });
    this.name = 'DependencyError';

    if (!this.recovery && details.missing) {
      this.recovery = `The referenced file '${details.missing}' is required. Check your workflow or agent configuration.`;
    }
  }
}

/**
 * File operation error - for file I/O failures
 */
class FileOperationError extends ErrorWithContext {
  constructor(message, details = {}) {
    super(message, { ...details, type: 'file_operation' });
    this.name = 'FileOperationError';

    if (!this.recovery && details.path) {
      this.recovery = `Check if the path '${details.path}' exists and you have the necessary permissions`;
    }
  }
}

module.exports = {
  ErrorWithContext,
  ValidationError,
  ConfigurationError,
  InstallationError,
  DependencyError,
  FileOperationError,
};
