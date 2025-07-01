package com.chriscartland.solarbattery

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
actual fun AnnualCostChart(
    modifier: Modifier,
    utilityAnnualCosts: List<Double>,
    solarAndBatteryAnnualCosts: List<Double>,
) {
    // Vico is not supported on wasmJs
}
