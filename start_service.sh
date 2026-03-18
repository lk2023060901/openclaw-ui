#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/.openclaw-ui.pid"
PLIST_FILE="$SCRIPT_DIR/.openclaw-ui.launchagent.plist"
LAUNCH_LABEL="ai.openclaw.ui"
LOG_DIR="$SCRIPT_DIR/logs"
LOG_FILE="$LOG_DIR/openclaw-ui.log"
PORT="${PORT:-13000}"
HOST="${HOST:-127.0.0.1}"
USER_ID="$(id -u)"
NPM_BIN="$(command -v npm)"
NODE_BIN="$(command -v node)"
NODE_DIR="$(dirname "$NODE_BIN")"
NPM_DIR="$(dirname "$NPM_BIN")"

if [[ -z "$NPM_BIN" || -z "$NODE_BIN" ]]; then
  echo "node or npm not found in PATH" >&2
  exit 1
fi

"$SCRIPT_DIR/stop_service.sh"

mkdir -p "$LOG_DIR"

if [[ ! -d "$SCRIPT_DIR/node_modules" ]]; then
  echo "Installing dependencies..."
  (cd "$SCRIPT_DIR" && npm install)
fi

echo "Starting OpenClaw UI on http://$HOST:$PORT"

echo "Building production bundle..."
(cd "$SCRIPT_DIR" && npm run build >"$LOG_FILE" 2>&1)

cat >"$PLIST_FILE" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LAUNCH_LABEL</string>
  <key>WorkingDirectory</key>
  <string>$SCRIPT_DIR</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/zsh</string>
    <string>-lc</string>
    <string>cd "$SCRIPT_DIR" &amp;&amp; exec env PATH="$NODE_DIR:$NPM_DIR:/usr/bin:/bin:/usr/sbin:/sbin" HOST="$HOST" PORT="$PORT" "$NPM_BIN" run start</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$LOG_FILE</string>
  <key>StandardErrorPath</key>
  <string>$LOG_FILE</string>
</dict>
</plist>
EOF

launchctl bootstrap "gui/$USER_ID" "$PLIST_FILE" >/dev/null 2>&1 || true
launchctl kickstart -k "gui/$USER_ID/$LAUNCH_LABEL" >/dev/null 2>&1

for _ in {1..20}; do
  if command -v lsof >/dev/null 2>&1 && lsof -i "tcp:$PORT" -n -P 2>/dev/null | grep -q "LISTEN"; then
    PID="$(lsof -ti tcp:"$PORT" 2>/dev/null | head -n 1 || true)"
    if [[ -n "$PID" ]]; then
      echo "$PID" >"$PID_FILE"
    fi
    echo "OpenClaw UI started. PID: $PID"
    echo "Log file: $LOG_FILE"
    exit 0
  fi
  sleep 0.5
done

echo "Failed to start OpenClaw UI. Check $LOG_FILE" >&2
rm -f "$PID_FILE"
exit 1
