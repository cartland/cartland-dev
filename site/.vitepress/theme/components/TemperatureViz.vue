<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { withBase } from 'vitepress'
import {
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  hsvToHsl,
  getColorForValue,
} from '../composables/temperature/colors'
import type {
  TemperatureDataPoint,
  HSVColor,
} from '../composables/temperature/colors'
import { loadTemperatureData } from '../composables/temperature/api'

const DEFAULT_LOW_COLOR_HEX = '#3300FF'
const DEFAULT_LOW_MID_COLOR_HEX = '#50A0C0'
const DEFAULT_MID_COLOR_HEX = '#FFFFFF'
const DEFAULT_HIGH_MID_COLOR_HEX = '#FFB000'
const DEFAULT_HIGH_COLOR_HEX = '#990000'

const currentMode = ref<string>('temperature')
const originalData = ref<TemperatureDataPoint[]>([])
const filtered3MonthData = ref<TemperatureDataPoint[]>([])
const filtered5MonthData = ref<TemperatureDataPoint[]>([])
const monthlyBaselineTemps = ref<Map<number, number>>(new Map())
const annualOverallBaselineTempC = ref<number>(0)

const lowColor = ref<HSVColor>({ h: 0, s: 0, v: 0 })
const lowMidColor = ref<HSVColor>({ h: 0, s: 0, v: 0 })
const midColor = ref<HSVColor>({ h: 0, s: 0, v: 0 })
const highMidColor = ref<HSVColor>({ h: 0, s: 0, v: 0 })
const highColor = ref<HSVColor>({ h: 0, s: 0, v: 0 })

const lowHex = ref(DEFAULT_LOW_COLOR_HEX)
const lowMidHex = ref(DEFAULT_LOW_MID_COLOR_HEX)
const midHex = ref(DEFAULT_MID_COLOR_HEX)
const highMidHex = ref(DEFAULT_HIGH_MID_COLOR_HEX)
const highHex = ref(DEFAULT_HIGH_COLOR_HEX)

const colorRefs = {
  low: { color: lowColor, hex: lowHex },
  lowMid: { color: lowMidColor, hex: lowMidHex },
  mid: { color: midColor, hex: midHex },
  highMid: { color: highMidColor, hex: highMidHex },
  high: { color: highColor, hex: highHex },
}

function updateSlidersFromHex(colorType: keyof typeof colorRefs) {
  const hex = colorRefs[colorType].hex.value
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) return

  const rgb = hexToRgb(hex)
  if (!rgb) return
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const h = hsl.h
  const s = hsl.s
  const l = hsl.l
  const v = l + (s * Math.min(l, 100 - l)) / 100
  const newS = v === 0 ? 0 : 2 * (1 - l / v) * 100

  colorRefs[colorType].color.value = { h, s: newS, v }
}

function updateHexFromSliders(colorType: keyof typeof colorRefs) {
  const c = colorRefs[colorType].color.value
  const hsl = hsvToHsl(c.h, c.s, c.v)
  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  colorRefs[colorType].hex.value = rgbToHex(rgb.r, rgb.g, rgb.b)
}

function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

const activeData = computed(() => {
  if (currentMode.value === 'filtered') return filtered3MonthData.value
  if (currentMode.value === 'filtered-5-month') return filtered5MonthData.value
  return originalData.value
})

interface GridCell {
  color: string
  title: string
}

const gridCells = computed<GridCell[]>(() => {
  const data = activeData.value
  if (data.length === 0) return []

  const dataToVisualize =
    currentMode.value === 'temperature'
      ? data.map(
          (d) => d.anomaly + (monthlyBaselineTemps.value.get(d.month) || 0)
        )
      : data.map((d) => d.anomaly)

  const minVal = Math.min(...dataToVisualize)
  const maxVal = Math.max(...dataToVisualize)

  const startYear = data[0].year
  const endYear = data[data.length - 1].year

  const monthlyDataMap = new Map<number, Map<number, TemperatureDataPoint>>()
  data.forEach((d) => {
    if (!monthlyDataMap.has(d.year)) monthlyDataMap.set(d.year, new Map())
    monthlyDataMap.get(d.year)!.set(d.month, d)
  })

  const cells: GridCell[] = []
  const colors = {
    low: lowColor.value,
    lowMid: lowMidColor.value,
    mid: midColor.value,
    highMid: highMidColor.value,
    high: highColor.value,
  }

  for (let month = 1; month <= 12; month++) {
    for (let year = startYear; year <= endYear; year++) {
      const monthData = monthlyDataMap.get(year)?.get(month) ?? null
      if (monthData !== null) {
        let value: number
        let titleText: string
        if (currentMode.value === 'temperature') {
          value =
            monthData.anomaly +
            (monthlyBaselineTemps.value.get(monthData.month) || 0)
          titleText = `Absolute: ${value.toFixed(2)}°C`
        } else {
          value = monthData.anomaly
          titleText = `Anomaly: ${value.toFixed(2)}°C`
        }
        cells.push({
          color: getColorForValue(value, minVal, maxVal, colors),
          title: `Year: ${year}, Month: ${month}, ${titleText}`,
        })
      } else {
        cells.push({
          color: '#333',
          title: `Year: ${year}, Month: ${month}, Data Missing`,
        })
      }
    }
  }

  return cells
})

const numYears = computed(() => {
  const data = activeData.value
  if (data.length === 0) return 1
  return data[data.length - 1].year - data[0].year + 1
})

const descriptionHtml = computed(() => {
  const data = activeData.value
  if (data.length === 0) return ''

  const startYear = data[0].year
  const endYear = data[data.length - 1].year

  if (currentMode.value === 'temperature') {
    const annualTemperatures: Record<number, number[]> = {}
    data.forEach((d) => {
      if (!annualTemperatures[d.year]) annualTemperatures[d.year] = []
      annualTemperatures[d.year].push(
        d.anomaly + (monthlyBaselineTemps.value.get(d.month) || 0)
      )
    })

    const annualAverages = Object.values(annualTemperatures).map((temps) => {
      const sum = temps.reduce((acc, curr) => acc + curr, 0)
      return sum / temps.length
    })

    const minC = Math.min(...annualAverages)
    const maxC = Math.max(...annualAverages)
    const minF = celsiusToFahrenheit(minC)
    const maxF = celsiusToFahrenheit(maxC)

    return `This visualization shows estimated global monthly average temperatures from January ${startYear} to December ${endYear}. Annual average temperatures range from <strong>${minC.toFixed(1)}°C (${minF.toFixed(1)}°F)</strong> to <strong>${maxC.toFixed(1)}°C (${maxF.toFixed(1)}°F)</strong>.<br><span class="data-source-link">Data source: <a href="https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/0,0/tavg/land_ocean/1/0/1850-2024" target="_blank">NOAA National Centers for Environmental Information (NCEI)</a></span>`
  } else {
    let description = `This visualization shows global monthly temperature anomalies from January ${startYear} to December ${endYear}, relative to the 1850-1900 baseline of <strong>${annualOverallBaselineTempC.value.toFixed(2)}°C</strong>.`
    if (currentMode.value === 'filtered') {
      description += ' A 3-month averaging filter has been applied.'
    }
    if (currentMode.value === 'filtered-5-month') {
      description += ' A 5-month averaging filter has been applied.'
    }
    description += `<br><span class="data-source-link">Data source: <a href="https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/0,0/tavg/land_ocean/1/0/1850-2024" target="_blank">NOAA National Centers for Environmental Information (NCEI)</a></span>`
    return description
  }
})

async function setMode(mode: string) {
  currentMode.value = mode
  if (mode === 'filtered' && filtered3MonthData.value.length === 0) {
    const result = await loadTemperatureData(3, withBase)
    filtered3MonthData.value = result.data
    monthlyBaselineTemps.value = result.monthlyBaselineTemps
    annualOverallBaselineTempC.value = result.annualOverallBaselineTempC
  } else if (
    mode === 'filtered-5-month' &&
    filtered5MonthData.value.length === 0
  ) {
    const result = await loadTemperatureData(5, withBase)
    filtered5MonthData.value = result.data
    monthlyBaselineTemps.value = result.monthlyBaselineTemps
    annualOverallBaselineTempC.value = result.annualOverallBaselineTempC
  } else if (
    (mode === 'temperature' || mode === 'anomaly') &&
    originalData.value.length === 0
  ) {
    const result = await loadTemperatureData(0, withBase)
    originalData.value = result.data
    monthlyBaselineTemps.value = result.monthlyBaselineTemps
    annualOverallBaselineTempC.value = result.annualOverallBaselineTempC
  }
}

async function loadColorPreset(presetName: string) {
  const filePath = withBase(`/global-temperatures/colors-${presetName}.json`)
  try {
    const response = await fetch(filePath)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const colorConfig = await response.json()

    if (
      colorConfig.low &&
      colorConfig.lowMid &&
      colorConfig.mid &&
      colorConfig.highMid &&
      colorConfig.high
    ) {
      lowHex.value = colorConfig.low
      lowMidHex.value = colorConfig.lowMid
      midHex.value = colorConfig.mid
      highMidHex.value = colorConfig.highMid
      highHex.value = colorConfig.high
      ;(['low', 'lowMid', 'mid', 'highMid', 'high'] as const).forEach((type) =>
        updateSlidersFromHex(type)
      )
    }
  } catch (error) {
    console.error(`Error loading color preset:`, error)
  }
}

async function saveImage() {
  const html2canvas = (await import('html2canvas')).default
  const el = document.getElementById('temp-visualization')
  if (!el) return
  const canvas = await html2canvas(el, {
    backgroundColor: '#1a1a2e',
    scale: 8,
  })
  const link = document.createElement('a')
  const modeName =
    currentMode.value === 'temperature' ? 'Temperature' : 'Anomaly'
  link.download = `temperature-visualization-${modeName}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function downloadColors() {
  const colorConfig = {
    low: lowHex.value,
    lowMid: lowMidHex.value,
    mid: midHex.value,
    highMid: highMidHex.value,
    high: highHex.value,
  }
  const jsonString = JSON.stringify(colorConfig, null, 2)
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

const fileInput = ref<HTMLInputElement | null>(null)

function uploadColors() {
  fileInput.value?.click()
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const colorConfig = JSON.parse(e.target?.result as string)
      if (
        colorConfig.low &&
        colorConfig.lowMid &&
        colorConfig.mid &&
        colorConfig.highMid &&
        colorConfig.high
      ) {
        lowHex.value = colorConfig.low
        lowMidHex.value = colorConfig.lowMid
        midHex.value = colorConfig.mid
        highMidHex.value = colorConfig.highMid
        highHex.value = colorConfig.high
        ;(['low', 'lowMid', 'mid', 'highMid', 'high'] as const).forEach(
          (type) => updateSlidersFromHex(type)
        )
      }
    } catch (error) {
      console.error('Error parsing color configuration:', error)
    }
  }
  reader.readAsText(file)
  target.value = ''
}

onMounted(async () => {
  ;(['low', 'lowMid', 'mid', 'highMid', 'high'] as const).forEach((type) =>
    updateSlidersFromHex(type)
  )
  await setMode('temperature')
})

const colorTypes = ['low', 'lowMid', 'mid', 'highMid', 'high'] as const
const colorLabels: Record<(typeof colorTypes)[number], string> = {
  low: 'Low Color',
  lowMid: 'LowMid Color',
  mid: 'Mid Color',
  highMid: 'HighMid Color',
  high: 'High Color',
}
</script>

<template>
  <div class="temp-viz">
    <div class="mode-toggle-bar">
      <button
        :class="{ active: currentMode === 'temperature' }"
        @click="setMode('temperature')"
      >
        Temperature
      </button>
      <button
        :class="{ active: currentMode === 'anomaly' }"
        @click="setMode('anomaly')"
      >
        Anomaly
      </button>
      <button
        :class="{ active: currentMode === 'filtered' }"
        @click="setMode('filtered')"
      >
        Anomaly (3-Month Average)
      </button>
      <button
        :class="{ active: currentMode === 'filtered-5-month' }"
        @click="setMode('filtered-5-month')"
      >
        Anomaly (5-Month Average)
      </button>
    </div>

    <div
      id="temp-visualization"
      class="visualization-container"
      :style="{ gridTemplateColumns: `repeat(${numYears}, 1fr)` }"
    >
      <div
        v-for="(cell, index) in gridCells"
        :key="index"
        class="temp-bar"
        :style="{ backgroundColor: cell.color }"
        :title="cell.title"
      ></div>
    </div>

    <p class="description" v-html="descriptionHtml"></p>

    <div class="button-container">
      <button class="save-button" @click="saveImage">Download Image</button>
      <button class="save-button" @click="downloadColors">
        Download Colors
      </button>
      <button class="save-button" @click="uploadColors">Upload Colors</button>
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        accept=".json"
        @change="handleFileUpload"
      />
    </div>

    <div class="mode-toggle-bar">
      <button @click="loadColorPreset('default')">Default Colors</button>
      <button @click="loadColorPreset('grey')">Greyscale Colors</button>
      <button @click="loadColorPreset('inferno')">Inferno Colors</button>
    </div>

    <div class="color-picker-container">
      <div v-for="type in colorTypes" :key="type" class="color-picker">
        <label>{{ colorLabels[type] }}</label>
        <div class="slider-group">
          <label :for="`${type}-hue`">Hue:</label>
          <input
            type="range"
            :id="`${type}-hue`"
            min="0"
            max="360"
            v-model.number="colorRefs[type].color.value.h"
            @input="updateHexFromSliders(type)"
          />
        </div>
        <div class="slider-group">
          <label :for="`${type}-saturation`">Saturation:</label>
          <input
            type="range"
            :id="`${type}-saturation`"
            min="0"
            max="100"
            v-model.number="colorRefs[type].color.value.s"
            @input="updateHexFromSliders(type)"
          />
        </div>
        <div class="slider-group">
          <label :for="`${type}-value`">Value:</label>
          <input
            type="range"
            :id="`${type}-value`"
            min="0"
            max="100"
            v-model.number="colorRefs[type].color.value.v"
            @input="updateHexFromSliders(type)"
          />
        </div>
        <input
          type="text"
          :id="`${type}-hex-input`"
          class="hex-display"
          v-model="colorRefs[type].hex.value"
          @change="updateSlidersFromHex(type)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.temp-viz {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e0e0e0;
}

.visualization-container {
  display: grid;
  grid-template-rows: repeat(12, 1fr);
  width: 100%;
  max-width: 800px;
  aspect-ratio: 14.01 / 9.77;
  border: 1px solid #333;
  overflow: hidden;
  margin-bottom: 20px;
}

.temp-bar {
  width: 100%;
  height: 100%;
}

.description {
  width: 100%;
  max-width: 800px;
  text-align: center;
  font-size: 1.1em;
  line-height: 1.5;
  color: #b0b0b0;
  padding: 0 20px;
  box-sizing: border-box;
}

.description :deep(strong) {
  color: #ffffff;
}

.description :deep(a) {
  color: #ffffff;
  text-decoration: underline;
}

.description :deep(.data-source-link) {
  font-size: 0.8em;
}

.mode-toggle-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.mode-toggle-bar button {
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  background-color: #333;
  color: #e0e0e0;
  border: 1px solid #555;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.mode-toggle-bar button:hover {
  background-color: #555;
}

.mode-toggle-bar button.active {
  background-color: #007bff;
  border-color: #007bff;
  color: #ffffff;
}

.button-container {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.save-button {
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  background-color: #28a745;
  color: #ffffff;
  border: 1px solid #218838;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #218838;
}

.color-picker-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #2a2a4a;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  justify-content: center;
}

.color-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.color-picker > label {
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 5px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  width: 200px;
}

.slider-group label {
  font-size: 0.9em;
  font-weight: normal;
  margin-bottom: 2px;
}

.slider-group input[type='range'] {
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 5px;
  background: #555;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.slider-group input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
}

.slider-group input[type='range']::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
}

.hex-display {
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #555;
  background-color: #333;
  color: #e0e0e0;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  width: 100px;
  text-align: center;
}

@media (max-width: 600px) {
  .mode-toggle-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .color-picker-container {
    gap: 20px;
  }

  .slider-group {
    width: 150px;
  }
}
</style>
