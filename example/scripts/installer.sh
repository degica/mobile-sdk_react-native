#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

PLATFORM=${1:-}

# Function to fetch the version from the package.json using Node.js
get_package_version() {
  node -p "require('../payment_sdk/package.json').version"
}

# Function to terminate Metro
terminate_metro() {
  if pgrep -f "node.*metro" > /dev/null; then
    echo "Terminating Metro server..."
    pkill -f "node.*metro"
  else
    echo "Metro server is not running."
  fi
}

# Uninstall the package from example
echo "Uninstalling @komoju/komoju-react-native from example"
npm uninstall @komoju/komoju-react-native

# Change directory to payment_sdk
echo "Changing directory to payment_sdk"
cd ../payment_sdk

# Build the package
echo "Building the package"
npm run build

# Get the version from package.json
PACKAGE_VERSION=$(get_package_version)
echo "Package version found: $PACKAGE_VERSION"

# Change directory back to example
echo "Changing directory back to example"
cd ../example

# Install the built package
echo "Installing the built package version $PACKAGE_VERSION"
npm i "../payment_sdk/komoju-komoju-react-native-${PACKAGE_VERSION}.tgz"

# Terminate Metro
terminate_metro

# Run platform-specific command if provided
case $PLATFORM in
  android)
    echo "Running on Android"
    react-native run-android
    ;;
  ios)
    echo "Running on iOS"
    react-native run-ios
    ;;
esac

echo "Installation and build process complete!"
