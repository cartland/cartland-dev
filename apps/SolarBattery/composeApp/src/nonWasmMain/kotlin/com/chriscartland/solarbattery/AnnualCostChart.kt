package com.chriscartland.solarbattery

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
actual fun AnnualCostChart(
    modifier: Modifier,
    utilityAnnualCosts: List<Double>,
    solarAndBatteryAnnualCosts: List<Double>,
) {
    AnnualCostChartM3(
        modifier = modifier,
        utilityAnnualCosts = utilityAnnualCosts,
        solarAndBatteryAnnualCosts = solarAndBatteryAnnualCosts,
    )
}
