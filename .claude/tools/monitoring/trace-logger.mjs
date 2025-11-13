#!/usr/bin/env node

/**
 * Execution Trace Logger
 *
 * Comprehensive logging system for workflow execution.
 * Tracks all agent activities, timings, and outcomes.
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

const CONFIG = {
  PATHS: {
    TRACES: path.join(PROJECT_ROOT, '.claude/context/history/traces')
  }
};

class ExecutionTraceLogger {
  constructor(sessionId, workflowName) {
    this.sessionId = sessionId;
    this.workflowName = workflowName;
    this.trace = {
      session_id: sessionId,
      workflow_name: workflowName,
      started_at: new Date().toISOString(),
      status: 'in_progress',
      execution_log: []
    };
  }

  async log(entry) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...entry
    };

    this.trace.execution_log.push(logEntry);
    console.log(`  📝 ${entry.action}: ${entry.agent || 'system'} (${entry.status})`);
  }

  async complete(status = 'completed') {
    this.trace.status = status;
    this.trace.completed_at = new Date().toISOString();
    this.trace.total_duration_ms = Date.now() - new Date(this.trace.started_at).getTime();
    await this.save();
  }

  async save() {
    const filePath = path.join(CONFIG.PATHS.TRACES, `${this.sessionId}.json`);
    await fs.mkdir(path.dirname(filePath), { recursive: true});
    await fs.writeFile(filePath, JSON.stringify(this.trace, null, 2));
    return filePath;
  }
}

export { ExecutionTraceLogger };
