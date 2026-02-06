import csv
import json
from collections import defaultdict

def convert_anomalies(input_csv_path, baseline_1901_2020_path, baseline_1850_1900_path, output_csv_path):
    # Load 1901-2020 baseline for absolute temperatures
    baseline_1901_2020_temps = {}
    with open(baseline_1901_2020_path, 'r') as f:
        ref_baseline = json.load(f)
        for item in ref_baseline['monthlyAverages']:
            month_num = {
                "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
                "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
            }[item['month']]
            baseline_1901_2020_temps[month_num] = item['landAndOceanC']

    # Load 1850-1900 baseline for new anomalies
    baseline_1850_1900_temps = {}
    with open(baseline_1850_1900_path, 'r') as f:
        new_baseline = json.load(f)
        for item in new_baseline['monthlyAverages']:
            month_num = {
                "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
                "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
            }[item['month']]
            baseline_1850_1900_temps[month_num] = item['landAndOceanC']

    output_lines = ["Date,Anomaly\n"] # Header for the new CSV

    with open(input_csv_path, 'r') as csvfile:
        lines = [line for line in csvfile if not line.startswith('#')]
        reader = csv.reader(lines)
        next(reader)  # Skip the actual header row "Date,Anomaly"
        
        for row in reader:
            date_str = row[0]
            year = int(date_str[:4])
            month = int(date_str[4:])
            anomaly_from_1901_2020 = float(row[1])

            if month in baseline_1901_2020_temps and month in baseline_1850_1900_temps:
                # Step 1: Convert anomaly from 1901-2020 baseline to absolute temperature
                absolute_temp = anomaly_from_1901_2020 + baseline_1901_2020_temps[month]
                
                # Step 2: Convert absolute temperature to anomaly from 1850-1900 baseline
                anomaly_from_1850_1900 = absolute_temp - baseline_1850_1900_temps[month]
                
                output_lines.append(f"{date_str},{anomaly_from_1850_1900:.2f}\n")
            else:
                print(f"Warning: Missing baseline data for month {month}. Skipping data for {date_str}")

    with open(output_csv_path, 'w') as outfile:
        outfile.writelines(output_lines)
    
    print(f"Converted anomalies written to {output_csv_path}")

if __name__ == "__main__":
    input_csv = "public/global-temperatures/hadcrut-1901-2020.csv"
    baseline_1901_2020 = "public/global-temperatures/base-1901-2020.json"
    baseline_1850_1900 = "public/global-temperatures/base-1850-1900.json"
    output_csv = "public/global-temperatures/hadcrut-1850-1900.csv"
    
    convert_anomalies(input_csv, baseline_1901_2020, baseline_1850_1900, output_csv)
