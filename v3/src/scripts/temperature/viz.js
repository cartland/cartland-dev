// Interactive controller for the global temperature visualization page.
// Vanilla-JS port of the v2 Vue component: mode switching, five-stop color
// customization, PNG export, and color-config import/export.

import { getColorForValue, hexToHsv, hsvToHex } from './colors.js'
import { loadTemperatureData } from './data.js'

const DEFAULT_HEX = {
  low: '#3300FF',
  lowMid: '#50A0C0',
  mid: '#FFFFFF',
  highMid: '#FFB000',
  high: '#990000',
}

export const COLOR_TYPES = ['low', 'lowMid', 'mid', 'highMid', 'high']

const DATA_SOURCE_HTML =
  '<span class="data-source-link">Data source: ' +
  '<a href="https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/0,0/tavg/land_ocean/1/0/1850-2024" target="_blank" rel="noopener noreferrer">' +
  'NOAA National Centers for Environmental Information (NCEI)</a></span>'

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32
}

export function initTemperatureViz() {
  const grid = document.getElementById('temp-visualization')
  const description = document.getElementById('description-text')
  if (!grid || !description) return

  const state = {
    mode: 'temperature',
    datasets: { plain: null, f3m: null, f5m: null },
    monthlyBaselineTemps: new Map(),
    annualOverallBaselineTempC: 0,
    hex: { ...DEFAULT_HEX },
    colors: {},
    cells: [],
  }
  COLOR_TYPES.forEach((type) => {
    state.colors[type] = hexToHsv(DEFAULT_HEX[type])
  })

  function activeData() {
    if (state.mode === 'filtered') return state.datasets.f3m || []
    if (state.mode === 'filtered-5-month') return state.datasets.f5m || []
    return state.datasets.plain || []
  }

  // Compute the grid cells (rows = months, columns = years) for the active
  // dataset and mode. Values are cached so color changes can recolor the
  // existing DOM without rebuilding it.
  function computeCells() {
    const data = activeData()
    if (data.length === 0) return { cells: [], numYears: 1 }

    const isTemperature = state.mode === 'temperature'
    const values = data.map((d) =>
      isTemperature
        ? d.anomaly + (state.monthlyBaselineTemps.get(d.month) || 0)
        : d.anomaly
    )
    const minVal = Math.min(...values)
    const maxVal = Math.max(...values)

    const startYear = data[0].year
    const endYear = data[data.length - 1].year

    const byYearMonth = new Map()
    data.forEach((d) => {
      if (!byYearMonth.has(d.year)) byYearMonth.set(d.year, new Map())
      byYearMonth.get(d.year).set(d.month, d)
    })

    const cells = []
    for (let month = 1; month <= 12; month++) {
      for (let year = startYear; year <= endYear; year++) {
        const point = byYearMonth.get(year)?.get(month) ?? null
        if (point !== null) {
          const value = isTemperature
            ? point.anomaly + (state.monthlyBaselineTemps.get(point.month) || 0)
            : point.anomaly
          const kind = isTemperature ? 'Absolute' : 'Anomaly'
          cells.push({
            value,
            minVal,
            maxVal,
            title: `Year: ${year}, Month: ${month}, ${kind}: ${value.toFixed(2)}°C`,
          })
        } else {
          cells.push({
            value: null,
            title: `Year: ${year}, Month: ${month}, Data Missing`,
          })
        }
      }
    }

    return { cells, numYears: endYear - startYear + 1 }
  }

  function cellColor(cell) {
    if (cell.value === null) return '#333'
    return getColorForValue(cell.value, cell.minVal, cell.maxVal, state.colors)
  }

  function rebuildGrid() {
    const { cells, numYears } = computeCells()
    state.cells = cells
    grid.style.gridTemplateColumns = `repeat(${numYears}, 1fr)`
    const fragment = document.createDocumentFragment()
    cells.forEach((cell) => {
      const div = document.createElement('div')
      div.className = 'temp-bar'
      div.style.backgroundColor = cellColor(cell)
      div.title = cell.title
      fragment.appendChild(div)
    })
    grid.replaceChildren(fragment)
  }

  function recolorGrid() {
    const children = grid.children
    for (let i = 0; i < children.length && i < state.cells.length; i++) {
      children[i].style.backgroundColor = cellColor(state.cells[i])
    }
  }

  function renderDescription() {
    const data = activeData()
    if (data.length === 0) return

    const startYear = data[0].year
    const endYear = data[data.length - 1].year

    if (state.mode === 'temperature') {
      const byYear = new Map()
      data.forEach((d) => {
        if (!byYear.has(d.year)) byYear.set(d.year, [])
        byYear
          .get(d.year)
          .push(d.anomaly + (state.monthlyBaselineTemps.get(d.month) || 0))
      })
      const annualAverages = [...byYear.values()].map(
        (temps) => temps.reduce((acc, t) => acc + t, 0) / temps.length
      )
      const minC = Math.min(...annualAverages)
      const maxC = Math.max(...annualAverages)
      const minF = celsiusToFahrenheit(minC)
      const maxF = celsiusToFahrenheit(maxC)
      description.innerHTML =
        `This visualization shows estimated global monthly average temperatures ` +
        `from January ${startYear} to December ${endYear}. Annual average ` +
        `temperatures range from <strong>${minC.toFixed(1)}°C (${minF.toFixed(1)}°F)</strong> ` +
        `to <strong>${maxC.toFixed(1)}°C (${maxF.toFixed(1)}°F)</strong>.<br>` +
        DATA_SOURCE_HTML
    } else {
      let text =
        `This visualization shows global monthly temperature anomalies from ` +
        `January ${startYear} to December ${endYear}, relative to the 1850-1900 ` +
        `baseline of <strong>${state.annualOverallBaselineTempC.toFixed(2)}°C</strong>.`
      if (state.mode === 'filtered') {
        text += ' A 3-month averaging filter has been applied.'
      }
      if (state.mode === 'filtered-5-month') {
        text += ' A 5-month averaging filter has been applied.'
      }
      description.innerHTML = `${text}<br>${DATA_SOURCE_HTML}`
    }
  }

  function render() {
    rebuildGrid()
    renderDescription()
  }

  async function setMode(mode) {
    state.mode = mode
    document.querySelectorAll('[data-mode]').forEach((button) => {
      button.classList.toggle('active', button.dataset.mode === mode)
    })
    try {
      const needs =
        mode === 'filtered'
          ? 'f3m'
          : mode === 'filtered-5-month'
            ? 'f5m'
            : 'plain'
      if (!state.datasets[needs]) {
        const filterMonths = needs === 'f3m' ? 3 : needs === 'f5m' ? 5 : 0
        const result = await loadTemperatureData(filterMonths)
        state.datasets[needs] = result.data
        state.monthlyBaselineTemps = result.monthlyBaselineTemps
        state.annualOverallBaselineTempC = result.annualOverallBaselineTempC
      }
      render()
    } catch {
      description.textContent =
        'Unable to load temperature data. Please try again later.'
    }
  }

  function applyHexColors(hexColors) {
    COLOR_TYPES.forEach((type) => {
      const hsv = hexToHsv(hexColors[type])
      if (!hsv) return
      state.hex[type] = hexColors[type]
      state.colors[type] = hsv
      syncPickerControls(type)
    })
    recolorGrid()
  }

  function syncPickerControls(type) {
    const color = state.colors[type]
    const hue = document.getElementById(`${type}-hue`)
    const saturation = document.getElementById(`${type}-saturation`)
    const value = document.getElementById(`${type}-value`)
    const hexInput = document.getElementById(`${type}-hex-input`)
    if (hue) hue.value = Math.round(color.h)
    if (saturation) saturation.value = Math.round(color.s)
    if (value) value.value = Math.round(color.v)
    if (hexInput) hexInput.value = state.hex[type]
  }

  async function loadColorPreset(presetName) {
    try {
      const response = await fetch(
        `/global-temperatures/colors-${presetName}.json`
      )
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const config = await response.json()
      if (COLOR_TYPES.every((type) => config[type])) {
        applyHexColors(config)
      }
    } catch {
      description.textContent =
        'Unable to load the color preset. Please try again later.'
    }
  }

  async function saveImage() {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(grid, {
      backgroundColor: '#130830',
      scale: 8,
    })
    const link = document.createElement('a')
    const modeName = state.mode === 'temperature' ? 'Temperature' : 'Anomaly'
    link.download = `temperature-visualization-${modeName}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function downloadColors() {
    const jsonString = JSON.stringify(state.hex, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'color-configuration.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function handleColorFileUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result)
        if (COLOR_TYPES.every((type) => config[type])) {
          applyHexColors(config)
        }
      } catch {
        description.textContent =
          'That file is not a valid color configuration.'
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  // Wire controls.
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.mode))
  })
  document.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () =>
      loadColorPreset(button.dataset.preset)
    )
  })
  document
    .getElementById('save-image-btn')
    ?.addEventListener('click', saveImage)
  document
    .getElementById('download-colors-btn')
    ?.addEventListener('click', downloadColors)
  const uploadInput = document.getElementById('upload-colors-input')
  document
    .getElementById('upload-colors-btn')
    ?.addEventListener('click', () => uploadInput?.click())
  uploadInput?.addEventListener('change', handleColorFileUpload)

  COLOR_TYPES.forEach((type) => {
    const readSliders = () => {
      const h = Number(document.getElementById(`${type}-hue`)?.value ?? 0)
      const s = Number(
        document.getElementById(`${type}-saturation`)?.value ?? 0
      )
      const v = Number(document.getElementById(`${type}-value`)?.value ?? 0)
      state.colors[type] = { h, s, v }
      state.hex[type] = hsvToHex(h, s, v)
      const hexInput = document.getElementById(`${type}-hex-input`)
      if (hexInput) hexInput.value = state.hex[type]
      recolorGrid()
    }
    ;['hue', 'saturation', 'value'].forEach((slider) => {
      document
        .getElementById(`${type}-${slider}`)
        ?.addEventListener('input', readSliders)
    })
    document
      .getElementById(`${type}-hex-input`)
      ?.addEventListener('change', (event) => {
        const hsv = hexToHsv(event.target.value)
        if (!hsv) return
        state.hex[type] = event.target.value
        state.colors[type] = hsv
        syncPickerControls(type)
        recolorGrid()
      })
  })

  COLOR_TYPES.forEach(syncPickerControls)
  setMode('temperature')
}
