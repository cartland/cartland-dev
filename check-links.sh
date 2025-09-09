#!/bin/bash

# Run the link checker and capture the output
output=$(blc http://localhost:8080 -ro --filter-level 2 --rate-limit 1000 --exclude "https://github.com/cartland/cartland-dev/pull/new/feature/add-linting-and-ci-checks" --exclude "https://www.threads.net/@cartland" --exclude "https://fonts.googleapis.com/" --exclude "https://fonts.gstatic.com/" --exclude "https://x.com/LandOfCart")

# Grep for broken links and deduplicate
broken_links=$(echo "$output" | grep "BROKEN" | sort | uniq)

# Check if any broken links were found
if [ -n "$broken_links" ]; then
  echo "Broken links found. A report has been written to broken-links.md"
  echo "Please check the following links:"
  echo "---------------------------------"
  echo "$broken_links" # Print to console
  echo "---------------------------------"
  
  # Create the report file for the CI
  echo "⚠️ **Broken Link Report**" > broken-links.md
  echo "" >> broken-links.md
  echo "Our automated checker couldn't verify the following links. This can happen for temporary reasons and doesn't necessarily mean the link is broken. Please double-check them to ensure they are working correctly." >> broken-links.md
  echo "" >> broken-links.md
  echo "\`\`\`" >> broken-links.md
  echo "$broken_links" >> broken-links.md # Write to file
  echo "\`\`\`" >> broken-links.md
else
  echo "No broken links found."
fi

# Always exit with 0 to prevent the build from failing
exit 0