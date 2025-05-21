#!/bin/bash

WRAPPERS_BASEPATH=${2:-.}
WRAPPERS_DIR="${WRAPPERS_BASEPATH}/.wrappers"
WRAPPERS_SCRIPT_PATTERN="*w"

for wrapperScript in $(ls $WRAPPERS_DIR/$WRAPPERS_SCRIPT_PATTERN); do
  if [ -f "$wrapperScript" ]; then
    echo "Running $wrapperScript wrapper"
    . $wrapperScript
  fi
done