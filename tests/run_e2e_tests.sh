#!/usr/bin/env bash
# ==============================================================================
# Master E2E Test Runner — Portfolio Website Redesign
# Path: tests/run_e2e_tests.sh
# 
# Executes all 4 E2E Test Tiers:
# - Tier 1: Feature Presence & Content Accuracy (tests/test_features.mjs)
# - Tier 2: Boundary & Corner Cases (tests/test_mobile_375px.mjs)
# - Tier 3: Cross-Feature Interactions (tests/test_interactions.mjs)
# - Tier 4: Real-World Scenarios & Desktop Lighthouse (tests/test_lighthouse.mjs)
#
# Returns exit code 0 when all tests pass, non-zero on failure.
# ==============================================================================

set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "================================================================================"
echo "  PORTFOLIO REDESIGN E2E TEST SUITE — MASTER RUNNER"
echo "  Project Root: $PROJECT_ROOT"
echo "  Timestamp:    $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "================================================================================"

TOTAL_PASS=0
TOTAL_FAIL=0
FAILURES=""

# Ensure local HTTP server on port 8080 is available for Lighthouse / Playwright
SERVER_PID=""
if ! curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/index.html | grep -qE "200|304"; then
  echo "[Setup] Starting local HTTP static server on port 8080..."
  python3 -m http.server 8080 -d "$PROJECT_ROOT" > /dev/null 2>&1 &
  SERVER_PID=$!
  sleep 1
  trap "if [ -n '$SERVER_PID' ]; then kill $SERVER_PID 2>/dev/null || true; fi" EXIT
else
  echo "[Setup] Existing HTTP server detected on http://127.0.0.1:8080."
fi

# Helper function to run a tier
run_tier() {
  local tier_num="$1"
  local tier_name="$2"
  local test_file="$3"

  echo ""
  echo "--------------------------------------------------------------------------------"
  echo "  RUNNING TIER $tier_num: $tier_name"
  echo "  File: tests/$test_file"
  echo "--------------------------------------------------------------------------------"

  local start_time=$(date +%s)
  if node --test "tests/$test_file"; then
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    echo "✔ Tier $tier_num PASSED in ${duration}s"
    TOTAL_PASS=$((TOTAL_PASS + 1))
  else
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    echo "✖ Tier $tier_num FAILED in ${duration}s"
    TOTAL_FAIL=$((TOTAL_FAIL + 1))
    FAILURES="$FAILURES Tier_$tier_num($test_file)"
  fi
}

# Run all 4 test tiers
run_tier "1" "Feature Presence & Content Accuracy" "test_features.mjs"
run_tier "2" "Boundary & Corner Cases (Mobile 375px & Touch Targets)" "test_mobile_375px.mjs"
run_tier "3" "Cross-Feature Interactions (Modal Dialog & Nav)" "test_interactions.mjs"
run_tier "4" "Real-World Scenarios & Desktop Lighthouse" "test_lighthouse.mjs"

echo ""
echo "================================================================================"
echo "  E2E TEST RUN SUMMARY"
echo "================================================================================"
echo "  Tiers Passed: $TOTAL_PASS / 4"
echo "  Tiers Failed: $TOTAL_FAIL / 4"

if [ $TOTAL_FAIL -eq 0 ]; then
  echo "  RESULT: ALL TEST TIERS PASSED (Exit Code: 0)"
  echo "================================================================================"
  exit 0
else
  echo "  RESULT: FAILURES DETECTED IN:$FAILURES (Exit Code: 1)"
  echo "================================================================================"
  exit 1
fi
