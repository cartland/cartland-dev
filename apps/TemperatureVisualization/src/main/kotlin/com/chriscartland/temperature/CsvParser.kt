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

    val records = mutableListOf<TemperatureRecord>()
    for (line in dataLines) {
        val parts = line.split(",")
        if (parts.size < 2) continue
        val dateStr = parts[0].trim()
        val anomalyStr = parts[1].trim()

        if (dateStr.length < 6) continue
        val year = dateStr.substring(0, 4).toIntOrNull() ?: continue
        val month = dateStr.substring(4, 6).toIntOrNull() ?: continue
        val anomaly = anomalyStr.toDoubleOrNull() ?: continue

        records.add(TemperatureRecord(year, month, anomaly))
    }
    return records
}
