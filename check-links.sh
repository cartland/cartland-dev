#!/bin/bash

# Run the link checker and capture the output.
#
# --exclude-external: only internal links/assets gate the build. External
# link liveness is intentionally NOT a merge gate: sites like LinkedIn
# (HTTP 999), NYTimes/Wirecutter (503), Medium, X and Threads return
# anti-bot responses to the checker from GitHub Actions datacenter IPs even
# though the links resolve fine in browsers, which made the deploy flaky.
# Internal checking still catches the regressions a refactor can introduce
# (broken page links, missing images/assets, bad rewrites).
#
# The crawl starts at the legacy root site and, separately, at the v3 site
# (v3 is not linked from the legacy pages, so it needs its own entry point).
BLC_ARGS=(-ro --exclude-external --filter-level 2 --rate-limit 1000)
output_root=$(blc http://localhost:8080 "${BLC_ARGS[@]}")
output_v3=$(blc http://localhost:8080/v3/ "${BLC_ARGS[@]}")
output="$output_root"$'\n'"$output_v3"

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
  exit 1
else
  echo "No broken links found."
  exit 0
fi
