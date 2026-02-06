package com.chriscartland.temperature

import kotlin.math.roundToInt

fun getColorForValue(
    value: Double,
    minVal: Double,
    maxVal: Double,
    colorConfig: ColorConfig,
): RgbColor {
    val normalizedValue = (value - minVal) / (maxVal - minVal)

    fun hsvToRgb(hsv: HsvColor): RgbColor {
        val hsl = hsvToHsl(hsv.h, hsv.s, hsv.v)
        return hslToRgb(hsl.h, hsl.s, hsl.l)
    }

    val stops = listOf(
        0.00 to hsvToRgb(colorConfig.low),
        0.25 to hsvToRgb(colorConfig.lowMid),
        0.50 to hsvToRgb(colorConfig.mid),
        0.75 to hsvToRgb(colorConfig.highMid),
        1.00 to hsvToRgb(colorConfig.high),
    )

    // Find the segment containing normalizedValue
    val segIndex = stops.indexOfLast { it.first <= normalizedValue }.coerceIn(0, stops.size - 2)
    val (startThreshold, startColor) = stops[segIndex]
    val (endThreshold, endColor) = stops[segIndex + 1]
    val t = ((normalizedValue - startThreshold) / (endThreshold - startThreshold)).coerceIn(0.0, 1.0)

    return RgbColor(
        r = (startColor.r + (endColor.r - startColor.r) * t).roundToInt(),
        g = (startColor.g + (endColor.g - startColor.g) * t).roundToInt(),
        b = (startColor.b + (endColor.b - startColor.b) * t).roundToInt(),
    )
}
