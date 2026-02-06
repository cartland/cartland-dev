package com.chriscartland.temperature

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

class ColorConversionsTest {

    @Test
    fun `hexToRgb parses 6-digit hex`() {
        val rgb = hexToRgb("#3300FF")
        assertNotNull(rgb)
        assertEquals(51, rgb.r)
        assertEquals(0, rgb.g)
        assertEquals(255, rgb.b)
    }

    @Test
    fun `hexToRgb parses 3-digit hex`() {
        val rgb = hexToRgb("#FFF")
        assertNotNull(rgb)
        assertEquals(255, rgb.r)
        assertEquals(255, rgb.g)
        assertEquals(255, rgb.b)
    }

    @Test
    fun `hexToRgb returns null for invalid hex`() {
        assertNull(hexToRgb(""))
        assertNull(hexToRgb("123456"))
        assertNull(hexToRgb("#GGGGGG"))
    }

    @Test
    fun `rgbToHsl converts white`() {
        val hsl = rgbToHsl(255, 255, 255)
        assertEquals(0, hsl.h)
        assertEquals(0, hsl.s)
        assertEquals(100, hsl.l)
    }

    @Test
    fun `rgbToHsl converts black`() {
        val hsl = rgbToHsl(0, 0, 0)
        assertEquals(0, hsl.h)
        assertEquals(0, hsl.s)
        assertEquals(0, hsl.l)
    }

    @Test
    fun `rgbToHsl converts pure red`() {
        val hsl = rgbToHsl(255, 0, 0)
        assertEquals(0, hsl.h)
        assertEquals(100, hsl.s)
        assertEquals(50, hsl.l)
    }

    @Test
    fun `hslToRgb converts white`() {
        val rgb = hslToRgb(0.0, 0.0, 100.0)
        assertEquals(255, rgb.r)
        assertEquals(255, rgb.g)
        assertEquals(255, rgb.b)
    }

    @Test
    fun `hslToRgb converts pure red`() {
        val rgb = hslToRgb(0.0, 100.0, 50.0)
        assertEquals(255, rgb.r)
        assertEquals(0, rgb.g)
        assertEquals(0, rgb.b)
    }

    @Test
    fun `rgbToHex formats correctly`() {
        assertEquals("#FF0000", rgbToHex(255, 0, 0))
        assertEquals("#FFFFFF", rgbToHex(255, 255, 255))
        assertEquals("#000000", rgbToHex(0, 0, 0))
        assertEquals("#3300FF", rgbToHex(51, 0, 255))
    }

    @Test
    fun `rgbToHex clamps values`() {
        assertEquals("#FF00FF", rgbToHex(300, -10, 255))
    }

    @Test
    fun `roundtrip hex to rgb to hsl to rgb to hex for default colors`() {
        // rgbToHsl rounds to integer H/S/L, so roundtrip may lose +-1 per channel.
        // This matches the JS behavior (Math.round in rgbToHsl).
        val defaultColors = listOf("#3300FF", "#50A0C0", "#FFFFFF", "#FFB000", "#990000")
        for (hex in defaultColors) {
            val rgb = hexToRgb(hex)
            assertNotNull(rgb, "hexToRgb failed for $hex")
            val hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
            val rgbBack = hslToRgb(hsl.h.toDouble(), hsl.s.toDouble(), hsl.l.toDouble())
            // Allow +-2 per channel due to integer rounding in HSL
            assertTrue(
                kotlin.math.abs(rgb.r - rgbBack.r) <= 2 &&
                    kotlin.math.abs(rgb.g - rgbBack.g) <= 2 &&
                    kotlin.math.abs(rgb.b - rgbBack.b) <= 2,
                "Roundtrip too far for $hex: original=$rgb, roundtrip=$rgbBack",
            )
        }
    }

    @Test
    fun `hsvToHsl converts correctly`() {
        // Pure white: HSV(0, 0, 100) → HSL(0, 0, 100)
        val white = hsvToHsl(0.0, 0.0, 100.0)
        assertEquals(0.0, white.h)
        assertEquals(0.0, white.s)
        assertEquals(100.0, white.l)
    }

    @Test
    fun `hsvToHsl handles zero saturation and value`() {
        // Black: HSV(0, 0, 0) → HSL(0, 0, 0)
        val black = hsvToHsl(0.0, 0.0, 0.0)
        assertEquals(0.0, black.h)
        assertEquals(0.0, black.s)
        assertEquals(0.0, black.l)
    }
}
