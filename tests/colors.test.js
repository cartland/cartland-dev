import {
  hexToRgb,
  rgbToHex,
} from '../public/js/temperature-visualization/colors.js'

describe('color conversion functions', () => {
  describe('rgbToHex', () => {
    it.each([
      { r: 0, g: 0, b: 0, name: 'black', expected: '#000000' },
      { r: 255, g: 255, b: 255, name: 'white', expected: '#FFFFFF' },
      { r: 255, g: 0, b: 0, name: 'red', expected: '#FF0000' },
    ])(
      'should correctly convert $name from RGB to Hex',
      ({ r, g, b, expected }) => {
        expect(rgbToHex(r, g, b)).toBe(expected)
      }
    )

    it.each([
      { r: 300, g: 0, b: 0, name: 'over max value', expected: '#FF0000' },
      { r: -10, g: 0, b: 0, name: 'under min value', expected: '#000000' },
      { r: 128, g: 300, b: -10, name: 'mixed values', expected: '#80FF00' },
    ])(
      'should clamp values outside of 0-255 range for $name',
      ({ r, g, b, expected }) => {
        expect(rgbToHex(r, g, b)).toBe(expected)
      }
    )
  })

  describe('hexToRgb', () => {
    it.each([
      { hex: '#000000', name: 'black', expected: { r: 0, g: 0, b: 0 } },
      { hex: '#FFFFFF', name: 'white', expected: { r: 255, g: 255, b: 255 } },
      { hex: '#FF0000', name: 'red', expected: { r: 255, g: 0, b: 0 } },
    ])(
      'should correctly convert $name from Hex to RGB',
      ({ hex, expected }) => {
        expect(hexToRgb(hex)).toEqual(expected)
      }
    )

    it.each([
      { hex: '#F00', name: 'shorthand red', expected: { r: 255, g: 0, b: 0 } },
      {
        hex: '#0F0',
        name: 'shorthand green',
        expected: { r: 0, g: 255, b: 0 },
      },
      { hex: '#00F', name: 'shorthand blue', expected: { r: 0, g: 0, b: 255 } },
      {
        hex: '#FFF',
        name: 'shorthand white',
        expected: { r: 255, g: 255, b: 255 },
      },
    ])(
      'should correctly convert $name from shorthand Hex to RGB',
      ({ hex, expected }) => {
        expect(hexToRgb(hex)).toEqual(expected)
      }
    )

    it.each([
      { hex: '#12345G', name: 'invalid hex character' },
      { hex: 'not-a-color', name: 'not a hex string' },
      { hex: '#12345', name: 'too short hex string' },
    ])('should return null for invalid hex: $name', ({ hex }) => {
      expect(hexToRgb(hex)).toBeNull()
    })
  })
})
