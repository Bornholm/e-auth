#!/usr/bin/env bash

npm install

script/dump-assets
script/generate-keystores

npm run start:dev
