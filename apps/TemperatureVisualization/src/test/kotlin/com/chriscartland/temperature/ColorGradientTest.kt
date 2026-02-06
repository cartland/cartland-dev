package com.chriscartland.temperature

import kotlin.test.Test
import kotlin.test.assertEquals

class ColorGradientTest {

    private val defaultColorConfig = parseColorConfigFromHexValues(
        low = "#3300FF",
        lowMid = "#50A0C0",
        mid = "#FFFFFF",
        highMid = "#FFB000",
        high = "#990000",
    )

    @Test
    fun `gradient at 0 returns low color`() {
        val color = getColorForValue(0.0, 0.0, 1.0, defaultColorConfig)
        val lowRgb = getExpectedEndpointRgb(defaultColorConfig.low)
        assertEquals(lowRgb.r, color.r)
        assertEquals(lowRgb.g, color.g)
        assertEquals(lowRgb.b, color.b)
    }

    @Test
    fun `gradient at 0_25 returns lowMid color`() {
        // At exactly 0.25, normalizedValue < 0.25 is false, so it falls into the second segment
        // with t = 0, giving the lowMid color
        val color = getColorForValue(0.25, 0.0, 1.0, defaultColorConfig)
        val lowMidRgb = getExpectedEndpointRgb(defaultColorConfig.lowMid)
        assertEquals(lowMidRgb.r, color.r)
        assertEquals(lowMidRgb.g, color.g)
        assertEquals(lowMidRgb.b, color.b)
    }

    @Test
    fun `gradient at 0_5 returns mid color`() {
        val color = getColorForValue(0.5, 0.0, 1.0, defaultColorConfig)
        val midRgb = getExpectedEndpointRgb(defaultColorConfig.mid)
        assertEquals(midRgb.r, color.r)
        assertEquals(midRgb.g, color.g)
        assertEquals(midRgb.b, color.b)
    }

    @Test
    fun `gradient at 0_75 returns highMid color`() {
        val color = getColorForValue(0.75, 0.0, 1.0, defaultColorConfig)
        val highMidRgb = getExpectedEndpointRgb(defaultColorConfig.highMid)
        assertEquals(highMidRgb.r, color.r)
        assertEquals(highMidRgb.g, color.g)
        assertEquals(highMidRgb.b, color.b)
    }

    @Test
    fun `gradient at 1 returns high color`() {
        val color = getColorForValue(1.0, 0.0, 1.0, defaultColorConfig)
        val highRgb = getExpectedEndpointRgb(defaultColorConfig.high)
        assertEquals(highRgb.r, color.r)
        assertEquals(highRgb.g, color.g)
        assertEquals(highRgb.b, color.b)
    }

    @Test
    fun `gradient with custom range`() {
        // minVal=10, maxVal=30, value=10 → normalized=0 → low color
        val color = getColorForValue(10.0, 10.0, 30.0, defaultColorConfig)
        val lowRgb = getExpectedEndpointRgb(defaultColorConfig.low)
        assertEquals(lowRgb.r, color.r)
        assertEquals(lowRgb.g, color.g)
        assertEquals(lowRgb.b, color.b)
    }

    /**
     * Compute expected RGB for an HSV endpoint, matching the JS path:
     * HSV → hsvToHsl → hslToRgb.
     */
    private fun getExpectedEndpointRgb(hsv: HsvColor): RgbColor {
        val hsl = hsvToHsl(hsv.h, hsv.s, hsv.v)
        return hslToRgb(hsl.h, hsl.s, hsl.l)
    }
}

/**
 * Helper to create a ColorConfig from hex values (same path as parseColorConfig).
 */
fun parseColorConfigFromHexValues(
    low: String,
    lowMid: String,
    mid: String,
    highMid: String,
    high: String,
): ColorConfig {
    return ColorConfig(
        low = hexToHsv(low),
        lowMid = hexToHsv(lowMid),
        mid = hexToHsv(mid),
        highMid = hexToHsv(highMid),
        high = hexToHsv(high),
    )
}
