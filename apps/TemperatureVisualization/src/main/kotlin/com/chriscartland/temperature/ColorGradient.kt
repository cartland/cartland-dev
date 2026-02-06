package com.chriscartland.temperature

import kotlin.math.roundToInt

fun getColorForValue(
    value: Double,
    minVal: Double,
    maxVal: Double,
    colorConfig: ColorConfig,
): RgbColor {
    val normalizedValue = (value - minVal) / (maxVal - minVal)

    val lowHsl = hsvToHsl(colorConfig.low.h, colorConfig.low.s, colorConfig.low.v)
    val lowMidHsl = hsvToHsl(colorConfig.lowMid.h, colorConfig.lowMid.s, colorConfig.lowMid.v)
    val midHsl = hsvToHsl(colorConfig.mid.h, colorConfig.mid.s, colorConfig.mid.v)
    val highMidHsl = hsvToHsl(colorConfig.highMid.h, colorConfig.highMid.s, colorConfig.highMid.v)
    val highHsl = hsvToHsl(colorConfig.high.h, colorConfig.high.s, colorConfig.high.v)

    val colorLowRgb = hslToRgb(lowHsl.h, lowHsl.s, lowHsl.l)
    val colorLowMidRgb = hslToRgb(lowMidHsl.h, lowMidHsl.s, lowMidHsl.l)
    val colorMidRgb = hslToRgb(midHsl.h, midHsl.s, midHsl.l)
    val colorHighMidRgb = hslToRgb(highMidHsl.h, highMidHsl.s, highMidHsl.l)
    val colorHighRgb = hslToRgb(highHsl.h, highHsl.s, highHsl.l)

    val r: Int
    val g: Int
    val b: Int

    if (normalizedValue < 0.25) {
        val t = normalizedValue * 4.0
        r = (colorLowRgb.r + (colorLowMidRgb.r - colorLowRgb.r) * t).roundToInt()
        g = (colorLowRgb.g + (colorLowMidRgb.g - colorLowRgb.g) * t).roundToInt()
        b = (colorLowRgb.b + (colorLowMidRgb.b - colorLowRgb.b) * t).roundToInt()
    } else if (normalizedValue < 0.5) {
        val t = (normalizedValue - 0.25) * 4.0
        r = (colorLowMidRgb.r + (colorMidRgb.r - colorLowMidRgb.r) * t).roundToInt()
        g = (colorLowMidRgb.g + (colorMidRgb.g - colorLowMidRgb.g) * t).roundToInt()
        b = (colorLowMidRgb.b + (colorMidRgb.b - colorLowMidRgb.b) * t).roundToInt()
    } else if (normalizedValue < 0.75) {
        val t = (normalizedValue - 0.5) * 4.0
        r = (colorMidRgb.r + (colorHighMidRgb.r - colorMidRgb.r) * t).roundToInt()
        g = (colorMidRgb.g + (colorHighMidRgb.g - colorMidRgb.g) * t).roundToInt()
        b = (colorMidRgb.b + (colorHighMidRgb.b - colorMidRgb.b) * t).roundToInt()
    } else {
        val t = (normalizedValue - 0.75) * 4.0
        r = (colorHighMidRgb.r + (colorHighRgb.r - colorHighMidRgb.r) * t).roundToInt()
        g = (colorHighMidRgb.g + (colorHighRgb.g - colorHighMidRgb.g) * t).roundToInt()
        b = (colorHighMidRgb.b + (colorHighRgb.b - colorHighMidRgb.b) * t).roundToInt()
    }

    return RgbColor(r, g, b)
}
