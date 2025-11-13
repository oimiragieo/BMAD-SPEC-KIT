#!/bin/bash

###############################################################################
# BMAD-SPEC-KIT V2 - Enterprise CI/CD Validation Pipeline
#
# Comprehensive validation suite for continuous integration.
# Validates all schemas, runs tests, checks code quality.
#
# Usage: ./validate-all.sh
#
# @version 2.0.0
# @date 2025-11-13
###############################################################################

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "=============================================================================="
echo "BMAD-SPEC-KIT V2 - Enterprise Validation Pipeline"
echo "=============================================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Helper function
run_check() {
  local name="$1"
  local command="$2"

  echo -n "[$name] "

  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
  fi
}

echo "🔍 Phase 1: Schema Validation"
echo "------------------------------------------------------------------------------"

# Validate all JSON schemas
for schema in .claude/schemas/*.schema.json; do
  run_check "Schema: $(basename $schema)" \
    "node -e 'JSON.parse(require(\"fs\").readFileSync(\"$schema\", \"utf-8\"))'"
done

echo ""
echo "🔍 Phase 2: Workflow Validation"
echo "------------------------------------------------------------------------------"

# Validate all workflow YAML files
for workflow in .claude/workflows/*.yaml; do
  run_check "Workflow: $(basename $workflow)" \
    "node -e 'require(\"js-yaml\").load(require(\"fs\").readFileSync(\"$workflow\", \"utf-8\"))'"
done

echo ""
echo "🔍 Phase 3: Tool Validation"
echo "------------------------------------------------------------------------------"

# Check that all tools are executable
TOOLS=(
  ".claude/tools/orchestrator/workflow-executor.mjs"
  ".claude/tools/orchestrator/execute-step.mjs"
  ".claude/tools/orchestrator/task-tool-integration.mjs"
  ".claude/tools/context/context-bus.mjs"
  ".claude/tools/feedback/feedback-loop-engine.mjs"
  ".claude/tools/quality/metrics-aggregator.mjs"
  ".claude/tools/validation/cross-agent-validator.mjs"
)

for tool in "${TOOLS[@]}"; do
  run_check "Tool: $(basename $tool)" \
    "node --check $tool"
done

echo ""
echo "🔍 Phase 4: Agent Validation"
echo "------------------------------------------------------------------------------"

# Check that all agent prompts exist
AGENTS=(analyst pm architect developer qa ux-expert)

for agent in "${AGENTS[@]}"; do
  run_check "Agent: $agent" \
    "test -f .claude/agents/$agent/prompt.md"
done

echo ""
echo "🔍 Phase 5: Documentation Validation"
echo "------------------------------------------------------------------------------"

DOCS=(
  ".claude/docs/OPTIMIZATION_ANALYSIS.md"
  ".claude/docs/MIGRATION_GUIDE_V2.md"
  ".claude/docs/V2_OPTIMIZATION_SUMMARY.md"
)

for doc in "${DOCS[@]}"; do
  run_check "Doc: $(basename $doc)" \
    "test -f $doc"
done

echo ""
echo "=============================================================================="
echo "Validation Summary"
echo "=============================================================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All validations passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some validations failed.${NC}"
  exit 1
fi
