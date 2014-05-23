#!/bin/bash

COMPILED_FILENAME=./public/javascripts/compiled.js
DEPENDENCIES_FILENAME=./public/javascripts/deps.js
COMPILER_FILENAME=./vendors/closure-compiler/compiler.jar
NAMESPACE="LibrariesHub.Application"
COMPILATION_LEVEL=WHITESPACE_ONLY

echo "Cleaning old files...."
if [ -f $COMPILED_FILENAME ]; then
    rm $COMPILED_FILENAME
fi

if [ -f $DEPENDENCIES_FILENAME ]; then
    rm $DEPENDENCIES_FILENAME
fi

if [ "$NODE_ENV" == "production" ]; then
    echo "compile javascript files..."
    ./vendors/closure-library/closure/bin/build/closurebuilder.py \
        --root=./vendors/closure-library/ \
        --root=./public/javascripts/ \
        --namespace=$NAMESPACE \
        --output_mode=compiled \
        --compiler_jar=$COMPILER_FILENAME \
        --compiler_flags="--compilation_level=$COMPILATION_LEVEL" \
        > $COMPILED_FILENAME
else
    echo "writes dependencies..."
    ./vendors/closure-library/closure/bin/build/depswriter.py --root_with_prefix="./public ../../../../" > $DEPENDENCIES_FILENAME
fi
