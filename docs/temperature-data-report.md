# Temperature Data Verification and Monthly Global Temperature Report

## 1. Data Sources Overview

This project uses two major global temperature datasets to visualize historical
climate data:

### NASA GISTEMP v4

- **Organization:** NASA Goddard Institute for Space Studies (GISS)
- **Dataset:** GISTEMP v4 — Global Land-Ocean Temperature Index
- **Methodology:** Combines land station data (GHCN v4) with ocean SST data
  (ERSSTv5) to produce a global mean surface temperature estimate
- **Baseline:** 1951-1980
- **Coverage:** 1880-present
- **Reference:** Hansen, J., R. Ruedy, M. Sato, and K. Lo, 2010: Global surface
  temperature change. Rev. Geophys., 48, RG4004

### HadCRUT (Met Office / University of East Anglia)

- **Organization:** UK Met Office Hadley Centre and Climatic Research Unit (CRU)
  at the University of East Anglia
- **Dataset:** HadCRUT5 (likely, though the project files don't specify the exact
  version)
- **Methodology:** Combines land station data (CRUTEM5) with sea surface
  temperature data (HadSST4)
- **Baseline:** The raw file uses 1991-2020; derived files in this project use
  1850-1900
- **Coverage:** 1850-present

---

## 2. Provenance Audit

### File Inventory

| File                    | Source                                       | Baseline  | Coverage  | Provenance Rating |
| ----------------------- | -------------------------------------------- | --------- | --------- | ----------------- |
| `gistemp-1951-1980.csv` | NASA GISTEMP v4                              | 1951-1980 | 1880-2025 | Strong            |
| `hadcrut-1901-2020.csv` | HadCRUT                                      | 1991-2020 | 1850-2024 | Weak              |
| `hadcrut-1850-1900.csv` | Derived from above                           | 1850-1900 | 1850-2024 | Derived           |
| `base-1901-2020.json`   | Manual entry / reference data                | N/A       | N/A       | Moderate          |
| `base-1850-1900.json`   | Derived from `base-1901-2020.json` + HadCRUT | N/A       | N/A       | Derived           |
| `base-1951-1980.json`   | Computed via `download-gistemp.sh`           | N/A       | N/A       | Moderate          |

### GISTEMP Provenance (Strong)

The GISTEMP data has a clear chain of custody:

1. `download-gistemp.sh` fetches the raw CSV from the official NASA URL:
   `https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv`
2. The "GLB" prefix confirms this is the **global** land-ocean dataset
3. The script converts the NASA format (year + 12 monthly columns) to a simple
   `Date,Anomaly` CSV format (YYYYMM, value)
4. The well-documented 1951-1980 baseline period matches NASA's standard
5. Data runs through December 2025, indicating a recent download

### HadCRUT Provenance (Weak)

Several issues reduce confidence in the HadCRUT data:

1. **No download script:** Unlike GISTEMP, there is no automated script
   documenting where the HadCRUT data was obtained
2. **Ambiguous header metadata:** The file `hadcrut-1901-2020.csv` contains:
   ```
   # Title: 0.0 Degrees N, 0.0 Degrees E Average Temperature Anomalies
   ```
   This "0.0 Degrees N, 0.0 Degrees E" label could indicate a single grid cell
   at the equator/prime meridian intersection rather than a global average.
   However, the actual temperature anomaly magnitudes (~-0.7 to +1.5 C) are
   consistent with global averages, not a single tropical ocean grid cell (which
   would show different variability patterns)
3. **Baseline mismatch:** The file header says "Base Period: 1991-2020", but
   official HadCRUT5 uses a 1961-1990 baseline. This suggests either a custom
   download configuration or a re-baselining step that is not documented
4. **Coverage gap:** HadCRUT data extends only to 2024, while GISTEMP goes
   through 2025

### Data Quality Issue: Duplicate JSON Keys

The file `base-1901-2020.json` contains duplicate `oceanF` keys in each monthly
entry:

```json
{
  "month": "January",
  "landAndOceanC": 12.0,
  "landF": 53.6,
  "landC": 2.8,
  "oceanF": 37.0,
  "oceanC": 15.8,
  "oceanF": 60.5
}
```

The first `oceanF` value (37.0) likely represents ocean temperature in
Fahrenheit, while the second `oceanF` (60.5) appears to be a different quantity
(possibly ocean + land combined in Fahrenheit). Per the JSON specification,
duplicate keys produce undefined behavior. Most parsers will use the last value
encountered.

### Derived Baseline Chain

The project computes derived baselines through a chain:

```
base-1901-2020.json (manually created reference data)
    + hadcrut-1901-2020.csv (anomalies relative to 1991-2020)
    → convert_anomaly_baseline.py → hadcrut-1850-1900.csv (re-baselined)
    → base-1850-1900.json

base-1850-1900.json
    + hadcrut-1850-1900.csv (anomalies relative to 1850-1900)
    → download-gistemp.sh (awk computation) → base-1951-1980.json
```

Any error in `base-1901-2020.json` propagates through the entire chain.

---

## 3. Cross-Dataset Comparison

To assess whether the two datasets agree, we computed absolute temperatures from
both GISTEMP and HadCRUT for the same months and compared them.

**Method:**

- GISTEMP absolute = GISTEMP anomaly (vs 1951-1980) + `base-1951-1980.json`
  monthly value
- HadCRUT absolute = HadCRUT anomaly (vs 1850-1900) + `base-1850-1900.json`
  monthly value

| Month    | GISTEMP Anomaly (vs 1951-1980) | GISTEMP Absolute (C) | HadCRUT Anomaly (vs 1850-1900) | HadCRUT Absolute (C) | Difference |
| -------- | ------------------------------ | -------------------- | ------------------------------ | -------------------- | ---------- |
| Jan 2024 | +1.25                          | 12.60                | +1.82                          | 13.09                | -0.49      |
| Jul 2024 | +1.20                          | 16.34                | +1.80                          | 16.65                | -0.31      |
| Jan 2020 | +1.18                          | 12.53                | +1.86                          | 13.13                | -0.60      |
| Jul 2023 | +1.20                          | 16.34                | +1.71                          | 16.56                | -0.22      |
| Feb 2016 | +1.37                          | 12.88                | +0.70                          | 12.16                | +0.72      |
| Feb 1998 | +0.88                          | 12.39                | +1.18                          | 12.64                | -0.25      |

**Analysis:**

The absolute temperatures from the two datasets differ by 0.2-0.7 C, which is
larger than expected for two global temperature products that should agree within
~0.1-0.2 C. This discrepancy likely stems from:

1. **Different baseline absolute temperature references:** The
   `base-1951-1980.json` and `base-1850-1900.json` files were derived through a
   chain of computations from `base-1901-2020.json`, so systematic offsets in
   that reference data propagate differently to each baseline
2. **Different dataset methodologies:** GISTEMP and HadCRUT use different spatial
   interpolation, ocean data sources, and coverage assumptions
3. **Possible HadCRUT data quality issue:** The ambiguous "0.0 Degrees N, 0.0
   Degrees E" metadata and non-standard baseline raise questions about whether
   the HadCRUT file truly represents a global average

**Conclusion:** For this report, we use **GISTEMP as the primary source** due to
its stronger provenance and clearer documentation.

---

## 4. Best Estimate: Monthly Global Temperatures Since 1980

### Methodology

Absolute temperatures are computed as:

```
absolute_temperature = GISTEMP_anomaly + baseline_1951_1980_monthly_average
```

The 1951-1980 monthly baseline averages used (from `base-1951-1980.json`):

| Month | Baseline (C) |
| ----- | ------------ |
| Jan   | 11.35        |
| Feb   | 11.51        |
| Mar   | 12.05        |
| Apr   | 13.27        |
| May   | 14.23        |
| Jun   | 14.94        |
| Jul   | 15.14        |
| Aug   | 14.89        |
| Sep   | 14.32        |
| Oct   | 13.30        |
| Nov   | 12.27        |
| Dec   | 11.54        |

### 1980s (1980-1989)

| Year | Jan   | Feb   | Mar   | Apr   | May   | Jun   | Jul   | Aug   | Sep   | Oct   | Nov   | Dec   | Avg   |
| ---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| 1980 | 11.64 | 11.90 | 12.34 | 13.57 | 14.58 | 15.14 | 15.36 | 15.07 | 14.52 | 13.43 | 12.56 | 11.75 | 13.49 |
| 1981 | 11.88 | 11.93 | 12.53 | 13.59 | 14.47 | 15.23 | 15.46 | 15.24 | 14.46 | 13.42 | 12.50 | 11.95 | 13.55 |
| 1982 | 11.40 | 11.66 | 12.08 | 13.42 | 14.41 | 14.99 | 15.28 | 14.92 | 14.46 | 13.43 | 12.45 | 11.96 | 13.37 |
| 1983 | 11.88 | 11.94 | 12.47 | 13.54 | 14.57 | 15.16 | 15.32 | 15.25 | 14.69 | 13.47 | 12.57 | 11.70 | 13.55 |
| 1984 | 11.66 | 11.65 | 12.31 | 13.33 | 14.56 | 14.96 | 15.33 | 15.08 | 14.53 | 13.43 | 12.33 | 11.50 | 13.39 |
| 1985 | 11.57 | 11.47 | 12.22 | 13.39 | 14.37 | 15.09 | 15.18 | 15.06 | 14.45 | 13.42 | 12.32 | 11.68 | 13.35 |
| 1986 | 11.61 | 11.88 | 12.35 | 13.49 | 14.44 | 15.06 | 15.25 | 15.05 | 14.35 | 13.45 | 12.37 | 11.67 | 13.41 |
| 1987 | 11.67 | 11.94 | 12.23 | 13.51 | 14.48 | 15.29 | 15.54 | 15.14 | 14.67 | 13.63 | 12.56 | 12.00 | 13.56 |
| 1988 | 11.92 | 11.95 | 12.57 | 13.70 | 14.67 | 15.34 | 15.47 | 15.28 | 14.69 | 13.68 | 12.39 | 11.83 | 13.62 |
| 1989 | 11.47 | 11.81 | 12.41 | 13.56 | 14.40 | 15.11 | 15.48 | 15.22 | 14.66 | 13.59 | 12.47 | 11.91 | 13.51 |

### 1990s (1990-1999)

| Year | Jan   | Feb   | Mar   | Apr   | May   | Jun   | Jul   | Aug   | Sep   | Oct   | Nov   | Dec   | Avg   |
| ---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| 1990 | 11.76 | 11.95 | 12.85 | 13.83 | 14.68 | 15.31 | 15.60 | 15.23 | 14.55 | 13.75 | 12.73 | 11.95 | 13.68 |
| 1991 | 11.78 | 12.01 | 12.41 | 13.78 | 14.57 | 15.47 | 15.62 | 15.28 | 14.76 | 13.59 | 12.57 | 11.86 | 13.64 |
| 1992 | 11.83 | 11.91 | 12.53 | 13.54 | 14.54 | 15.20 | 15.23 | 14.97 | 14.31 | 13.37 | 12.30 | 11.76 | 13.46 |
| 1993 | 11.69 | 11.88 | 12.41 | 13.55 | 14.51 | 15.17 | 15.39 | 15.00 | 14.43 | 13.53 | 12.31 | 11.72 | 13.47 |
| 1994 | 11.61 | 11.53 | 12.34 | 13.69 | 14.51 | 15.37 | 15.44 | 15.10 | 14.63 | 13.73 | 12.71 | 11.93 | 13.55 |
| 1995 | 11.87 | 12.30 | 12.52 | 13.74 | 14.50 | 15.37 | 15.59 | 15.34 | 14.65 | 13.76 | 12.72 | 11.80 | 13.68 |
| 1996 | 11.59 | 11.97 | 12.38 | 13.60 | 14.50 | 15.19 | 15.51 | 15.37 | 14.57 | 13.52 | 12.69 | 11.91 | 13.57 |
| 1997 | 11.67 | 11.92 | 12.57 | 13.61 | 14.58 | 15.49 | 15.48 | 15.30 | 14.84 | 13.91 | 12.91 | 12.13 | 13.70 |
| 1998 | 11.93 | 12.39 | 12.68 | 13.91 | 14.91 | 15.71 | 15.80 | 15.54 | 14.74 | 13.72 | 12.70 | 12.09 | 13.84 |
| 1999 | 11.83 | 12.15 | 12.37 | 13.59 | 14.49 | 15.30 | 15.52 | 15.21 | 14.71 | 13.64 | 12.64 | 11.95 | 13.62 |

### 2000s (2000-2009)

| Year | Jan   | Feb   | Mar   | Apr   | May   | Jun   | Jul   | Aug   | Sep   | Oct   | Nov   | Dec   | Avg   |
| ---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| 2000 | 11.60 | 12.07 | 12.60 | 13.83 | 14.59 | 15.34 | 15.53 | 15.31 | 14.71 | 13.57 | 12.57 | 11.82 | 13.63 |
| 2001 | 11.80 | 11.95 | 12.60 | 13.77 | 14.80 | 15.46 | 15.73 | 15.38 | 14.84 | 13.80 | 12.99 | 12.09 | 13.77 |
| 2002 | 12.12 | 12.29 | 12.93 | 13.85 | 14.87 | 15.47 | 15.76 | 15.43 | 14.96 | 13.84 | 12.86 | 11.98 | 13.86 |
| 2003 | 12.09 | 12.09 | 12.65 | 13.82 | 14.84 | 15.42 | 15.72 | 15.53 | 14.94 | 14.02 | 12.80 | 12.29 | 13.85 |
| 2004 | 11.93 | 12.24 | 12.68 | 13.88 | 14.60 | 15.38 | 15.40 | 15.34 | 14.82 | 13.91 | 13.00 | 12.04 | 13.77 |
| 2005 | 12.10 | 12.11 | 12.79 | 13.94 | 14.86 | 15.59 | 15.75 | 15.49 | 15.04 | 14.06 | 13.01 | 12.22 | 13.91 |
| 2006 | 11.91 | 12.25 | 12.68 | 13.74 | 14.71 | 15.60 | 15.68 | 15.60 | 14.98 | 14.01 | 13.01 | 12.33 | 13.88 |
| 2007 | 12.37 | 12.21 | 12.77 | 14.03 | 14.92 | 15.55 | 15.74 | 15.49 | 14.93 | 13.89 | 12.86 | 12.04 | 13.90 |
| 2008 | 11.65 | 11.89 | 12.80 | 13.81 | 14.73 | 15.43 | 15.74 | 15.35 | 14.93 | 13.97 | 12.97 | 12.08 | 13.78 |
| 2009 | 12.00 | 12.04 | 12.58 | 13.88 | 14.89 | 15.58 | 15.88 | 15.58 | 15.04 | 13.95 | 13.07 | 12.21 | 13.89 |

### 2010s (2010-2019)

| Year | Jan   | Feb   | Mar   | Apr   | May   | Jun   | Jul   | Aug   | Sep   | Oct   | Nov   | Dec   | Avg   |
| ---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| 2010 | 12.10 | 12.35 | 12.97 | 14.12 | 14.99 | 15.62 | 15.77 | 15.56 | 14.95 | 14.01 | 13.09 | 11.99 | 13.96 |
| 2011 | 11.87 | 11.99 | 12.71 | 13.91 | 14.76 | 15.57 | 15.84 | 15.64 | 14.88 | 13.95 | 12.86 | 12.14 | 13.84 |
| 2012 | 11.82 | 11.99 | 12.62 | 14.00 | 15.01 | 15.59 | 15.73 | 15.55 | 15.04 | 14.10 | 13.05 | 12.07 | 13.88 |
| 2013 | 12.06 | 12.13 | 12.72 | 13.80 | 14.83 | 15.64 | 15.74 | 15.60 | 15.09 | 13.99 | 13.10 | 12.24 | 13.91 |
| 2014 | 12.12 | 12.06 | 12.83 | 14.08 | 15.10 | 15.61 | 15.72 | 15.73 | 15.20 | 14.10 | 12.94 | 12.33 | 13.98 |
| 2015 | 12.22 | 12.42 | 13.01 | 14.02 | 15.03 | 15.75 | 15.87 | 15.69 | 15.16 | 14.38 | 13.33 | 12.71 | 14.13 |
| 2016 | 12.53 | 12.88 | 13.40 | 14.36 | 15.19 | 15.75 | 15.99 | 15.91 | 15.22 | 14.17 | 13.18 | 12.40 | 14.25 |
| 2017 | 12.37 | 12.65 | 13.22 | 14.21 | 15.14 | 15.65 | 15.96 | 15.77 | 15.06 | 14.19 | 13.14 | 12.47 | 14.15 |
| 2018 | 12.17 | 12.36 | 12.93 | 14.16 | 15.04 | 15.71 | 15.98 | 15.67 | 15.12 | 14.32 | 13.10 | 12.47 | 14.09 |
| 2019 | 12.28 | 12.47 | 13.22 | 14.28 | 15.09 | 15.84 | 16.08 | 15.84 | 15.25 | 14.30 | 13.26 | 12.66 | 14.21 |

### 2020s (2020-2025)

| Year | Jan   | Feb   | Mar   | Apr   | May   | Jun   | Jul   | Aug   | Sep   | Oct   | Nov   | Dec   | Avg   |
| ---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| 2020 | 12.53 | 12.75 | 13.23 | 14.39 | 15.22 | 15.85 | 16.03 | 15.75 | 15.29 | 14.17 | 13.36 | 12.34 | 14.24 |
| 2021 | 12.16 | 12.15 | 12.94 | 14.03 | 15.02 | 15.79 | 16.06 | 15.70 | 15.25 | 14.29 | 13.20 | 12.41 | 14.08 |
| 2022 | 12.26 | 12.40 | 13.10 | 14.11 | 15.07 | 15.86 | 16.08 | 15.84 | 15.21 | 14.27 | 13.00 | 12.34 | 14.13 |
| 2023 | 12.23 | 12.48 | 13.28 | 14.26 | 15.17 | 16.03 | 16.34 | 16.08 | 15.80 | 14.64 | 13.67 | 12.91 | 14.41 |
| 2024 | 12.60 | 12.95 | 13.44 | 14.58 | 15.38 | 16.14 | 16.34 | 16.18 | 15.56 | 14.63 | 13.57 | 12.81 | 14.51 |
| 2025 | 12.73 | 12.77 | 13.41 | 14.50 | 15.31 | 15.99 | 16.16 | 16.05 | 15.57 | 14.49 | 13.48 | 12.59 | 14.42 |

---

## 5. Methodology Notes

### How Absolute Temperatures Are Computed

Climate datasets report **temperature anomalies** — the difference from a
baseline period average — rather than absolute temperatures. This is because
anomalies are more spatially coherent and less sensitive to station
placement/elevation than absolute values.

To convert an anomaly to an absolute temperature:

```
absolute_temp_month = anomaly_month + baseline_average_for_that_month
```

For example, if GISTEMP reports January 2024 as +1.25 C (relative to 1951-1980),
and the 1951-1980 January average absolute temperature is 11.35 C, then:

```
January 2024 absolute = 1.25 + 11.35 = 12.60 C
```

### Caveats About Absolute Temperature Estimates

1. **Baseline absolute values carry uncertainty.** The 1951-1980 baseline monthly
   averages in `base-1951-1980.json` were derived from HadCRUT data through a
   chain of computations (see Section 2). Published estimates of Earth's global
   mean surface temperature for 1951-1980 are approximately 14 C annually, and
   our computed annual average of 13.2 C for that baseline falls within the range
   of estimates (which vary by 0.5-1.0 C across different analyses)

2. **Anomalies are more reliable than absolute temperatures.** The scientific
   community has more confidence in temperature _changes_ (anomalies) than in
   absolute temperature values. The absolute values in this report should be
   understood as estimates with an uncertainty of approximately +/-0.5 C

3. **Seasonal cycle dominates.** The monthly variation (about 11 C in January to
   15 C in July globally) reflects the Northern Hemisphere bias in the global
   average, since most land mass is in the Northern Hemisphere. The warming trend
   (~1 C over the 45-year period) is much smaller than this seasonal cycle

4. **Record-setting context.** The data confirms that 2023-2024 saw
   unprecedented warmth:
   - July 2023 and July 2024 both reached approximately 16.34 C, the highest
     absolute monthly temperatures in the dataset
   - 2024 annual average of 14.51 C is the highest on record
   - Multiple months in 2023-2024 exceeded GISTEMP anomalies of +1.2 C above
     the 1951-1980 baseline

---

## 6. Recommendations

1. **Add a HadCRUT download script** similar to `download-gistemp.sh` to
   document the exact URL and version of HadCRUT data used
2. **Fix duplicate JSON keys** in `base-1901-2020.json` (the duplicate `oceanF`
   keys)
3. **Document the baseline computation chain** more explicitly, ideally with a
   single script that can reproduce all derived files from raw downloads
4. **Consider using GISTEMP as the primary dataset** for visualizations, given
   its stronger provenance and more recent data coverage

---

_Report generated: February 2026_
_Primary data source: NASA GISTEMP v4 (GLB.Ts+dSST)_
_All temperatures in degrees Celsius_
