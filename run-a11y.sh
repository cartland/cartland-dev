#!/bin/bash

# Base command
CMD="pa11y --reporter cli --standard WCAG2AA"

# Add the --no-sandbox flag only in the CI environment
if [ "$CI" = "true" ]; then
  CMD="$CMD --chrome-launch-config '{\"args\":[\"--no-sandbox\"]}'"
fi

# Add the URL to check
CMD="$CMD http://localhost:8080"

# Run the command
eval $CMD
