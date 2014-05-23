#!/bin/bash

make compile-javascript
./node_modules/.bin/coffee server/app.coffee
