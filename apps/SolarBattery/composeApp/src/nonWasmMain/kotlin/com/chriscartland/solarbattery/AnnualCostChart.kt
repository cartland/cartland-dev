package com.chriscartland.solarbattery

import androidx.compose.runtime.Composable

@Composable
actual fun AnnualCostChart(
    utilityAnnualCosts: List<Double>,
    solarAndBatteryAnnualCosts: List<Double>,
) {
    AnnualCostChartM3(
        utilityAnnualCosts = utilityAnnualCosts,
        solarAndBatteryAnnualCosts = solarAndBatteryAnnualCosts,
    )
}
