import csv
import json
from collections import defaultdict

def calculate_monthly_averages(csv_file_path, reference_baseline_path, start_year, end_year):
    monthly_data = defaultdict(list)
    
    # Load reference baseline (e.g., 1901-2020 absolute temperatures)
    reference_monthly_temps = {}
    with open(reference_baseline_path, 'r') as f:
        ref_baseline = json.load(f)
        for item in ref_baseline['monthlyAverages']:
            # Convert month name to number for easy lookup
            month_num = {
                "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
                "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
            }[item['month']]
            reference_monthly_temps[month_num] = item['landAndOceanC']

    with open(csv_file_path, 'r') as csvfile:
        lines = [line for line in csvfile if not line.startswith('#')]
        reader = csv.reader(lines)
        next(reader)  # Skip the actual header row "Date,Anomaly"
        
        for row in reader:
            date_str = row[0]
            year = int(date_str[:4])
            month = int(date_str[4:])
            anomaly = float(row[1])
            
            if start_year <= year <= end_year:
                # Convert anomaly to absolute temperature using the reference baseline
                # This assumes the anomaly is relative to the reference_baseline_path's period
                # and that reference_monthly_temps contains absolute temperatures for its period.
                if month in reference_monthly_temps:
                    absolute_temp = anomaly + reference_monthly_temps[month]
                    monthly_data[month].append(absolute_temp)
                else:
                    print(f"Warning: No reference baseline temperature found for month {month}. Skipping data for {date_str}")
                
    monthly_averages = []
    month_names = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    
    for i in range(1, 13):
        if monthly_data[i]:
            avg_absolute_temp = sum(monthly_data[i]) / len(monthly_data[i])
            monthly_averages.append({
                "month": month_names[i-1],
                "landAndOceanC": round(avg_absolute_temp, 2) # Round to 2 decimal places
            })
            
    # Calculate annual average from monthly averages
    annual_avg_c = sum(item["landAndOceanC"] for item in monthly_averages) / len(monthly_averages) if monthly_averages else 0

    return {
        "basePeriod": f"{start_year}-{end_year}",
        "monthlyAverages": monthly_averages,
        "annualAverage": {"landAndOceanC": round(annual_avg_c, 2)}
    }

if __name__ == "__main__":
    csv_path = "public/global-temperatures/1850-2024-Months-Anomaly-from-1901-2020.csv"
    reference_baseline_path = "public/global-temperatures/baseline-1901-2020.json" # New reference
    output_json_path = "public/global-temperatures/baseline-1850-1900.json"
    
    baseline_data = calculate_monthly_averages(csv_path, reference_baseline_path, 1850, 1900)
    
    with open(output_json_path, 'w') as jsonfile:
        json.dump(baseline_data, jsonfile, indent=2)
        
    print(f"Baseline data for 1850-1900 written to {output_json_path}")
