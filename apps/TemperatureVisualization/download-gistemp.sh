#!/usr/bin/env bash
#
# Download NASA GISTEMP v4 global temperature data and convert it to the
# Date,Anomaly CSV format used by TemperatureVisualization.
#
# Also computes base-1951-1980.json from HadCRUT data.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DATA_DIR="$REPO_ROOT/public/global-temperatures"

GISTEMP_URL="https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv"
RAW_FILE="$DATA_DIR/gistemp-raw.csv"
OUTPUT_CSV="$DATA_DIR/gistemp-1951-1980.csv"
BASELINE_JSON="$DATA_DIR/base-1951-1980.json"

# --- 1. Download raw GISTEMP CSV ---
echo "Downloading GISTEMP v4 from $GISTEMP_URL ..."
curl -fSL "$GISTEMP_URL" -o "$RAW_FILE"
echo "Saved raw file to $RAW_FILE"

# --- 2. Convert to Date,Anomaly format ---
echo "Converting to Date,Anomaly format ..."
awk -F',' '
BEGIN { print "Date,Anomaly" }
# Skip header lines — data rows start with a 4-digit year
/^[0-9]{4}/ {
  year = $1
  for (m = 2; m <= 13; m++) {
    val = $m
    # Remove leading/trailing whitespace
    gsub(/^[ \t]+|[ \t]+$/, "", val)
    # Skip missing values (marked as ***)
    if (val == "***" || val == "") continue
    # Format month as zero-padded two digits
    month = sprintf("%02d", m - 1)
    printf "%s%s,%s\n", year, month, val
  }
}
' "$RAW_FILE" > "$OUTPUT_CSV"

rows=$(wc -l < "$OUTPUT_CSV" | tr -d ' ')
echo "Wrote $OUTPUT_CSV ($rows lines including header)"

# --- 3. Compute base-1951-1980.json from HadCRUT data ---
echo "Computing base-1951-1980.json ..."

HADCRUT_CSV="$DATA_DIR/hadcrut-1850-1900.csv"
BASELINE_1850="$DATA_DIR/base-1850-1900.json"

if [[ ! -f "$HADCRUT_CSV" ]]; then
  echo "ERROR: HadCRUT CSV not found at $HADCRUT_CSV" >&2
  exit 1
fi
if [[ ! -f "$BASELINE_1850" ]]; then
  echo "ERROR: Baseline 1850-1900 JSON not found at $BASELINE_1850" >&2
  exit 1
fi

# Extract 1850-1900 baseline monthly temperatures as comma-separated string
# Parse the JSON to get the 12 monthly landAndOceanC values
baseline_1850_values=$(awk '
  /"landAndOceanC"/ {
    gsub(/[^0-9.]/, "", $0)
    vals = (vals == "" ? $0 : vals "," $0)
    count++
    if (count == 12) { print vals; exit }
  }
' "$BASELINE_1850")

# Compute mean HadCRUT anomaly for each month over 1951-1980
# Then add to 1850-1900 baseline to get absolute temperatures for 1951-1980
awk -F',' -v baseline_vals="$baseline_1850_values" '
BEGIN {
  # Parse baseline values (comma-separated) into array
  n = split(baseline_vals, bvals, ",")
  for (i = 1; i <= n; i++) {
    baseline[i] = bvals[i] + 0
  }
  # Initialize sums and counts for months 1-12
  for (m = 1; m <= 12; m++) {
    sum[m] = 0
    count[m] = 0
  }

  months[1]  = "January"
  months[2]  = "February"
  months[3]  = "March"
  months[4]  = "April"
  months[5]  = "May"
  months[6]  = "June"
  months[7]  = "July"
  months[8]  = "August"
  months[9]  = "September"
  months[10] = "October"
  months[11] = "November"
  months[12] = "December"
}
# Skip header
NR == 1 { next }
{
  date = $1
  anomaly = $2 + 0
  year = int(date / 100)
  month = date % 100
  if (year >= 1951 && year <= 1980 && month >= 1 && month <= 12) {
    sum[month] += anomaly
    count[month]++
  }
}
END {
  annual_sum = 0
  annual_count = 0

  print "{"
  print "  \"basePeriod\": \"1951-1980\","
  print "  \"monthlyAverages\": ["
  for (m = 1; m <= 12; m++) {
    if (count[m] > 0) {
      mean_anomaly = sum[m] / count[m]
    } else {
      mean_anomaly = 0
    }
    abs_temp = baseline[m] + mean_anomaly
    annual_sum += abs_temp
    annual_count++

    # Round to 2 decimal places
    abs_temp = int(abs_temp * 100 + 0.5) / 100

    comma = ","
    if (m == 12) comma = ""
    printf "    {\n      \"month\": \"%s\",\n      \"landAndOceanC\": %.2f\n    }%s\n", months[m], abs_temp, comma
  }
  print "  ],"

  annual_avg = annual_sum / annual_count
  annual_avg = int(annual_avg * 100 + 0.5) / 100
  printf "  \"annualAverage\": {\n    \"landAndOceanC\": %.1f\n  }\n", annual_avg

  print "}"
}
' "$HADCRUT_CSV" > "$BASELINE_JSON"

echo "Wrote $BASELINE_JSON"

# Clean up raw file
rm -f "$RAW_FILE"
echo "Done."
