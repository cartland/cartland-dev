export interface TemperatureDataPoint {
  year: number
  month: number
  anomaly: number
}

export interface BaselineData {
  basePeriod: string
  monthlyAverages: Array<{
    month: string
    landAndOceanC: number
  }>
  annualAverage: {
    landAndOceanC: number
  }
}

export interface TemperatureLoadResult {
  data: TemperatureDataPoint[]
  monthlyBaselineTemps: Map<number, number>
  annualOverallBaselineTempC: number
}

function parseCSV(csv: string): TemperatureDataPoint[] {
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

function getDataFilePath(
  filterMonths: number,
  withBaseFn: (path: string) => string
): string {
  switch (filterMonths) {
    case 3:
      return withBaseFn('/global-temperatures/hadcrut-1850-1900-f3m.csv')
    case 5:
      return withBaseFn('/global-temperatures/hadcrut-1850-1900-f5m.csv')
    default:
      return withBaseFn('/global-temperatures/hadcrut-1850-1900.csv')
  }
}

export async function loadTemperatureData(
  filterMonths: number = 0,
  withBaseFn: (path: string) => string
): Promise<TemperatureLoadResult> {
  const dataPath = getDataFilePath(filterMonths, withBaseFn)
  const baselinePath = withBaseFn('/global-temperatures/base-1850-1900.json')

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
  const baselineJson: BaselineData = await baselineResponse.json()

  const data = parseCSV(csvText)

  const monthlyBaselineTemps = new Map<number, number>()
  baselineJson.monthlyAverages.forEach((entry, index) => {
    monthlyBaselineTemps.set(index + 1, entry.landAndOceanC)
  })

  const annualOverallBaselineTempC = baselineJson.annualAverage.landAndOceanC

  return {
    data,
    monthlyBaselineTemps,
    annualOverallBaselineTempC,
  }
}
