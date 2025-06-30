package com.chriscartland.solarbattery

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.patrykandpatrick.vico.multiplatform.cartesian.CartesianChartHost
import com.patrykandpatrick.vico.multiplatform.cartesian.Zoom
import com.patrykandpatrick.vico.multiplatform.cartesian.axis.HorizontalAxis
import com.patrykandpatrick.vico.multiplatform.cartesian.axis.VerticalAxis
import com.patrykandpatrick.vico.multiplatform.cartesian.data.CartesianChartModelProducer
import com.patrykandpatrick.vico.multiplatform.cartesian.data.CartesianValueFormatter
import com.patrykandpatrick.vico.multiplatform.cartesian.data.columnSeries
import com.patrykandpatrick.vico.multiplatform.cartesian.layer.ColumnCartesianLayer
import com.patrykandpatrick.vico.multiplatform.cartesian.layer.rememberColumnCartesianLayer
import com.patrykandpatrick.vico.multiplatform.cartesian.rememberCartesianChart
import com.patrykandpatrick.vico.multiplatform.cartesian.rememberVicoZoomState
import com.patrykandpatrick.vico.multiplatform.common.Fill
import com.patrykandpatrick.vico.multiplatform.common.Insets
import com.patrykandpatrick.vico.multiplatform.common.LegendItem
import com.patrykandpatrick.vico.multiplatform.common.component.ShapeComponent
import com.patrykandpatrick.vico.multiplatform.common.component.rememberLineComponent
import com.patrykandpatrick.vico.multiplatform.common.component.rememberTextComponent
import com.patrykandpatrick.vico.multiplatform.common.data.ExtraStore
import com.patrykandpatrick.vico.multiplatform.common.rememberHorizontalLegend
import com.patrykandpatrick.vico.multiplatform.common.shape.CorneredShape

private val LegendLabelKey = ExtraStore.Key<List<String>>()

@Composable
fun AnnualCostChartM3(
    utilityAnnualCosts: List<Double>,
    solarAndBatteryAnnualCosts: List<Double>,
) {
    if (utilityAnnualCosts.isEmpty() || solarAndBatteryAnnualCosts.isEmpty()) {
        // Display nothing if there is no data
        return
    }
    val modelProducer = remember { CartesianChartModelProducer() }
    LaunchedEffect(utilityAnnualCosts, solarAndBatteryAnnualCosts) {
        modelProducer.runTransaction {
            columnSeries {
                series(utilityAnnualCosts)
                series(solarAndBatteryAnnualCosts)
            }
            extras { it[LegendLabelKey] = listOf("Utility", "Solar + Battery") }
        }
    }
    val columnColors = listOf(MaterialTheme.colorScheme.tertiary, MaterialTheme.colorScheme.primary)
    val textComponent = rememberTextComponent(
        style = MaterialTheme.typography.labelSmall.copy(
            color = MaterialTheme.colorScheme.onBackground,
            textAlign = TextAlign.Center,
        ),
        lineCount = 2,
    )
    CartesianChartHost(
        chart =
            rememberCartesianChart(
                rememberColumnCartesianLayer(
                    mergeMode = { ColumnCartesianLayer.MergeMode.Grouped(columnSpacing = 0.dp) },
                    columnProvider =
                        ColumnCartesianLayer.ColumnProvider.series(
                            columnColors.map { color ->
                                rememberLineComponent(fill = Fill(color), thickness = 8.dp)
                            },
                        ),
                ),
                startAxis = VerticalAxis.rememberStart(
                    valueFormatter = CartesianValueFormatter { context, value, _ ->
                        "$" + value.toInt().toString()
                    },
                    label = textComponent,
                ),
                bottomAxis = HorizontalAxis.rememberBottom(
                    valueFormatter = CartesianValueFormatter { context, value, _ ->
                        "Year\n" + (value.toInt() + 1).toString()
                    },
                    label = textComponent,
                ),
                legend =
                    rememberHorizontalLegend(
                        items = { extraStore ->
                            extraStore[LegendLabelKey].forEachIndexed { index, label ->
                                add(
                                    LegendItem(
                                        ShapeComponent(Fill(columnColors[index]), CorneredShape.Pill),
                                        textComponent,
                                        label,
                                    ),
                                )
                            }
                        },
                        padding = Insets(top = 8.dp),
                    ),
            ),
        modelProducer = modelProducer,
        zoomState = rememberVicoZoomState(
            zoomEnabled = false,
            initialZoom = Zoom.Content,
        ),
    )
}
