// Color conversion helpers and the five-stop gradient used by the
// temperature visualization. Ported from the v2 implementation.

export function hexToRgb(hex) {
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

export function rgbToHsl(r, g, b) {
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

function hueToRgb(p, q, t) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

export function hslToRgb(h, s, l) {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

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

export function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)))
  const toHex = (v) => clamp(v).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

export function hsvToHsl(h, s, v) {
  const sNorm = s / 100
  const vNorm = v / 100
  const l = ((2 - sNorm) * vNorm) / 2
  const newS =
    l === 0 || l === 1 ? 0 : (sNorm * vNorm) / (l < 0.5 ? l * 2 : 2 - l * 2)
  return { h, s: newS * 100, l: l * 100 }
}

export function hexToHsv(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const v = hsl.l + (hsl.s * Math.min(hsl.l, 100 - hsl.l)) / 100
  const s = v === 0 ? 0 : 2 * (1 - hsl.l / v) * 100
  return { h: hsl.h, s, v }
}

export function hsvToHex(h, s, v) {
  const hsl = hsvToHsl(h, s, v)
  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

// Interpolate between the five HSV color stops for a value in
// [minVal, maxVal] and return a CSS rgb() string.
export function getColorForValue(value, minVal, maxVal, colorStops) {
  const normalizedValue = (value - minVal) / (maxVal - minVal)

  const toRgb = (stop) => {
    const hsl = hsvToHsl(stop.h, stop.s, stop.v)
    return hslToRgb(hsl.h, hsl.s, hsl.l)
  }

  const low = toRgb(colorStops.low)
  const lowMid = toRgb(colorStops.lowMid)
  const mid = toRgb(colorStops.mid)
  const highMid = toRgb(colorStops.highMid)
  const high = toRgb(colorStops.high)

  const mix = (a, b, t) => ({
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  })

  let rgb
  if (normalizedValue < 0.25) {
    rgb = mix(low, lowMid, normalizedValue * 4)
  } else if (normalizedValue < 0.5) {
    rgb = mix(lowMid, mid, (normalizedValue - 0.25) * 4)
  } else if (normalizedValue < 0.75) {
    rgb = mix(mid, highMid, (normalizedValue - 0.5) * 4)
  } else {
    rgb = mix(highMid, high, (normalizedValue - 0.75) * 4)
  }

  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}
