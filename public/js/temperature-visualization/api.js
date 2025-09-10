// api.js
import * as state from './state.js'

function parseCSV(csv) {
  const lines = csv.trim().split('\n')
  // Skip header lines (lines starting with #) and the column header line
  const dataLines = lines.filter(
    (line) => !line.startsWith('#') && line.includes(',')
  )

  const parsedData = []
  for (const line of dataLines) {
    const [dateStr, anomalyStr] = line.split(',')
    const year = parseInt(dateStr.substring(0, 4))
    const month = parseInt(dateStr.substring(4, 6))
    const anomaly = parseFloat(anomalyStr)

    if (!isNaN(year) && !isNaN(month) && !isNaN(anomaly)) {
      parsedData.push({ year, month, anomaly })
    }
  }
  return parsedData
}

export async function loadTemperatureData(filterMonths = 0) {
  let dataFilePath = state.ORIGINAL_DATA_FILE_PATH
  if (filterMonths === 3) {
    dataFilePath = state.FILTERED_3_MONTH_DATA_FILE_PATH
  } else if (filterMonths === 5) {
    dataFilePath = state.FILTERED_5_MONTH_DATA_FILE_PATH
  }
  try {
    const [csvResponse, baselineResponse] = await Promise.all([
      fetch(dataFilePath),
      fetch(state.BASELINE_FILE_PATH),
    ])

    const csvText = await csvResponse.text()
    const baselineData = await baselineResponse.json()

    // Populate monthlyBaselineTemps map
    baselineData.monthlyAverages.forEach((avg, index) => {
      // Month index is 0-based in array, but 1-based for actual month number
      state.monthlyBaselineTemps.set(index + 1, avg.landAndOceanC)
    })
    state.setAnnualOverallBaselineTempC(baselineData.annualAverage.landAndOceanC)

    return parseCSV(csvText)
  } catch (error) {
    console.error('Error loading data:', error)
    document.getElementById('temp-visualization').textContent =
      'Failed to load data.'
    return []
  }
}
