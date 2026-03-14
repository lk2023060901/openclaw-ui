#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/.openclaw-ui.pid"
PLIST_FILE="$SCRIPT_DIR/.openclaw-ui.launchagent.plist"
LAUNCH_LABEL="ai.openclaw.ui"
PORT="${PORT:-3000}"
USER_ID="$(id -u)"

stop_pid() {
  local pid="$1"

  if [[ -z "$pid" ]]; then
    return 0
  fi

  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true

    for _ in {1..10}; do
      if ! kill -0 "$pid" 2>/dev/null; then
        return 0
      fi
      sleep 0.5
    done

    kill -9 "$pid" 2>/dev/null || true
  fi
}

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  stop_pid "$PID"
  rm -f "$PID_FILE"
fi

launchctl bootout "gui/$USER_ID" "$PLIST_FILE" >/dev/null 2>&1 || true
launchctl remove "$LAUNCH_LABEL" >/dev/null 2>&1 || true

if command -v lsof >/dev/null 2>&1; then
  PORT_PIDS="$(lsof -ti tcp:"$PORT" 2>/dev/null || true)"
  if [[ -n "$PORT_PIDS" ]]; then
    while IFS= read -r pid; do
      [[ -n "$pid" ]] || continue
      stop_pid "$pid"
    done <<<"$PORT_PIDS"
  fi
fi

echo "OpenClaw UI stopped."
