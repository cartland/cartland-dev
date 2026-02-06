package com.chriscartland.temperature

import java.io.File

data class TemperatureRecord(
    val year: Int,
    val month: Int,
    val anomaly: Double,
)

fun parseCsv(filePath: String): List<TemperatureRecord> {
    val lines = File(filePath).readLines()
    val dataLines = lines.filter { line ->
        !line.startsWith("#") && line.contains(",")
    }

    return dataLines.mapNotNull { line ->
        val parts = line.split(",")
        if (parts.size < 2) return@mapNotNull null
        val dateStr = parts[0].trim()
        val anomalyStr = parts[1].trim()

        if (dateStr.length < 6) return@mapNotNull null
        val year = dateStr.substring(0, 4).toIntOrNull() ?: return@mapNotNull null
        val month = dateStr.substring(4, 6).toIntOrNull() ?: return@mapNotNull null
        val anomaly = anomalyStr.toDoubleOrNull() ?: return@mapNotNull null

        TemperatureRecord(year, month, anomaly)
    }
}
