package com.chriscartland.temperature

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import java.io.File

data class BaselineJson(
    val monthlyAverages: List<MonthlyAverage>,
    val annualAverage: AnnualAverage,
)

data class MonthlyAverage(
    val month: String,
    val landAndOceanC: Double,
)

data class AnnualAverage(
    val landAndOceanC: Double,
)

data class BaselineData(
    val monthlyTemps: Map<Int, Double>,
    val annualAverageC: Double,
)

fun parseBaseline(filePath: String): BaselineData {
    val json = File(filePath).readText()
    val parsed = Gson().fromJson(json, BaselineJson::class.java)

    val monthlyTemps = mutableMapOf<Int, Double>()
    parsed.monthlyAverages.forEachIndexed { index, avg ->
        monthlyTemps[index + 1] = avg.landAndOceanC
    }

    return BaselineData(
        monthlyTemps = monthlyTemps,
        annualAverageC = parsed.annualAverage.landAndOceanC,
    )
}
