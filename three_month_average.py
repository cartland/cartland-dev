import csv

def calculate_three_month_average(input_file, output_file):
    with open(input_file, 'r') as infile:
        reader = csv.reader(infile)
        header = next(reader)
        data = list(reader)

    new_data = []
    for i in range(len(data)):
        date, anomaly_str = data[i]
        anomaly = float(anomaly_str)

        if i == 0:
            # First value: average of first 2 months
            next_anomaly = float(data[i + 1][1])
            avg_anomaly = (anomaly + next_anomaly) / 2
        elif i == len(data) - 1:
            # Last value: average of last 2 months
            prev_anomaly = float(data[i - 1][1])
            avg_anomaly = (anomaly + prev_anomaly) / 2
        else:
            # All other values: average of previous, current, and next month
            prev_anomaly = float(data[i - 1][1])
            next_anomaly = float(data[i + 1][1])
            avg_anomaly = (prev_anomaly + anomaly + next_anomaly) / 3
        
        new_data.append([date, f"{avg_anomaly:.4f}"])

    with open(output_file, 'w', newline='') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
        writer.writerows(new_data)

if __name__ == "__main__":
    input_csv = 'public/global-temperatures/1850-2024-Months-Anomaly-from-1850-1900.csv'
    output_csv = 'public/global-temperatures/1850-2024-Months-Anomaly-from-1850-1900-filter-3-months.csv'
    calculate_three_month_average(input_csv, output_csv)
