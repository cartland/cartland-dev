// colors.js
import * as state from './state.js'

export function hexToRgb(hex) {
  if (!hex || !/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return null
  }

  let hexValue = hex.substring(1)

  if (hexValue.length === 3) {
    hexValue =
      hexValue[0] +
      hexValue[0] +
      hexValue[1] +
      hexValue[1] +
      hexValue[2] +
      hexValue[2]
  }

  if (hexValue.length !== 6) {
    return null
  }

  const bigint = parseInt(hexValue, 16)
  if (isNaN(bigint)) {
    return null
  }

  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

export function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function hslToRgb(h, s, l) {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export function rgbToHex(r, g, b) {
  const clamp = (num) => Math.min(Math.max(num, 0), 255)
  r = clamp(r)
  g = clamp(g)
  b = clamp(b)

  return (
    '#' +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  )
}

export function hsvToHsl(h, s, v) {
  s /= 100
  v /= 100
  const l = ((2 - s) * v) / 2
  const newS = l === 0 || l === 1 ? 0 : (s * v) / (l < 0.5 ? l * 2 : 2 - l * 2)
  return { h: h, s: newS * 100, l: l * 100 }
}

export function getColorForValue(value, minVal, maxVal) {
  const normalizedValue = (value - minVal) / (maxVal - minVal)

  const lowHsl = hsvToHsl(state.lowColor.h, state.lowColor.s, state.lowColor.v)
  const lowMidHsl = hsvToHsl(
    state.lowMidColor.h,
    state.lowMidColor.s,
    state.lowMidColor.v
  )
  const midHsl = hsvToHsl(state.midColor.h, state.midColor.s, state.midColor.v)
  const highMidHsl = hsvToHsl(
    state.highMidColor.h,
    state.highMidColor.s,
    state.highMidColor.v
  )
  const highHsl = hsvToHsl(
    state.highColor.h,
    state.highColor.s,
    state.highColor.v
  )

  const colorLowRgb = hslToRgb(lowHsl.h, lowHsl.s, lowHsl.l)
  const colorLowMidRgb = hslToRgb(lowMidHsl.h, lowMidHsl.s, lowMidHsl.l)
  const colorMidRgb = hslToRgb(midHsl.h, midHsl.s, midHsl.l)
  const colorHighMidRgb = hslToRgb(highMidHsl.h, highMidHsl.s, highMidHsl.l)
  const colorHighRgb = hslToRgb(highHsl.h, highHsl.s, highHsl.l)

  let r, g, b

  if (normalizedValue < 0.25) {
    // Transition from Low to LowMid
    const t = normalizedValue * 4 // Scale to 0-1 for this segment
    r = Math.round(colorLowRgb.r + (colorLowMidRgb.r - colorLowRgb.r) * t)
    g = Math.round(colorLowRgb.g + (colorLowMidRgb.g - colorLowRgb.g) * t)
    b = Math.round(colorLowRgb.b + (colorLowMidRgb.b - colorLowRgb.b) * t)
  } else if (normalizedValue < 0.5) {
    // Transition from LowMid to Mid
    const t = (normalizedValue - 0.25) * 4 // Scale to 0-1 for this segment
    r = Math.round(colorLowMidRgb.r + (colorMidRgb.r - colorLowMidRgb.r) * t)
    g = Math.round(colorLowMidRgb.g + (colorMidRgb.g - colorLowMidRgb.g) * t)
    b = Math.round(colorLowMidRgb.b + (colorMidRgb.b - colorLowMidRgb.b) * t)
  } else if (normalizedValue < 0.75) {
    // Transition from Mid to HighMid
    const t = (normalizedValue - 0.5) * 4 // Scale to 0-1 for this segment
    r = Math.round(colorMidRgb.r + (colorHighMidRgb.r - colorMidRgb.r) * t)
    g = Math.round(colorMidRgb.g + (colorHighMidRgb.g - colorMidRgb.g) * t)
    b = Math.round(colorMidRgb.b + (colorHighMidRgb.b - colorMidRgb.b) * t)
  } else {
    // Transition from HighMid to High
    const t = (normalizedValue - 0.75) * 4 // Scale to 0-1 for this segment
    r = Math.round(colorHighMidRgb.r + (colorHighRgb.r - colorHighMidRgb.r) * t)
    g = Math.round(colorHighMidRgb.g + (colorHighRgb.g - colorHighMidRgb.g) * t)
    b = Math.round(colorHighMidRgb.b + (colorHighRgb.b - colorHighMidRgb.b) * t)
  }
  return `rgb(${r}, ${g}, ${b})`
}
