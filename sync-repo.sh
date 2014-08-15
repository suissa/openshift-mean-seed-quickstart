#!/bin/bash
#
# Sync from original mean-sead repo
#
# $1 (optional) - repo url

REPO=${1:-https://github.com/suissa/mean-seed.git}
set -exu #sarava!

if ! git remote -v|grep ^mean-sead -q; then
   git remote add mean-sead ${REPO}
fi

git pull mean-sead master
git push origin master
