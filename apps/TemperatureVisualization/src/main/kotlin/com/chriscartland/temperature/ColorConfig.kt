package com.chriscartland.temperature

import com.google.gson.Gson
import java.io.File

data class ColorConfigJson(
    val low: String,
    val lowMid: String,
    val mid: String,
    val highMid: String,
    val high: String,
)

data class HsvColor(
    val h: Double,
    val s: Double,
    val v: Double,
)

data class ColorConfig(
    val low: HsvColor,
    val lowMid: HsvColor,
    val mid: HsvColor,
    val highMid: HsvColor,
    val high: HsvColor,
)

fun parseColorConfig(filePath: String): ColorConfig {
    val json = File(filePath).readText()
    val parsed = Gson().fromJson(json, ColorConfigJson::class.java)

    return ColorConfig(
        low = hexToHsv(parsed.low),
        lowMid = hexToHsv(parsed.lowMid),
        mid = hexToHsv(parsed.mid),
        highMid = hexToHsv(parsed.highMid),
        high = hexToHsv(parsed.high),
    )
}

/**
 * Converts a hex color to HSV, matching the JS `updateSlidersFromHex` logic:
 * hex → hexToRgb → rgbToHsl (rounds to int) → HSL-to-HSV formula.
 */
fun hexToHsv(hex: String): HsvColor {
    val rgb = hexToRgb(hex) ?: error("Invalid hex color: $hex")
    val hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

    val h = hsl.h.toDouble()
    val s = hsl.s.toDouble()
    val l = hsl.l.toDouble()

    // HSL to HSV conversion (from main.js updateSlidersFromHex)
    val v = l + (s * minOf(l, 100.0 - l)) / 100.0
    val newS = if (v == 0.0) 0.0 else 2.0 * (1.0 - l / v) * 100.0

    return HsvColor(h = h, s = newS, v = v)
}
