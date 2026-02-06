package com.chriscartland.temperature

import java.awt.Color
import java.awt.image.BufferedImage
import kotlin.math.roundToInt

private const val ASPECT_WIDTH = 14.01
private const val ASPECT_HEIGHT = 9.77
private const val BACKGROUND_COLOR = 0x1a1a2e
private const val BORDER_COLOR = 0x333333
private const val MISSING_COLOR = 0x333333

fun renderGrid(
    data: List<TemperatureRecord>,
    baseline: BaselineData,
    colorConfig: ColorConfig,
    mode: String,
    baseWidth: Int,
    scale: Int,
): BufferedImage {
    val dataToVisualize = if (mode == "temperature") {
        data.map { it.anomaly + (baseline.monthlyTemps[it.month] ?: 0.0) }
    } else {
        data.map { it.anomaly }
    }

    val minVal = dataToVisualize.min()
    val maxVal = dataToVisualize.max()

    val startYear = data.first().year
    val endYear = data.last().year
    val numYears = endYear - startYear + 1

    val baseHeight = (baseWidth.toDouble() * ASPECT_HEIGHT / ASPECT_WIDTH).roundToInt()
    val totalWidth = baseWidth * scale
    val totalHeight = baseHeight * scale
    val borderWidth = 1 * scale

    val contentWidth = totalWidth - 2 * borderWidth
    val contentHeight = totalHeight - 2 * borderWidth

    // Build lookup map: year -> (month -> index in dataToVisualize)
    val monthlyDataMap = mutableMapOf<Int, MutableMap<Int, Int>>()
    data.forEachIndexed { index, record ->
        monthlyDataMap.getOrPut(record.year) { mutableMapOf() }[record.month] = index
    }

    val image = BufferedImage(totalWidth, totalHeight, BufferedImage.TYPE_INT_RGB)
    val g2d = image.createGraphics()

    // Fill background
    g2d.color = Color(BACKGROUND_COLOR)
    g2d.fillRect(0, 0, totalWidth, totalHeight)

    // Draw border
    g2d.color = Color(BORDER_COLOR)
    g2d.fillRect(0, 0, totalWidth, totalHeight)

    // Fill inner content area with background
    g2d.color = Color(BACKGROUND_COLOR)
    g2d.fillRect(borderWidth, borderWidth, contentWidth, contentHeight)

    // Render cells: month 1→12 (rows), year startYear→endYear (columns)
    for (month in 1..12) {
        val row = month - 1
        val rowY = borderWidth + rowStart(row, contentHeight)
        val rowH = rowEnd(row, contentHeight) - rowStart(row, contentHeight)

        for (year in startYear..endYear) {
            val col = year - startYear
            val colX = borderWidth + colStart(col, contentWidth, numYears)
            val colW = colEnd(col, contentWidth, numYears) - colStart(col, contentWidth, numYears)

            val dataIndex = monthlyDataMap[year]?.get(month)
            if (dataIndex != null) {
                val value = dataToVisualize[dataIndex]
                val rgb = getColorForValue(value, minVal, maxVal, colorConfig)
                g2d.color = Color(rgb.r, rgb.g, rgb.b)
            } else {
                g2d.color = Color(MISSING_COLOR)
            }

            g2d.fillRect(colX, rowY, colW, rowH)
        }
    }

    g2d.dispose()
    return image
}

private fun colStart(col: Int, contentWidth: Int, numYears: Int): Int {
    return (col.toDouble() * contentWidth / numYears).roundToInt()
}

private fun colEnd(col: Int, contentWidth: Int, numYears: Int): Int {
    return ((col + 1).toDouble() * contentWidth / numYears).roundToInt()
}

private fun rowStart(row: Int, contentHeight: Int): Int {
    return (row.toDouble() * contentHeight / 12).roundToInt()
}

private fun rowEnd(row: Int, contentHeight: Int): Int {
    return ((row + 1).toDouble() * contentHeight / 12).roundToInt()
}
