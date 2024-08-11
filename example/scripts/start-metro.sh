#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# Function to terminate Metro
terminate_metro() {
  if pgrep -f "node.*metro" > /dev/null; then
    echo "Terminating Metro server..."
    pkill -f "node.*metro"
  else
    echo "Metro server is not running."
  fi
}

# Terminate any running Metro server
terminate_metro

# Start the Metro server with cache clean
echo "Starting Metro server with cache clean"
npx react-native start --reset-cache
