import { hexToRgb, rgbToHex } from '../public/js/temperature-visualization/colors.js';

describe('color conversion functions', () => {
  describe('rgbToHex', () => {
    it('should correctly convert black from RGB to Hex', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('should correctly convert white from RGB to Hex', () => {
      expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF');
    });

    it('should correctly convert red from RGB to Hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
    });
  });

  describe('hexToRgb', () => {
    it('should correctly convert black from Hex to RGB', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should correctly convert white from Hex to RGB', () => {
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('should correctly convert red from Hex to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });
  });
});
