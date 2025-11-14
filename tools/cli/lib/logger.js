/**
 * Centralized Logging System for BMAD CLI
 * Provides structured logging with file output and verbosity control
 */

const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * Log levels (ordered by severity)
 */
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SILENT: 4,
};

/**
 * Logger class with file and console output
 */
class Logger {
  /**
   * Create a logger instance
   * @param {Object} options - Logger configuration
   */
  constructor(options = {}) {
    this.level = LogLevel[options.level?.toUpperCase()] ?? LogLevel.INFO;
    this.logDir = options.logDir || path.join(process.cwd(), '.bmad', 'logs');
    this.enableFile = options.enableFile ?? false;
    this.enableConsole = options.enableConsole ?? true;
    this.maxFileSize = options.maxFileSize || 5 * 1024 * 1024; // 5MB default
    this.logFile = path.join(this.logDir, `bmad-${this.getDateString()}.log`);

    if (this.enableFile) {
      this.initializeFileLogging();
    }
  }

  /**
   * Initialize file logging
   */
  initializeFileLogging() {
    try {
      fs.ensureDirSync(this.logDir);

      // Check if log rotation is needed
      if (fs.existsSync(this.logFile)) {
        const stats = fs.statSync(this.logFile);
        if (stats.size > this.maxFileSize) {
          this.rotateLog();
        }
      }
    } catch {
      // Fail silently for file logging issues
      this.enableFile = false;
    }
  }

  /**
   * Rotate log file
   */
  rotateLog() {
    const timestamp = new Date().toISOString().replaceAll(':', '-');
    const rotatedFile = path.join(this.logDir, `bmad-${timestamp}.log`);

    try {
      fs.renameSync(this.logFile, rotatedFile);

      // Keep only last 5 log files
      const logFiles = fs.readdirSync(this.logDir).filter((f) => f.startsWith('bmad-') && f.endsWith('.log'));

      if (logFiles.length > 5) {
        for (const f of logFiles.sort().slice(0, -5)) {
          try {
            fs.unlinkSync(path.join(this.logDir, f));
          } catch {
            // Ignore cleanup errors
          }
        }
      }
    } catch {
      // Ignore rotation errors
    }
  }

  /**
   * Get date string for log filename
   * @returns {string} Date string (YYYY-MM-DD)
   */
  getDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Format log entry
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   * @returns {string} Formatted log entry
   */
  formatLogEntry(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  /**
   * Write to log file
   * @param {string} entry - Log entry
   */
  writeToFile(entry) {
    if (!this.enableFile) return;

    try {
      fs.appendFileSync(this.logFile, entry + '\n');
    } catch {
      // Fail silently
    }
  }

  /**
   * Log a message
   * @param {string} level - Log level name
   * @param {string} message - Message
   * @param {Object} meta - Additional metadata
   */
  log(level, message, meta = {}) {
    const levelValue = LogLevel[level];

    if (levelValue < this.level) {
      return; // Below threshold
    }

    // File logging (always full details)
    this.writeToFile(this.formatLogEntry(level, message, meta));

    // Console logging (formatted)
    if (this.enableConsole) {
      this.logToConsole(level, message, meta);
    }
  }

  /**
   * Log to console with formatting
   * @param {string} level - Log level
   * @param {string} message - Message
   * @param {Object} meta - Metadata
   */
  logToConsole(level, message, meta) {
    let prefix = '';
    let colorFn = (s) => s;

    switch (level) {
      case 'DEBUG': {
        prefix = chalk.dim('🔍 DEBUG:');
        colorFn = chalk.dim;
        break;
      }
      case 'INFO': {
        prefix = chalk.blue('ℹ');
        colorFn = (s) => s;
        break;
      }
      case 'WARN': {
        prefix = chalk.yellow('⚠');
        colorFn = chalk.yellow;
        break;
      }
      case 'ERROR': {
        prefix = chalk.red('✗');
        colorFn = chalk.red;
        break;
      }
    }

    const output = `${prefix} ${colorFn(message)}`;
    console.log(output);

    // Log metadata if present and not silent
    if (Object.keys(meta).length > 0 && this.level === LogLevel.DEBUG) {
      console.log(chalk.dim('   ', JSON.stringify(meta, null, 2)));
    }
  }

  /**
   * Debug level logging
   * @param {string} message - Message
   * @param {Object} meta - Metadata
   */
  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  /**
   * Info level logging
   * @param {string} message - Message
   * @param {Object} meta - Metadata
   */
  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  /**
   * Warning level logging
   * @param {string} message - Message
   * @param {Object} meta - Metadata
   */
  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  /**
   * Error level logging
   * @param {string} message - Message
   * @param {Object} meta - Metadata
   */
  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  /**
   * Log with ora spinner - pauses spinner during log
   * @param {Object} spinner - Ora spinner instance
   * @param {string} level - Log level
   * @param {string} message - Message
   * @param {Object} meta - Metadata
   */
  spinnerLog(spinner, level, message, meta = {}) {
    if (spinner && spinner.isSpinning) {
      spinner.stop();
      this.log(level, message, meta);
      spinner.start();
    } else {
      this.log(level, message, meta);
    }
  }

  /**
   * Create a child logger with additional context
   * @param {Object} context - Context to add to all logs
   * @returns {Logger} Child logger
   */
  child(context) {
    const childLogger = Object.create(this);
    const originalLog = this.log.bind(this);

    childLogger.log = (level, message, meta = {}) => {
      originalLog(level, message, { ...context, ...meta });
    };

    return childLogger;
  }

  /**
   * Set log level dynamically
   * @param {string} level - New log level (debug, info, warn, error, silent)
   */
  setLevel(level) {
    const newLevel = LogLevel[level.toUpperCase()];
    if (newLevel !== undefined) {
      this.level = newLevel;
    }
  }
}

/**
 * Singleton logger instance
 */
let loggerInstance = null;

/**
 * Get or create logger instance
 * @param {Object} options - Logger options
 * @returns {Logger} Logger instance
 */
function getLogger(options = {}) {
  if (!loggerInstance) {
    loggerInstance = new Logger(options);
  }
  return loggerInstance;
}

/**
 * Configure logger
 * @param {Object} options - Logger options
 * @returns {Logger} Configured logger
 */
function configureLogger(options) {
  loggerInstance = new Logger(options);
  return loggerInstance;
}

module.exports = {
  Logger,
  getLogger,
  configureLogger,
  LogLevel,
};
