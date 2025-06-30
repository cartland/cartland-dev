package com.chriscartland.solarbattery

import kotlin.math.pow

data class FinancialInputs(
    val duration: Int = 30,
    val opportunityCostRate: Double = 4.0,
    val initialUtilityCost: Double = 2400.0,
    val utilityCostIncrease: Double = 2.0,
    val solarCostBase: Double = 10200.0,
    val solarLife: Int = 30,
    val batteryCostBase: Double = 14500.0,
    val batteryLife: Int = 10,
    val batteryCostDecrease: Double = 30.0,
    val unavoidableUtilityPercent: Double = 20.0
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
    val solarAndBatteryAnnualCosts: List<Double> = emptyList()
)

object FinancialCalculator {
    fun runAnalysis(inputs: FinancialInputs): CalculationResult {
        val utilityAnnualCosts = mutableListOf<Double>()
        val solarAndBatteryAnnualCosts = mutableListOf<Double>()

        var nominalCumulativeUtility = 0.0
        var nominalCumulativeSolarAndBattery = 0.0
        var opportunityCostUtility = 0.0
        var opportunityCostSolarAndBattery = 0.0

        val costScalingFactor = inputs.initialUtilityCost / 2400.0
        val rate = inputs.opportunityCostRate / 100.0

        for (year in 1..inputs.duration) {
            // Calculate utility costs
            val currentUtilityCost = inputs.initialUtilityCost * (1 + inputs.utilityCostIncrease / 100).pow(year - 1)
            utilityAnnualCosts.add(currentUtilityCost)
            nominalCumulativeUtility += currentUtilityCost

            // Calculate solar and battery costs
            var currentSolarAndBatteryYearCost = 0.0
            if ((year - 1) % inputs.solarLife == 0) {
                currentSolarAndBatteryYearCost += inputs.solarCostBase * costScalingFactor
            }
            if ((year - 1) % inputs.batteryLife == 0) {
                val numBatteriesPreviouslyPurchased = ((year - 1) / inputs.batteryLife)
                currentSolarAndBatteryYearCost += (inputs.batteryCostBase * costScalingFactor) * (1 - inputs.batteryCostDecrease / 100).pow(numBatteriesPreviouslyPurchased)
            }
            val unavoidableCost = currentUtilityCost * (inputs.unavoidableUtilityPercent / 100)
            currentSolarAndBatteryYearCost += unavoidableCost
            solarAndBatteryAnnualCosts.add(currentSolarAndBatteryYearCost)
            nominalCumulativeSolarAndBattery += currentSolarAndBatteryYearCost

            // Calculate opportunity costs
            if (rate > 0) {
                val yearsToGrow = inputs.duration - year
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
            solarAndBatteryAnnualCosts = solarAndBatteryAnnualCosts
        )
    }
}
