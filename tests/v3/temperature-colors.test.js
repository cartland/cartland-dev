import {
  hexToRgb,
  rgbToHex,
  hexToHsv,
  hsvToHex,
  getColorForValue,
} from '../../v3/src/scripts/temperature/colors.js'

describe('v3 temperature color helpers', () => {
  it('converts RGB to hex, clamping out-of-range values', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000')
    expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF')
    expect(rgbToHex(300, -10, 128)).toBe('#FF0080')
  })

  it('converts hex to RGB, including shorthand, and rejects invalid input', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 })
    expect(hexToRgb('not-a-color')).toBeNull()
    expect(hexToRgb('')).toBeNull()
  })

  it('round-trips hex through HSV within rounding tolerance', () => {
    // The HSL intermediate rounds to integers (matching the original
    // implementation), so allow a small per-channel delta.
    for (const hex of ['#3300FF', '#FFB000', '#990000', '#FFFFFF']) {
      const hsv = hexToHsv(hex)
      expect(hsv).not.toBeNull()
      const original = hexToRgb(hex)
      const roundTripped = hexToRgb(hsvToHex(hsv.h, hsv.s, hsv.v))
      expect(Math.abs(roundTripped.r - original.r)).toBeLessThanOrEqual(3)
      expect(Math.abs(roundTripped.g - original.g)).toBeLessThanOrEqual(3)
      expect(Math.abs(roundTripped.b - original.b)).toBeLessThanOrEqual(3)
    }
  })

  it('interpolates the five-stop gradient across the value range', () => {
    const stops = {
      low: hexToHsv('#3300FF'),
      lowMid: hexToHsv('#50A0C0'),
      mid: hexToHsv('#FFFFFF'),
      highMid: hexToHsv('#FFB000'),
      high: hexToHsv('#990000'),
    }
    // Endpoints hit the low and high stops exactly.
    expect(getColorForValue(0, 0, 1, stops)).toBe('rgb(51, 0, 255)')
    expect(getColorForValue(1, 0, 1, stops)).toBe('rgb(153, 0, 0)')
    // The midpoint hits the middle stop.
    expect(getColorForValue(0.5, 0, 1, stops)).toBe('rgb(255, 255, 255)')
  })
})
