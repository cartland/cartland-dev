// dom.js
import * as state from './state.js'
import * as colors from './colors.js'
import * as api from './api.js'

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32
}

export async function renderVisualization(mode) {
  state.setCurrentMode(mode)
  const visualizationContainer = document.getElementById('temp-visualization')
  visualizationContainer.innerHTML = '' // Clear previous visualization

  let data
  if (mode === 'filtered') {
    if (state.filtered3MonthData.length === 0) {
      state.setFiltered3MonthData(await api.loadTemperatureData(3))
    }
    data = state.filtered3MonthData
  } else if (mode === 'filtered-5-month') {
    if (state.filtered5MonthData.length === 0) {
      state.setFiltered5MonthData(await api.loadTemperatureData(5))
    }
    data = state.filtered5MonthData
  } else {
    if (state.originalData.length === 0) {
      state.setOriginalData(await api.loadTemperatureData(0))
    }
    data = state.originalData
  }

  if (data.length === 0) {
    visualizationContainer.textContent = 'Failed to load temperature data.'
    return
  }

  const dataToVisualize =
    state.currentMode === 'temperature'
      ? data.map((d) => d.anomaly + state.monthlyBaselineTemps.get(d.month))
      : data.map((d) => d.anomaly)

  const minVal = Math.min(...dataToVisualize)
  const maxVal = Math.max(...dataToVisualize)

  const startYear = data[0].year
  const endYear = data[data.length - 1].year
  const numYears = endYear - startYear + 1

  visualizationContainer.style.gridTemplateColumns = `repeat(${numYears}, 1fr)`

  const monthlyDataMap = new Map()
  data.forEach((d) => {
    if (!monthlyDataMap.has(d.year)) {
      monthlyDataMap.set(d.year, new Map())
    }
    monthlyDataMap.get(d.year).set(d.month, d) // Store full data object
  })

  for (let month = 1; month <= 12; month++) {
    for (let year = startYear; year <= endYear; year++) {
      const tempBar = document.createElement('div')
      tempBar.classList.add('temp-bar')

      const monthData =
        monthlyDataMap.has(year) && monthlyDataMap.get(year).has(month)
          ? monthlyDataMap.get(year).get(month)
          : null

      if (monthData !== null) {
        let value
        let titleText
        if (state.currentMode === 'temperature') {
          value =
            monthData.anomaly + state.monthlyBaselineTemps.get(monthData.month)
          titleText = `Absolute: ${value.toFixed(2)}°C`
        } else {
          // anomaly mode
          value = monthData.anomaly
          titleText = `Anomaly: ${value.toFixed(2)}°C`
        }
        tempBar.style.backgroundColor = colors.getColorForValue(
          value,
          minVal,
          maxVal
        )
        tempBar.title = `Year: ${year}, Month: ${month}, ${titleText}`
      } else {
        tempBar.style.backgroundColor = '#333'
        tempBar.title = `Year: ${year}, Month: ${month}, Data Missing`
      }

      visualizationContainer.appendChild(tempBar)
    }
  }

  const descriptionElement = document.getElementById('description-text')
  if (state.currentMode === 'temperature') {
    const annualTemperatures = {}
    data.forEach((d) => {
      if (!annualTemperatures[d.year]) {
        annualTemperatures[d.year] = []
      }
      annualTemperatures[d.year].push(
        d.anomaly + state.monthlyBaselineTemps.get(d.month)
      )
    })

    const annualAverages = Object.values(annualTemperatures).map((temps) => {
      const sum = temps.reduce((acc, curr) => acc + curr, 0)
      return sum / temps.length
    })

    const minAnnualAvgC = Math.min(...annualAverages)
    const maxAnnualAvgC = Math.max(...annualAverages)
    const minAnnualAvgF = celsiusToFahrenheit(minAnnualAvgC)
    const maxAnnualAvgF = celsiusToFahrenheit(maxAnnualAvgC)

    descriptionElement.innerHTML = `
                    This visualization shows estimated global monthly average temperatures from January ${startYear} to December ${endYear}. Annual average temperatures range from <strong>${minAnnualAvgC.toFixed(
                      1
                    )}°C (${minAnnualAvgF.toFixed(
                      1
                    )}°F)</strong> to <strong>${maxAnnualAvgC.toFixed(
                      1
                    )}°C (${maxAnnualAvgF.toFixed(1)}°F)</strong>.
                    <br><span class="data-source-link">Data source: <a href="https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/0,0/tavg/land_ocean/1/0/1850-2024" target="_blank">NOAA National Centers for Environmental Information (NCEI)</a></span>
                `
  } else {
    // anomaly or filtered mode
    const annualAnomalies = {}
    data.forEach((d) => {
      if (!annualAnomalies[d.year]) {
        annualAnomalies[d.year] = []
      }
      annualAnomalies[d.year].push(d.anomaly)
    })

    Object.values(annualAnomalies).map((anomalies) => {
      const sum = anomalies.reduce((acc, curr) => acc + curr, 0)
      return sum / anomalies.length
    })

    let description = `This visualization shows global monthly temperature anomalies from January ${startYear} to December ${endYear}, relative to the 1850-1900 baseline of <strong>${state.annualOverallBaselineTempC.toFixed(
      2
    )}°C</strong>.`
    if (state.currentMode === 'filtered') {
      description += ' A 3-month averaging filter has been applied.'
    }
    description += `<br><span class="data-source-link">Data source: <a href="https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/0,0/tavg/land_ocean/1/0/1850-2024" target="_blank">NOAA National Centers for Environmental Information (NCEI)</a></span>`
    descriptionElement.innerHTML = description
  }

  // Update button active states
  document
    .getElementById('temperature-mode-btn')
    .classList.toggle('active', state.currentMode === 'temperature')
  document
    .getElementById('anomaly-mode-btn')
    .classList.toggle('active', state.currentMode === 'anomaly')
  document
    .getElementById('filtered-mode-btn')
    .classList.toggle('active', state.currentMode === 'filtered')
  document
    .getElementById('filtered-5-month-mode-btn')
    .classList.toggle('active', state.currentMode === 'filtered-5-month')
}
