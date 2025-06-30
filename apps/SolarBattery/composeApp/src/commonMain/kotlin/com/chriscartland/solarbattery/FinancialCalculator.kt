package com.chriscartland.solarbattery

import kotlin.math.pow

data class FinancialInputs(
    val duration: String = "30",
    val opportunityCostRate: String = "4.0",
    val initialUtilityCost: String = "2400.0",
    val utilityCostIncrease: String = "2.0",
    val solarCostBase: String = "10200.0",
    val solarLife: String = "30",
    val batteryCostBase: String = "14500.0",
    val batteryLife: String = "10",
    val batteryCostDecrease: String = "30.0",
    val unavoidableUtilityPercent: String = "20.0",
)

data class CalculationResult(
    val totalUtilityCost: Double = 0.0,
    val nominalUtilityCost: Double = 0.0,
    val opportunityCostUtility: Double = 0.0,
    val totalSolarCost: Double = 0.0,
    val nominalSolarCost: Double = 0.0,
    val opportunityCostSolar: Double = 0.0,
    val savings: Double = 0.0,
    val utilityAnnualCosts: List<Double> = emptyList(),
    val solarAndBatteryAnnualCosts: List<Double> = emptyList(),
)

object FinancialCalculator {
    fun validate(inputs: FinancialInputs): Set<String> {
        val errors = mutableSetOf<String>()
        if (inputs.duration.toIntOrNull() == null) errors.add("duration")
        if (inputs.opportunityCostRate.toDoubleOrNull() == null) errors.add("opportunityCostRate")
        if (inputs.initialUtilityCost.toDoubleOrNull() == null) errors.add("initialUtilityCost")
        if (inputs.utilityCostIncrease.toDoubleOrNull() == null) errors.add("utilityCostIncrease")
        if (inputs.solarCostBase.toDoubleOrNull() == null) errors.add("solarCostBase")
        if (inputs.solarLife.toIntOrNull() == null) errors.add("solarLife")
        if (inputs.batteryCostBase.toDoubleOrNull() == null) errors.add("batteryCostBase")
        if (inputs.batteryLife.toIntOrNull() == null) errors.add("batteryLife")
        if (inputs.batteryCostDecrease.toDoubleOrNull() == null) errors.add("batteryCostDecrease")
        if (inputs.unavoidableUtilityPercent.toDoubleOrNull() == null) errors.add("unavoidableUtilityPercent")
        return errors
    }

    fun runAnalysis(inputs: FinancialInputs): CalculationResult {
        val duration = inputs.duration.toInt()
        val opportunityCostRate = inputs.opportunityCostRate.toDouble()
        val initialUtilityCost = inputs.initialUtilityCost.toDouble()
        val utilityCostIncrease = inputs.utilityCostIncrease.toDouble()
        val solarCostBase = inputs.solarCostBase.toDouble()
        val solarLife = inputs.solarLife.toInt()
        val batteryCostBase = inputs.batteryCostBase.toDouble()
        val batteryLife = inputs.batteryLife.toInt()
        val batteryCostDecrease = inputs.batteryCostDecrease.toDouble()
        val unavoidableUtilityPercent = inputs.unavoidableUtilityPercent.toDouble()

        val utilityAnnualCosts = mutableListOf<Double>()
        val solarAndBatteryAnnualCosts = mutableListOf<Double>()

        var nominalCumulativeUtility = 0.0
        var nominalCumulativeSolarAndBattery = 0.0
        var opportunityCostUtility = 0.0
        var opportunityCostSolarAndBattery = 0.0

        val costScalingFactor = initialUtilityCost / 2400.0
        val rate = opportunityCostRate / 100.0

        for (year in 1..duration) {
            // Calculate utility costs
            val currentUtilityCost = initialUtilityCost * (1 + utilityCostIncrease / 100).pow(year - 1)
            utilityAnnualCosts.add(currentUtilityCost)
            nominalCumulativeUtility += currentUtilityCost

            // Calculate solar and battery costs
            var currentSolarAndBatteryYearCost = 0.0
            if ((year - 1) % solarLife == 0) {
                currentSolarAndBatteryYearCost += solarCostBase * costScalingFactor
            }
            if ((year - 1) % batteryLife == 0) {
                val numBatteriesPreviouslyPurchased = ((year - 1) / batteryLife)
                currentSolarAndBatteryYearCost +=
                    (batteryCostBase * costScalingFactor) *
                    (1 - batteryCostDecrease / 100).pow(numBatteriesPreviouslyPurchased)
            }
            val unavoidableCost = currentUtilityCost * (unavoidableUtilityPercent / 100)
            currentSolarAndBatteryYearCost += unavoidableCost
            solarAndBatteryAnnualCosts.add(currentSolarAndBatteryYearCost)
            nominalCumulativeSolarAndBattery += currentSolarAndBatteryYearCost

            // Calculate opportunity costs
            if (rate > 0) {
                val yearsToGrow = duration - year
                opportunityCostUtility += currentUtilityCost * ((1 + rate).pow(yearsToGrow) - 1)
                opportunityCostSolarAndBattery += currentSolarAndBatteryYearCost * ((1 + rate).pow(yearsToGrow) - 1)
            }
        }

        val cumulativeUtility = nominalCumulativeUtility + opportunityCostUtility
        val cumulativeSolarAndBattery = nominalCumulativeSolarAndBattery + opportunityCostSolarAndBattery
        val savings = cumulativeUtility - cumulativeSolarAndBattery

        return CalculationResult(
            totalUtilityCost = cumulativeUtility,
            nominalUtilityCost = nominalCumulativeUtility,
            opportunityCostUtility = opportunityCostUtility,
            totalSolarCost = cumulativeSolarAndBattery,
            nominalSolarCost = nominalCumulativeSolarAndBattery,
            opportunityCostSolar = opportunityCostSolarAndBattery,
            savings = savings,
            utilityAnnualCosts = utilityAnnualCosts,
            solarAndBatteryAnnualCosts = solarAndBatteryAnnualCosts,
        )
    }
}
