#!/bin/bash

# This script takes template files from
# static/create-component/ComponentTemplate, copies them to your new components
# directory, names them correctly, and replaces the component name inside each
# template file.
# USAGE:
# > ./static/create-component/create-component.sh RightSidebar

# export default RightSidebar;

# Just some bash color codes.
RED=`tput setaf 1`
GREEN=`tput setaf 2`
RESET=`tput sgr0`

echo_error () {
  echo "${RED}Error:${RESET} $1"
}

echo_created () {
  echo "${GREEN}created${RESET} $1"
}

# The name of the directory of template files that get copied over into the new
# component directory. Also the name of the component in said template files,
# that will get replaced with the component name provided as the first arg.
TEMPLATE_NAME="ComponentTemplate"
# The directory containing this script file.
DIR=$(dirname "$0")
# The directory containing all the template files we will copy over.
TEMPLATE_DIR="$DIR/$TEMPLATE_NAME"
# The static/conmponents directory, where we will put the new component
# directory and files.
COMPONENTS_DIR=$(cd "$DIR/../components/"; pwd)

# The first arg is the name of the component you want to make.
COMPONENT_NAME=$1
if [ -z $COMPONENT_NAME ]; then
  echo_error "USAGE: create-component.sh MyComponentName";
  exit 1;
fi

if [[ "$COMPONENT_NAME" =~ [^[:alpha:]] ]]; then
  echo_error "Component name must be just uppercase and lowercase letters!"
  exit 1
fi

# The new component directory to create.
NEW_DIR="$COMPONENTS_DIR/$COMPONENT_NAME"

# Bail out if the new component directory already exists.
if [ -d "$NEW_DIR" ]; then
  echo_error "Directory $NEW_DIR already exists!";
  exit 1;
fi

# Make the new component directory.
mkdir $NEW_DIR
echo_created $NEW_DIR

# For each template file, copy it over, rename it, and do string replace.
for file in $TEMPLATE_DIR/*
do
  base=$(basename $file)
  # Generate new filename by replacing TEMPLATE_NAME with COMPONENT_NAME in its
  # filename.
  new_file="$NEW_DIR/${base/$TEMPLATE_NAME/$COMPONENT_NAME}"
  cp $file $new_file
  # Replace all TEMPLATE_NAME strings in the file with COMPONENT_NAME.
  sed -i '' 's/'"$TEMPLATE_NAME"'/'"$COMPONENT_NAME"'/g' "$new_file"
  echo_created $new_file
done