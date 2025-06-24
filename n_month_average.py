import csv
import sys

def calculate_n_month_average(input_file, output_file, n):
    with open(input_file, 'r') as infile:
        reader = csv.reader(infile)
        header = next(reader)
        data = list(reader)

    new_data = []
    half_n = n // 2

    for i in range(len(data)):
        date, anomaly_str = data[i]
        
        start = max(0, i - half_n)
        end = min(len(data), i + half_n + 1)
        
        anomalies = [float(data[j][1]) for j in range(start, end)]
        avg_anomaly = sum(anomalies) / len(anomalies)
        
        new_data.append([date, f"{avg_anomaly:.4f}"])

    with open(output_file, 'w', newline='') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
        writer.writerows(new_data)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python n_month_average.py <n_months>")
        sys.exit(1)
    
    n_months = int(sys.argv[1])
    input_csv = 'public/global-temperatures/1850-2024-Months-Anomaly-from-1850-1900.csv'
    output_csv = f'public/global-temperatures/1850-2024-Months-Anomaly-from-1850-1900-filter-{n_months}-months.csv'
    calculate_n_month_average(input_csv, output_csv, n_months)
