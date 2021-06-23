#! /bin/sh

git submodule foreach --recursive git clean -xfd
git submodule foreach --recursive git reset --hard
git submodule update --init --recursive
git submodule foreach --recursive git checkout moleculer
git submodule foreach --recursive git pull