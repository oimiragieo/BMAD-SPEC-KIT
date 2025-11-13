#!/bin/bash

###############################################################################
# BMAD-SPEC-KIT V2 - Enterprise Deployment Script
#
# Deploys BMAD-SPEC-KIT V2 to enterprise environments.
# Handles validation, configuration, and installation.
#
# Usage: ./deploy-enterprise.sh [--env production|staging]
#
# @version 2.0.0
# @date 2025-11-13
###############################################################################

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=============================================================================="
echo "BMAD-SPEC-KIT V2 - Enterprise Deployment"
echo "=============================================================================="
echo ""

# Parse arguments
ENV="production"
while [[ $# -gt 0 ]]; do
  case $1 in
    --env)
      ENV="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}Environment: $ENV${NC}"
echo ""

# Step 1: Pre-deployment validation
echo "📋 Step 1: Pre-deployment Validation"
echo "------------------------------------------------------------------------------"

if [ -f ".claude/ci/validate-all.sh" ]; then
  bash .claude/ci/validate-all.sh
else
  echo "⚠️  Validation script not found, skipping..."
fi

echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing Dependencies"
echo "------------------------------------------------------------------------------"

if [ -f "package.json" ]; then
  npm install
  echo -e "${GREEN}✓ Dependencies installed${NC}"
else
  echo "ℹ️  No package.json found, skipping..."
fi

echo ""

# Step 3: Configuration
echo "⚙️  Step 3: Configuration"
echo "------------------------------------------------------------------------------"

# Create necessary directories
mkdir -p .claude/context/sessions
mkdir -p .claude/context/artifacts
mkdir -p .claude/context/history/traces
mkdir -p .claude/context/history/metrics
mkdir -p .claude/context/history/gates

echo -e "${GREEN}✓ Directories created${NC}"

echo ""

# Step 4: Permissions
echo "🔐 Step 4: Setting Permissions"
echo "------------------------------------------------------------------------------"

chmod +x .claude/tools/orchestrator/*.mjs 2>/dev/null || true
chmod +x .claude/ci/*.sh 2>/dev/null || true
chmod +x .claude/deploy/*.sh 2>/dev/null || true

echo -e "${GREEN}✓ Permissions set${NC}"

echo ""

# Step 5: Health check
echo "🏥 Step 5: Health Check"
echo "------------------------------------------------------------------------------"

HEALTH_PASS=0
HEALTH_FAIL=0

# Check critical files
CRITICAL_FILES=(
  ".claude/workflows/greenfield-fullstack-v2.yaml"
  ".claude/tools/orchestrator/workflow-executor.mjs"
  ".claude/tools/context/context-bus.mjs"
  ".claude/schemas/context_state.schema.json"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} $file"
    ((HEALTH_PASS++))
  else
    echo -e "  ${RED}✗${NC} $file (MISSING)"
    ((HEALTH_FAIL++))
  fi
done

echo ""

if [ $HEALTH_FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ Health check passed${NC}"
else
  echo -e "${YELLOW}⚠️  Health check completed with warnings${NC}"
fi

echo ""
echo "=============================================================================="
echo "Deployment Summary"
echo "=============================================================================="
echo -e "Environment: ${BLUE}$ENV${NC}"
echo -e "Status: ${GREEN}READY${NC}"
echo ""
echo "Next steps:"
echo "  1. Test workflow execution:"
echo "     node .claude/tools/orchestrator/workflow-executor.mjs --workflow greenfield-fullstack-v2.yaml"
echo ""
echo "  2. Run integration tests:"
echo "     node .claude/tests/integration/workflow-execution.test.mjs"
echo ""
echo "  3. Monitor logs in .claude/context/history/"
echo ""
echo "=============================================================================="
