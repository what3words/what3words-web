#!/usr/bin/env bash

currDateTime=$(date "+%Y%m%d%H%M");

if [ -f ~/.bash_aliases ]; then
  echo "🤖🐚 Expanding aliases"
  shopt -s expand_aliases
  source ~/.bash_aliases
fi

echo "🤖🏃 Running act"
mkdir -p tmp/logs
act $@ 2>&1| tee tmp/logs/act-$currDateTime.txt
echo "🤖✅ act run complete"
