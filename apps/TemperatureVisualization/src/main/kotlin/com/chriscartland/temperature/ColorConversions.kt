package com.chriscartland.temperature

import kotlin.math.roundToInt

data class RgbColor(val r: Int, val g: Int, val b: Int)

data class HslColor(val h: Int, val s: Int, val l: Int)

data class HslColorFloat(val h: Double, val s: Double, val l: Double)

fun hexToRgb(hex: String): RgbColor? {
    if (hex.isBlank() || !Regex("^#([A-Fa-f0-9]{3}){1,2}$").matches(hex)) {
        return null
    }

    var hexValue = hex.substring(1)

    if (hexValue.length == 3) {
        hexValue = "${hexValue[0]}${hexValue[0]}${hexValue[1]}${hexValue[1]}${hexValue[2]}${hexValue[2]}"
    }

    if (hexValue.length != 6) {
        return null
    }

    val bigint = hexValue.toLongOrNull(16) ?: return null

    val r = ((bigint shr 16) and 255).toInt()
    val g = ((bigint shr 8) and 255).toInt()
    val b = (bigint and 255).toInt()
    return RgbColor(r, g, b)
}

fun rgbToHsl(r: Int, g: Int, b: Int): HslColor {
    val rNorm = r / 255.0
    val gNorm = g / 255.0
    val bNorm = b / 255.0

    val maxVal = maxOf(rNorm, gNorm, bNorm)
    val minVal = minOf(rNorm, gNorm, bNorm)
    var h: Double
    val s: Double
    val l = (maxVal + minVal) / 2.0

    if (maxVal == minVal) {
        h = 0.0
        s = 0.0
    } else {
        val d = maxVal - minVal
        s = if (l > 0.5) d / (2.0 - maxVal - minVal) else d / (maxVal + minVal)
        h = when (maxVal) {
            rNorm -> (gNorm - bNorm) / d + (if (gNorm < bNorm) 6.0 else 0.0)
            gNorm -> (bNorm - rNorm) / d + 2.0
            bNorm -> (rNorm - gNorm) / d + 4.0
            else -> 0.0
        }
        h /= 6.0
    }

    return HslColor(
        h = (h * 360.0).roundToInt(),
        s = (s * 100.0).roundToInt(),
        l = (l * 100.0).roundToInt(),
    )
}

fun hslToRgb(h: Double, s: Double, l: Double): RgbColor {
    val hNorm = h / 360.0
    val sNorm = s / 100.0
    val lNorm = l / 100.0
    val r: Double
    val g: Double
    val b: Double

    if (sNorm == 0.0) {
        r = lNorm
        g = lNorm
        b = lNorm
    } else {
        fun hue2rgb(p: Double, q: Double, tIn: Double): Double {
            var t = tIn
            if (t < 0.0) t += 1.0
            if (t > 1.0) t -= 1.0
            if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t
            if (t < 1.0 / 2.0) return q
            if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0
            return p
        }

        val q = if (lNorm < 0.5) lNorm * (1.0 + sNorm) else lNorm + sNorm - lNorm * sNorm
        val p = 2.0 * lNorm - q
        r = hue2rgb(p, q, hNorm + 1.0 / 3.0)
        g = hue2rgb(p, q, hNorm)
        b = hue2rgb(p, q, hNorm - 1.0 / 3.0)
    }

    return RgbColor(
        r = (r * 255.0).roundToInt(),
        g = (g * 255.0).roundToInt(),
        b = (b * 255.0).roundToInt(),
    )
}

fun rgbToHex(r: Int, g: Int, b: Int): String {
    val rc = r.coerceIn(0, 255)
    val gc = g.coerceIn(0, 255)
    val bc = b.coerceIn(0, 255)

    return "#" + ((1 shl 24) + (rc shl 16) + (gc shl 8) + bc)
        .toString(16)
        .substring(1)
        .uppercase()
}

fun hsvToHsl(h: Double, s: Double, v: Double): HslColorFloat {
    val sNorm = s / 100.0
    val vNorm = v / 100.0
    val l = ((2.0 - sNorm) * vNorm) / 2.0
    val newS = if (l == 0.0 || l == 1.0) {
        0.0
    } else {
        (sNorm * vNorm) / (if (l < 0.5) l * 2.0 else 2.0 - l * 2.0)
    }
    return HslColorFloat(h = h, s = newS * 100.0, l = l * 100.0)
}
