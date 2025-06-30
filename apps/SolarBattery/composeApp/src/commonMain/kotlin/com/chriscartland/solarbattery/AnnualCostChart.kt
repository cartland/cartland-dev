package com.chriscartland.solarbattery

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.patrykandpatrick.vico.compose.axis.horizontal.rememberBottomAxis
import com.patrykandpatrick.vico.compose.axis.vertical.rememberStartAxis
import com.patrykandpatrick.vico.compose.chart.Chart
import com.patrykandpatrick.vico.compose.chart.column.columnChart
import com.patrykandpatrick.vico.compose.component.shape.roundedCornerShape
import com.patrykandpatrick.vico.compose.component.textComponent
import com.patrykandpatrick.vico.compose.dimensions.dimensionsOf
import com.patrykandpatrick.vico.compose.legend.horizontal.horizontalLegend
import com.patrykandpatrick.vico.compose.legend.legendItem
import com.patrykandpatrick.vico.compose.style.ProvideChartStyle
import com.patrykandpatrick.vico.core.axis.AxisItemPlacer
import com.patrykandpatrick.vico.core.chart.legend.Legend
import com.patrykandpatrick.vico.core.component.shape.Shapes
import com.patrykandpatrick.vico.core.entry.ChartEntryModelProducer
import com.patrykandpatrick.vico.core.entry.entryOf

@Composable
fun AnnualCostChart(
    utilityAnnualCosts: List<Double>,
    solarAndBatteryAnnualCosts: List<Double>
) {
    val chartEntryModelProducer = remember(utilityAnnualCosts, solarAndBatteryAnnualCosts) {
        ChartEntryModelProducer(
            (utilityAnnualCosts.indices).map { i ->
                entryOf(i, utilityAnnualCosts[i])
            },
            (solarAndBatteryAnnualCosts.indices).map { i ->
                entryOf(i, solarAndBatteryAnnualCosts[i])
            }
        )
    }

    ProvideChartStyle {
        Chart(
            chart = columnChart(
                columns = listOf(
                    com.patrykandpatrick.vico.compose.style.currentChartStyle.columnChart.columns[0].copy(
                        color = Color.Blue
                    ),
                    com.patrykandpatrick.vico.compose.style.currentChartStyle.columnChart.columns[1].copy(
                        color = Color.Green
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
                icon = com.patrykandpatrick.vico.compose.component.shape.shader.fromColor(Color.Blue),
                label = textComponent(
                    color = com.patrykandpatrick.vico.compose.style.currentChartStyle.axis.axisLabelColor,
                    textSize = 12.dp,
                ),
                labelText = "Utility"
            ),
            legendItem(
                icon = com.patrykandpatrick.vico.compose.component.shape.shader.fromColor(Color.Green),
                label = textComponent(
                    color = com.patrykandpatrick.vico.compose.style.currentChartStyle.axis.axisLabelColor,
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
