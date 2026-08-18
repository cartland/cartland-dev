// Loads the HadCRUT temperature CSVs and the 1850-1900 baseline JSON from
// the shared /global-temperatures assets at the hosting root.

function parseCSV(csv) {
  const lines = csv.trim().split('\n')
  const dataLines = lines.filter(
    (line) => !line.startsWith('#') && line.includes(',')
  )
  return dataLines
    .map((line) => {
      const [dateStr, anomalyStr] = line.split(',')
      return {
        year: parseInt(dateStr.substring(0, 4)),
        month: parseInt(dateStr.substring(4, 6)),
        anomaly: parseFloat(anomalyStr),
      }
    })
    .filter((d) => !isNaN(d.year) && !isNaN(d.month) && !isNaN(d.anomaly))
}

function getDataFilePath(filterMonths) {
  switch (filterMonths) {
    case 3:
      return '/global-temperatures/hadcrut-1850-1900-f3m.csv'
    case 5:
      return '/global-temperatures/hadcrut-1850-1900-f5m.csv'
    default:
      return '/global-temperatures/hadcrut-1850-1900.csv'
  }
}

export async function loadTemperatureData(filterMonths = 0) {
  const dataPath = getDataFilePath(filterMonths)
  const baselinePath = '/global-temperatures/base-1850-1900.json'

  const [csvResponse, baselineResponse] = await Promise.all([
    fetch(dataPath),
    fetch(baselinePath),
  ])

  if (!csvResponse.ok) {
    throw new Error(`Failed to load temperature data: ${csvResponse.status}`)
  }
  if (!baselineResponse.ok) {
    throw new Error(`Failed to load baseline data: ${baselineResponse.status}`)
  }

  const csvText = await csvResponse.text()
  const baselineJson = await baselineResponse.json()

  const data = parseCSV(csvText)

  const monthlyBaselineTemps = new Map()
  baselineJson.monthlyAverages.forEach((entry, index) => {
    monthlyBaselineTemps.set(index + 1, entry.landAndOceanC)
  })

  return {
    data,
    monthlyBaselineTemps,
    annualOverallBaselineTempC: baselineJson.annualAverage.landAndOceanC,
  }
}
