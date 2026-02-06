// main.js
import * as dom from './dom.js'
import * as colors from './colors.js'
import * as state from './state.js'

function updateColor(colorType) {
  const hue = parseInt(document.getElementById(`${colorType}-hue`).value)
  const saturation = parseInt(
    document.getElementById(`${colorType}-saturation`).value
  )
  const value = parseInt(document.getElementById(`${colorType}-value`).value)

  const colorState = { h: hue, s: saturation, v: value }
  switch (colorType) {
    case 'low':
      state.setLowColor(colorState)
      break
    case 'lowMid':
      state.setLowMidColor(colorState)
      break
    case 'mid':
      state.setMidColor(colorState)
      break
    case 'highMid':
      state.setHighMidColor(colorState)
      break
    case 'high':
      state.setHighColor(colorState)
      break
  }

  const hsl = colors.hsvToHsl(hue, saturation, value)
  const rgb = colors.hslToRgb(hsl.h, hsl.s, hsl.l)
  const hex = colors.rgbToHex(rgb.r, rgb.g, rgb.b)
  document.getElementById(`${colorType}-hex-input`).value = hex

  dom.renderVisualization(state.currentMode)
}

function updateSlidersFromHex(colorType) {
  const hexInput = document.getElementById(`${colorType}-hex-input`)
  const hex = hexInput.value

  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
    return
  }

  const rgb = colors.hexToRgb(hex)
  const hsl = colors.rgbToHsl(rgb.r, rgb.g, rgb.b)

  const h = hsl.h
  const s = hsl.s
  const l = hsl.l
  const v = l + (s * Math.min(l, 100 - l)) / 100
  const newS = v === 0 ? 0 : 2 * (1 - l / v) * 100

  document.getElementById(`${colorType}-hue`).value = h
  document.getElementById(`${colorType}-saturation`).value = newS
  document.getElementById(`${colorType}-value`).value = v

  const colorState = { h: h, s: newS, v: v }
  switch (colorType) {
    case 'low':
      state.setLowColor(colorState)
      break
    case 'lowMid':
      state.setLowMidColor(colorState)
      break
    case 'mid':
      state.setMidColor(colorState)
      break
    case 'highMid':
      state.setHighMidColor(colorState)
      break
    case 'high':
      state.setHighColor(colorState)
      break
  }

  dom.renderVisualization(state.currentMode)
}

async function loadColorPreset(presetName) {
  const filePath = `../../global-temperatures/colors-${presetName}.json`
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const colorConfig = await response.json()

    if (
      colorConfig.low &&
      colorConfig.lowMid &&
      colorConfig.mid &&
      colorConfig.highMid &&
      colorConfig.high
    ) {
      document.getElementById('low-hex-input').value = colorConfig.low
      document.getElementById('lowMid-hex-input').value = colorConfig.lowMid
      document.getElementById('mid-hex-input').value = colorConfig.mid
      document.getElementById('highMid-hex-input').value = colorConfig.highMid
      document.getElementById('high-hex-input').value = colorConfig.high

      updateSlidersFromHex('low')
      updateSlidersFromHex('lowMid')
      updateSlidersFromHex('mid')
      updateSlidersFromHex('highMid')
      updateSlidersFromHex('high')
    } else {
      alert('Invalid color configuration file.')
    }
  } catch (error) {
    alert(`Error loading ${presetName} color preset.`)
    console.error(`Error loading color preset:`, error)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('temperature-mode-btn')
    .addEventListener('click', () => dom.renderVisualization('temperature'))
  document
    .getElementById('anomaly-mode-btn')
    .addEventListener('click', () => dom.renderVisualization('anomaly'))
  document
    .getElementById('filtered-mode-btn')
    .addEventListener('click', () => dom.renderVisualization('filtered'))
  document
    .getElementById('filtered-5-month-mode-btn')
    .addEventListener('click', () =>
      dom.renderVisualization('filtered-5-month')
    )

  document
    .getElementById('default-colors-btn')
    .addEventListener('click', () => loadColorPreset('default'))
  document
    .getElementById('greyscale-colors-btn')
    .addEventListener('click', () => loadColorPreset('grey'))
  document
    .getElementById('inferno-colors-btn')
    .addEventListener('click', () => loadColorPreset('inferno'))

  document.getElementById('save-image-btn').addEventListener('click', () => {
    const visualizationContainer = document.getElementById('temp-visualization')
    html2canvas(visualizationContainer, {
      backgroundColor: '#1a1a2e',
      scale: 8,
    }).then((canvas) => {
      const link = document.createElement('a')
      const modeName =
        state.currentMode === 'temperature' ? 'Temperature' : 'Anomaly'
      link.download = `temperature-visualization-${modeName}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    })
  })

  const colorTypes = ['low', 'lowMid', 'mid', 'highMid', 'high']
  colorTypes.forEach((type) => {
    document
      .getElementById(`${type}-hue`)
      .addEventListener('input', () => updateColor(type))
    document
      .getElementById(`${type}-saturation`)
      .addEventListener('input', () => updateColor(type))
    document
      .getElementById(`${type}-value`)
      .addEventListener('input', () => updateColor(type))
    document
      .getElementById(`${type}-hex-input`)
      .addEventListener('change', () => updateSlidersFromHex(type))
  })

  document.getElementById('low-hex-input').value = state.DEFAULT_LOW_COLOR_HEX
  document.getElementById('lowMid-hex-input').value =
    state.DEFAULT_LOW_MID_COLOR_HEX
  document.getElementById('mid-hex-input').value = state.DEFAULT_MID_COLOR_HEX
  document.getElementById('highMid-hex-input').value =
    state.DEFAULT_HIGH_MID_COLOR_HEX
  document.getElementById('high-hex-input').value = state.DEFAULT_HIGH_COLOR_HEX

  updateSlidersFromHex('low')
  updateSlidersFromHex('lowMid')
  updateSlidersFromHex('mid')
  updateSlidersFromHex('highMid')
  updateSlidersFromHex('high')

  document
    .getElementById('download-colors-btn')
    .addEventListener('click', () => {
      const colorConfig = {
        low: document.getElementById('low-hex-input').value,
        lowMid: document.getElementById('lowMid-hex-input').value,
        mid: document.getElementById('mid-hex-input').value,
        highMid: document.getElementById('highMid-hex-input').value,
        high: document.getElementById('high-hex-input').value,
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
    })

  document.getElementById('upload-colors-btn').addEventListener('click', () => {
    document.getElementById('upload-colors-input').click()
  })

  document
    .getElementById('upload-colors-input')
    .addEventListener('change', (event) => {
      const file = event.target.files[0]
      if (!file) {
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const colorConfig = JSON.parse(e.target.result)

          if (
            colorConfig.low &&
            colorConfig.lowMid &&
            colorConfig.mid &&
            colorConfig.highMid &&
            colorConfig.high
          ) {
            document.getElementById('low-hex-input').value = colorConfig.low
            document.getElementById('lowMid-hex-input').value =
              colorConfig.lowMid
            document.getElementById('mid-hex-input').value = colorConfig.mid
            document.getElementById('highMid-hex-input').value =
              colorConfig.highMid
            document.getElementById('high-hex-input').value = colorConfig.high

            updateSlidersFromHex('low')
            updateSlidersFromHex('lowMid')
            updateSlidersFromHex('mid')
            updateSlidersFromHex('highMid')
            updateSlidersFromHex('high')
          } else {
            alert('Invalid color configuration file.')
          }
        } catch (error) {
          alert('Error parsing JSON file.')
          console.error('Error parsing color configuration:', error)
        }
      }
      reader.readAsText(file)

      event.target.value = ''
    })

  dom.renderVisualization('temperature') // Initial render
})
