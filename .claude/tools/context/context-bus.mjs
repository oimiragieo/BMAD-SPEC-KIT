#!/usr/bin/env node

/**
 * Context Bus - In-Memory Context Management with Schema Validation
 *
 * Replaces file-based context with structured data store featuring:
 * - Type-safe context access and updates
 * - Automatic validation against schemas
 * - Reactive updates (pub/sub pattern)
 * - Transaction semantics with rollback
 * - Context snapshots for debugging
 * - Cross-agent data propagation
 *
 * @version 2.0.0
 * @date 2025-11-13
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

// ============================================================================
// Context Bus Implementation
// ============================================================================

class ContextBus {
  constructor(sessionSchema) {
    // Core state
    this.context = {};
    this.schema = sessionSchema;
    this.subscribers = new Map(); // path → Set<callback>
    this.history = []; // For time-travel debugging
    this.checkpoints = []; // For rollback
    this.validationCache = new Map(); // Memoize validation results

    // Setup validator
    this.ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(this.ajv);

    // Initialize context from schema
    if (sessionSchema) {
      this.context = this.initializeFromSchema(sessionSchema);
    }
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================

  /**
   * Initialize context structure from JSON schema
   */
  initializeFromSchema(schema) {
    const context = {};

    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (propSchema.default !== undefined) {
          context[key] = propSchema.default;
        } else if (propSchema.type === 'object') {
          context[key] = this.initializeFromSchema(propSchema);
        } else if (propSchema.type === 'array') {
          context[key] = [];
        } else if (propSchema.type === 'string') {
          context[key] = '';
        } else if (propSchema.type === 'number' || propSchema.type === 'integer') {
          context[key] = 0;
        } else if (propSchema.type === 'boolean') {
          context[key] = false;
        }
      }
    }

    return context;
  }

  /**
   * Load context from file (for migration from file-based system)
   */
  async loadFromFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      this.context = data;
      this.recordHistory('load_from_file', null, null, data);
      return this.context;
    } catch (error) {
      throw new Error(`Failed to load context from file: ${error.message}`);
    }
  }

  /**
   * Save context to file (for persistence)
   */
  async saveToFile(filePath) {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(this.context, null, 2), 'utf-8');
      return true;
    } catch (error) {
      throw new Error(`Failed to save context to file: ${error.message}`);
    }
  }

  // ==========================================================================
  // Context Access (Type-Safe)
  // ==========================================================================

  /**
   * Get value at path using dot notation
   * Example: get('agent_contexts.analyst.outputs.project_brief')
   */
  get(path) {
    if (!path) return this.context;

    const parts = path.split('.');
    let value = this.context;

    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[part];
    }

    return value;
  }

  /**
   * Set value at path with validation
   * Example: set('agent_contexts.analyst.status', 'completed', statusSchema)
   */
  set(path, value, schema = null) {
    // Validate if schema provided
    if (schema) {
      const isValid = this.validate(value, schema);
      if (!isValid) {
        const errors = this.ajv.errors;
        throw new ContextValidationError(path, value, schema, errors);
      }
    }

    // Get old value for change notification
    const oldValue = this.get(path);

    // Update value
    const parts = path.split('.');
    let current = this.context;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;

    // Record history
    this.recordHistory('set', path, oldValue, value);

    // Notify subscribers
    this.notifySubscribers(path, value, oldValue);

    return value;
  }

  /**
   * Update object at path (merge with existing)
   */
  update(path, updates, schema = null) {
    const existing = this.get(path) || {};

    if (typeof existing !== 'object' || Array.isArray(existing)) {
      throw new Error(`Cannot update non-object at path: ${path}`);
    }

    const merged = { ...existing, ...updates };
    return this.set(path, merged, schema);
  }

  /**
   * Push item to array at path
   */
  push(path, item) {
    const array = this.get(path);

    if (!Array.isArray(array)) {
      throw new Error(`Cannot push to non-array at path: ${path}`);
    }

    array.push(item);
    this.recordHistory('push', path, null, item);
    this.notifySubscribers(path, array, array);

    return array;
  }

  /**
   * Delete value at path
   */
  delete(path) {
    const parts = path.split('.');
    let current = this.context;

    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
      if (!current) return false;
    }

    const lastPart = parts[parts.length - 1];
    const oldValue = current[lastPart];
    delete current[lastPart];

    this.recordHistory('delete', path, oldValue, undefined);
    this.notifySubscribers(path, undefined, oldValue);

    return true;
  }

  // ==========================================================================
  // Validation
  // ==========================================================================

  /**
   * Validate value against schema
   */
  validate(value, schema) {
    // Check cache
    const cacheKey = JSON.stringify({ value, schema });
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey);
    }

    // Perform validation
    const validate = this.ajv.compile(schema);
    const isValid = validate(value);

    // Cache result
    this.validationCache.set(cacheKey, isValid);

    return isValid;
  }

  /**
   * Get validation errors
   */
  getValidationErrors() {
    return this.ajv.errors || [];
  }

  // ==========================================================================
  // Cross-Agent Data Propagation
  // ==========================================================================

  /**
   * Propagate data from one agent to another
   * Example: propagate('analyst', 'pm', { 'outputs.project_brief': 'inputs.project_brief' })
   */
  propagate(sourceAgent, targetAgent, mapping) {
    const propagated = {};

    for (const [sourcePath, targetPath] of Object.entries(mapping)) {
      const fullSourcePath = `agent_contexts.${sourceAgent}.${sourcePath}`;
      const fullTargetPath = `agent_contexts.${targetAgent}.${targetPath}`;

      const sourceData = this.get(fullSourcePath);

      if (sourceData !== undefined) {
        this.set(fullTargetPath, sourceData);
        propagated[targetPath] = sourceData;
      }
    }

    this.recordHistory('propagate', `${sourceAgent} → ${targetAgent}`, null, propagated);

    return propagated;
  }

  /**
   * Auto-propagate based on workflow dependencies
   */
  autopropagate(workflowConfig, completedAgent) {
    const propagations = workflowConfig.propagations || [];

    for (const rule of propagations) {
      if (rule.source === completedAgent) {
        this.propagate(rule.source, rule.target, rule.mapping);
      }
    }
  }

  // ==========================================================================
  // Reactive Updates (Pub/Sub)
  // ==========================================================================

  /**
   * Subscribe to changes at path
   */
  subscribe(path, callback) {
    if (!this.subscribers.has(path)) {
      this.subscribers.set(path, new Set());
    }
    this.subscribers.get(path).add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(path);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  /**
   * Notify subscribers of change
   */
  notifySubscribers(path, newValue, oldValue) {
    // Notify exact path subscribers
    const exactSubscribers = this.subscribers.get(path);
    if (exactSubscribers) {
      for (const callback of exactSubscribers) {
        callback(newValue, oldValue, path);
      }
    }

    // Notify wildcard subscribers (path.*)
    for (const [subscribedPath, callbacks] of this.subscribers.entries()) {
      if (subscribedPath.endsWith('.*') && path.startsWith(subscribedPath.slice(0, -2))) {
        for (const callback of callbacks) {
          callback(newValue, oldValue, path);
        }
      }
    }
  }

  // ==========================================================================
  // Transactions & Checkpoints
  // ==========================================================================

  /**
   * Create checkpoint for rollback
   */
  checkpoint(label = null) {
    const id = `checkpoint-${Date.now()}`;
    const snapshot = JSON.parse(JSON.stringify(this.context));

    this.checkpoints.push({
      id,
      label,
      timestamp: new Date().toISOString(),
      context: snapshot
    });

    return id;
  }

  /**
   * Restore from checkpoint
   */
  restore(checkpointId) {
    const checkpoint = this.checkpoints.find(cp => cp.id === checkpointId);

    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    const oldContext = this.context;
    this.context = checkpoint.context;

    this.recordHistory('restore', checkpointId, oldContext, this.context);
    this.notifySubscribers('', this.context, oldContext);

    return this.context;
  }

  /**
   * List all checkpoints
   */
  listCheckpoints() {
    return this.checkpoints.map(cp => ({
      id: cp.id,
      label: cp.label,
      timestamp: cp.timestamp
    }));
  }

  // ==========================================================================
  // History & Debugging
  // ==========================================================================

  /**
   * Record change in history
   */
  recordHistory(operation, path, oldValue, newValue) {
    this.history.push({
      timestamp: new Date().toISOString(),
      operation,
      path,
      oldValue,
      newValue
    });

    // Limit history size
    if (this.history.length > 1000) {
      this.history.shift();
    }
  }

  /**
   * Get change history
   */
  getHistory(filter = null) {
    if (!filter) return this.history;

    return this.history.filter(entry => {
      if (filter.operation && entry.operation !== filter.operation) return false;
      if (filter.path && !entry.path.includes(filter.path)) return false;
      if (filter.since && new Date(entry.timestamp) < new Date(filter.since)) return false;
      return true;
    });
  }

  /**
   * Export context for debugging
   */
  export() {
    return {
      context: this.context,
      history: this.history,
      checkpoints: this.listCheckpoints(),
      subscribers: Array.from(this.subscribers.keys())
    };
  }
}

// ============================================================================
// Custom Errors
// ============================================================================

class ContextValidationError extends Error {
  constructor(path, value, schema, errors) {
    super(`Validation failed for path: ${path}`);
    this.name = 'ContextValidationError';
    this.path = path;
    this.value = value;
    this.schema = schema;
    this.errors = errors;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create new context bus instance
 */
async function createContextBus(schemaPath = null) {
  let schema = null;

  if (schemaPath) {
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');
    schema = JSON.parse(schemaContent);
  }

  return new ContextBus(schema);
}

// ============================================================================
// CLI Entry Point (for testing)
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
Context Bus - In-Memory Context Management

Usage:
  node context-bus.mjs --schema <schema.json> --input <context.json> --operation <op>

Operations:
  get <path>                 Get value at path
  set <path> <value>         Set value at path
  checkpoint <label>         Create checkpoint
  restore <id>               Restore from checkpoint
  history                    Show change history
  export                     Export full context state
    `);
    process.exit(0);
  }

  // Example usage
  const schemaPath = path.join(PROJECT_ROOT, '.claude/schemas/context_state.schema.json');
  const bus = await createContextBus(schemaPath);

  console.log('Context Bus initialized');
  console.log('Schema loaded:', schemaPath);
  console.log('Initial context:', JSON.stringify(bus.context, null, 2));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

// Export
export { ContextBus, createContextBus, ContextValidationError };
