#!/usr/bin/env bash
#
# Generate all TemperatureVisualization PNGs.
# Run from the repo root or from apps/TemperatureVisualization/.

set -euo pipefail

# Resolve paths relative to this script.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DATA_DIR="$REPO_ROOT/public/global-temperatures"
OUTPUT_DIR="$SCRIPT_DIR/output"

run() {
  local dataset="$1" baseline="$2" colors="$3" mode="$4" output_name="$5"
  local out="$OUTPUT_DIR/$dataset/$baseline/$colors/$output_name.png"
  echo "Generating $out"
  "$SCRIPT_DIR/gradlew" -p "$SCRIPT_DIR" run --args="\
    --data $DATA_DIR/$dataset.csv \
    --baseline $DATA_DIR/$baseline.json \
    --colors $DATA_DIR/$colors.json \
    --mode $mode \
    --output $out"
}

# --- Unfiltered: 1850-1900 baseline ---
DATASET="hadcrut-1850-1900"
BASELINE="base-1850-1900"
for COLORS in colors-default colors-grey; do
  run "$DATASET" "$BASELINE" "$COLORS" temperature  temperature
  run "$DATASET" "$BASELINE" "$COLORS" anomaly      anomaly
done

# --- Unfiltered: 1901-2020 baseline ---
DATASET="hadcrut-1901-2020"
BASELINE="base-1901-2020"
for COLORS in colors-default colors-grey; do
  run "$DATASET" "$BASELINE" "$COLORS" temperature  temperature
  run "$DATASET" "$BASELINE" "$COLORS" anomaly      anomaly
done

# --- Filtered: 3-month ---
DATASET="hadcrut-1850-1900-f3m"
BASELINE="base-1850-1900"
for COLORS in colors-default colors-grey; do
  run "$DATASET" "$BASELINE" "$COLORS" filtered     filtered
done

# --- Filtered: 5-month ---
DATASET="hadcrut-1850-1900-f5m"
BASELINE="base-1850-1900"
for COLORS in colors-default colors-grey; do
  run "$DATASET" "$BASELINE" "$COLORS" filtered-5-month filtered-5-month
done

# --- GISTEMP: 1951-1980 baseline ---
DATASET="gistemp-1951-1980"
BASELINE="base-1951-1980"
for COLORS in colors-default colors-grey; do
  run "$DATASET" "$BASELINE" "$COLORS" temperature  temperature
  run "$DATASET" "$BASELINE" "$COLORS" anomaly      anomaly
done

echo ""
echo "Done. Generated $(find "$OUTPUT_DIR" -name '*.png' | wc -l | tr -d ' ') PNGs in $OUTPUT_DIR"
