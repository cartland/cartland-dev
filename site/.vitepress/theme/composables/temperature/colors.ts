export interface RGBColor {
  r: number
  g: number
  b: number
}

export interface HSLColor {
  h: number
  s: number
  l: number
}

export interface HSVColor {
  h: number
  s: number
  v: number
}

export function hexToRgb(hex: string): RGBColor | null {
  if (!hex || !/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return null
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
  if (hexValue.length !== 6) return null
  const bigint = parseInt(hexValue, 16)
  if (isNaN(bigint)) return null
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}

export function rgbToHsl(r: number, g: number, b: number): HSLColor {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

export function hslToRgb(h: number, s: number, l: number): RGBColor {
  h /= 360
  s /= 100
  l /= 100
  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hueToRgb(p, q, h + 1 / 3)
    g = hueToRgb(p, q, h)
    b = hueToRgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function hsvToHsl(
  h: number,
  s: number,
  v: number
): { h: number; s: number; l: number } {
  const sNorm = s / 100
  const vNorm = v / 100
  const l = ((2 - sNorm) * vNorm) / 2
  const newS =
    l === 0 || l === 1 ? 0 : (sNorm * vNorm) / (l < 0.5 ? l * 2 : 2 - l * 2)
  return { h, s: newS * 100, l: l * 100 }
}

export interface TemperatureDataPoint {
  year: number
  month: number
  anomaly: number
}

export function getColorForValue(
  value: number,
  minVal: number,
  maxVal: number,
  colorStops: {
    low: HSVColor
    lowMid: HSVColor
    mid: HSVColor
    highMid: HSVColor
    high: HSVColor
  }
): string {
  const normalizedValue = (value - minVal) / (maxVal - minVal)

  const lowHsl = hsvToHsl(colorStops.low.h, colorStops.low.s, colorStops.low.v)
  const lowMidHsl = hsvToHsl(
    colorStops.lowMid.h,
    colorStops.lowMid.s,
    colorStops.lowMid.v
  )
  const midHsl = hsvToHsl(colorStops.mid.h, colorStops.mid.s, colorStops.mid.v)
  const highMidHsl = hsvToHsl(
    colorStops.highMid.h,
    colorStops.highMid.s,
    colorStops.highMid.v
  )
  const highHsl = hsvToHsl(
    colorStops.high.h,
    colorStops.high.s,
    colorStops.high.v
  )

  const colorLowRgb = hslToRgb(lowHsl.h, lowHsl.s, lowHsl.l)
  const colorLowMidRgb = hslToRgb(lowMidHsl.h, lowMidHsl.s, lowMidHsl.l)
  const colorMidRgb = hslToRgb(midHsl.h, midHsl.s, midHsl.l)
  const colorHighMidRgb = hslToRgb(highMidHsl.h, highMidHsl.s, highMidHsl.l)
  const colorHighRgb = hslToRgb(highHsl.h, highHsl.s, highHsl.l)

  let r: number, g: number, b: number

  if (normalizedValue < 0.25) {
    const t = normalizedValue * 4
    r = Math.round(colorLowRgb.r + (colorLowMidRgb.r - colorLowRgb.r) * t)
    g = Math.round(colorLowRgb.g + (colorLowMidRgb.g - colorLowRgb.g) * t)
    b = Math.round(colorLowRgb.b + (colorLowMidRgb.b - colorLowRgb.b) * t)
  } else if (normalizedValue < 0.5) {
    const t = (normalizedValue - 0.25) * 4
    r = Math.round(colorLowMidRgb.r + (colorMidRgb.r - colorLowMidRgb.r) * t)
    g = Math.round(colorLowMidRgb.g + (colorMidRgb.g - colorLowMidRgb.g) * t)
    b = Math.round(colorLowMidRgb.b + (colorMidRgb.b - colorLowMidRgb.b) * t)
  } else if (normalizedValue < 0.75) {
    const t = (normalizedValue - 0.5) * 4
    r = Math.round(colorMidRgb.r + (colorHighMidRgb.r - colorMidRgb.r) * t)
    g = Math.round(colorMidRgb.g + (colorHighMidRgb.g - colorMidRgb.g) * t)
    b = Math.round(colorMidRgb.b + (colorHighMidRgb.b - colorMidRgb.b) * t)
  } else {
    const t = (normalizedValue - 0.75) * 4
    r = Math.round(colorHighMidRgb.r + (colorHighRgb.r - colorHighMidRgb.r) * t)
    g = Math.round(colorHighMidRgb.g + (colorHighRgb.g - colorHighMidRgb.g) * t)
    b = Math.round(colorHighMidRgb.b + (colorHighRgb.b - colorHighMidRgb.b) * t)
  }

  return `rgb(${r}, ${g}, ${b})`
}
