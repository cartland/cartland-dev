package com.chriscartland.solarbattery

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.patrykandpatrick.vico.multiplatform.cartesian.CartesianChart
import com.patrykandpatrick.vico.multiplatform.cartesian.data.CartesianChartModelProducer
import com.patrykandpatrick.vico.multiplatform.cartesian.data.columnSeries

@Composable
fun AnnualCostChart(
    utilityAnnualCosts: List<Double>,
    solarAndBatteryAnnualCosts: List<Double>
) {
    val chartEntryModelProducer = remember(utilityAnnualCosts, solarAndBatteryAnnualCosts) {
        ChartEntryModelProducer(
            utilityAnnualCosts.mapIndexed { index, value -> entryOf(index, value) },
            solarAndBatteryAnnualCosts.mapIndexed { index, value -> entryOf(index, value) }
        )
    }

    ProvideChartStyle(rememberChartStyle()) {
        Chart(
            chart = columnChart(
                columns = listOf(
                    currentChartStyle.columnChart.columns[0].copy(
                        color = MaterialTheme.colorScheme.tertiary
                    ),
                    currentChartStyle.columnChart.columns[1].copy(
                        color = MaterialTheme.colorScheme.primary
                    )
                )
            ),
            chartModelProducer = chartEntryModelProducer,
            startAxis = rememberStartAxis(
                itemPlacer = AxisItemPlacer.Vertical.default(maxItemCount = 6),
                valueFormatter = { value, _ ->
                    "$" + value.toInt().toString()
                }
            ),
            bottomAxis = rememberBottomAxis(
                valueFormatter = { value, _ ->
                    "Year " + (value.toInt() + 1).toString()
                }
            ),
            legend = rememberLegend(),
        )
    }
}

@Composable
private fun rememberLegend(): Legend {
    return horizontalLegend(
        items = listOf(
            legendItem(
                icon = com.patrykandpatrick.vico.compose.component.shape.shader.fromColor(MaterialTheme.colorScheme.tertiary),
                label = textComponent(
                    color = currentChartStyle.axis.axisLabelColor,
                    textSize = 12.dp,
                ),
                labelText = "Utility"
            ),
            legendItem(
                icon = com.patrykandpatrick.vico.compose.component.shape.shader.fromColor(MaterialTheme.colorScheme.primary),
                label = textComponent(
                    color = currentChartStyle.axis.axisLabelColor,
                    textSize = 12.dp,
                ),
                labelText = "Solar + Battery"
            )
        ),
        iconSize = 8.dp,
        iconPadding = 8.dp,
        spacing = 16.dp,
        padding = dimensionsOf(top = 8.dp)
    )
}
