#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

RELEASE_TYPE=${1:-}

echo_help() {
  cat << EOF
USAGE:
    ./scripts/publish <release_type>
ARGS:
    <release_type>
            A Semantic Versioning release type used to bump the version number. Either "patch", "minor", or "major".
EOF
}

percentEncodeString() {
  node -p "encodeURIComponent('$1')"
}

create_github_release() {
  local release_notes
  local changelog
  local is_collecting=0
  while IFS= read -r line; do
    if [[ $line == \#\#[[:space:]]*[[:digit:]]* ]]; then
      if [ $is_collecting == 0 ] ; then
        # Reached the entry for the version that is to be published
        is_collecting=1
        local version_and_date="${line#* }"
      else
        # Reached the next version entry, we're done.
        break
      fi
    elif [ $is_collecting == 1 ] ; then
      changelog+="${line}
"
    fi
  done < CHANGELOG.md
  
  release_notes="$(cat << EOF
$version_and_date

$changelog

Please [see the changelog](https://github.com/degica/mobile-sdk_react-native/blob/main/payment_sdk/CHANGELOG.md) for additional details.
EOF
)"

  if ! command -v hub &> /dev/null; then
    create_github_release_fallback "$release_notes"
  else
    local current_version=${version_and_date% -*}
    echo "Creating GitHub release for tag: v$current_version"
    echo ""
    echo -n "    "
    hub release create -em "$release_notes" "v$current_version"
  fi
}

create_github_release_fallback() {
  local release_notes=$1
  cat << EOF
Remember to create a release on GitHub at https://github.com/degica/mobile-sdk_react-native/releases/new with the following notes:
$release_notes
EOF
}

# Show help if no arguments passed
if [ $# -eq 0 ]; then
  echo "Error! Missing release type argument"
  echo ""
  echo_help
  exit 1
fi

# Show help message if -h, --help, or help passed
case $1 in
  -h | --help | help)
    echo_help
    exit 0
    ;;
esac

# Validate passed release type
case $RELEASE_TYPE in
  patch | minor | major)
    ;;
  *)
    echo "Error! Invalid release type supplied"
    echo ""
    echo_help
    exit 1
    ;;
esac

# Make sure our working dir is the repo root directory
cd "$(dirname "$0")/.."

echo "Fetching git remotes"
git fetch

GIT_STATUS=$(git status)
if ! grep -q 'On branch main' <<< "$GIT_STATUS"; then
  echo "Error! Must be on main branch to publish"
  exit 1
fi

if ! grep -q "Your branch is up to date with 'origin/main'." <<< "$GIT_STATUS"; then
  echo "Error! Must be up to date with origin/main to publish"
  exit 1
fi

if ! grep -q 'working tree clean' <<< "$GIT_STATUS"; then
  echo "Error! Cannot publish with dirty working tree"
  exit 1
fi

echo "Installing dependencies"
npm ci --legacy-peer-deps

echo "Running tests"
npm run test

echo "Building the project"
npm run build

echo "Bumping package.json $RELEASE_TYPE version and tagging commit"
npm version $RELEASE_TYPE

# Extract the new version from package.json
NEW_VERSION=$(node -p "require('./package.json').version")

# Update the version in ../example/package.json
echo "Updating version in ../example/package.json to $NEW_VERSION"
node -p "const fs = require('fs'); const path = '../example/package.json'; const pkg = JSON.parse(fs.readFileSync(path, 'utf8')); pkg.version = '$NEW_VERSION'; fs.writeFileSync(path, JSON.stringify(pkg, null, 2))"

echo "Publishing release to npm"
npm publish --access=public

echo "Pushing git commit and tag"
# git add package.json ../example/package.json
# git commit -m "Update package.json and example package.json to version $NEW_VERSION"
git push --follow-tags

echo "Updating the main branch"
# git push origin main

echo "Publish successful!"
echo ""

create_github_release

echo "Done!"
