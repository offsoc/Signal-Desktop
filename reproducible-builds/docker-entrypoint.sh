#!/usr/bin/env bash
# Copyright 2024 Signal Messenger, LLC
# SPDX-License-Identifier: AGPL-3.0-only

trap '[[ $pid ]] && kill $pid; exit' EXIT

# This is the default entrypoint for the when running the build container.
# Usage: docker-entrypoint.sh [BUILD_TYPE]

# BUILD_TYPE affects the package name and version.
# dev (default):
# - name: signal-desktop
# - version: package.json version
# public:
# - name: signal-desktop or signal-desktop-beta, depending on package.json version
# - version: package.json version
# alpha:
# - name: signal-desktop-alpha
# - version: package.json version + commit sha
# test: Same as alpha
# staging:
# - name: signal-desktop-staging
# - version: package.json version + commit sha; replaces "alpha" with "staging"
if [ "$1" != "" ]; then
  BUILD_TYPE="$1"
fi
echo "BUILD_TYPE: ${BUILD_TYPE}"

# SOURCE_DATE_EPOCH allows package builders like FPM (used for creating the .deb
# package on linux) to make their build timestamps determistic. Otherwise, a fresh
# UNIX timestamp will be generated at the time of the build, and is non-deterministic.
echo "SOURCE_DATE_EPOCH: ${SOURCE_DATE_EPOCH}"

npm install
npm run clean-transpile
cd sticker-creator
npm install
npm run build
cd ..
npm run generate

if [ "${BUILD_TYPE}" = "public" ]; then
  npm run prepare-beta-build
elif [ "${BUILD_TYPE}" = "alpha" ]; then
  npm run prepare-alpha-version
  npm run prepare-alpha-build
elif [ "${BUILD_TYPE}" = "axolotl" ]; then
  npm run prepare-axolotl-version
  npm run prepare-axolotl-build
elif [ "${BUILD_TYPE}" = "adhoc" ]; then
  npm run prepare-adhoc-version
  npm run prepare-adhoc-build
elif [ "${BUILD_TYPE}" = "staging" ]; then
  npm run prepare-alpha-version
  npm run prepare-staging-build
elif [ "${BUILD_TYPE}" = "test" ]; then
  npm run prepare-alpha-version
  npm run prepare-alpha-build
elif [ "${BUILD_TYPE}" = "dev" ]; then
  echo "dev build, using package.json as is"
else
  echo "Unknown build type ${BUILD_TYPE}"
  exit 1
fi

npm run build-linux
