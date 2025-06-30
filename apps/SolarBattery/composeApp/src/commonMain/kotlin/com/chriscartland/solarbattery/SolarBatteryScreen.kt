package com.chriscartland.solarbattery

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.calculateStartPadding
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.safeGestures
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsBottomHeight
import androidx.compose.foundation.layout.windowInsetsTopHeight
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.chriscartland.solarbattery.ui.theme.GradientBlue500
import com.chriscartland.solarbattery.ui.theme.GradientGreen400
import com.chriscartland.solarbattery.ui.theme.SolarBatteryTheme
import org.jetbrains.compose.ui.tooling.preview.Preview
import kotlin.math.abs

@Composable
fun SolarBatteryScreen() {
    var inputs by remember { mutableStateOf(FinancialInputs()) }
    var result by remember { mutableStateOf(CalculationResult()) }

    // Recalculate whenever inputs change
    LaunchedEffect(inputs) {
        result = FinancialCalculator.runAnalysis(inputs)
    }

    SolarBatteryTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background,
        ) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                contentPadding = WindowInsets.safeGestures.asPaddingValues().let { pv ->
                    LocalLayoutDirection.current.let { dir ->
                        PaddingValues(
                            start = pv.calculateStartPadding(dir),
                            end = pv.calculateStartPadding(dir),
                        )
                    }
                },
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                item { Spacer(Modifier.windowInsetsTopHeight(WindowInsets.safeDrawing)) }
                item { Header() }
                item { MainContent(result) }
                item {
                    FinancialAssumptions(
                        inputs = inputs,
                        onInputsChange = { newInputs ->
                            inputs = newInputs
                        },
                    )
                }
                item { ActionButtons(onRestoreDefaults = { inputs = FinancialInputs() }) }
                item { Spacer(Modifier.windowInsetsBottomHeight(WindowInsets.safeDrawing)) }
            }
        }
    }
}

@Composable
fun Header() {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Utility vs. Solar + Battery: A Cost Analysis",
            style = MaterialTheme.typography.headlineMedium.merge(
                TextStyle(
                    brush = Brush.horizontalGradient(
                        colors = listOf(GradientGreen400, GradientBlue500),
                    ),
                ),
            ),
            textAlign = TextAlign.Center,
            fontWeight = FontWeight.Bold,
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "An interactive calculator to compare the long-term costs",
            style = MaterialTheme.typography.bodyLarge,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
fun MainContent(result: CalculationResult) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Card(
            modifier = Modifier.weight(2f),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    "Annual Cost Comparison",
                    style = MaterialTheme.typography.titleLarge,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth(),
                )
                Spacer(modifier = Modifier.height(16.dp))
                AnnualCostChart(
                    utilityAnnualCosts = result.utilityAnnualCosts,
                    solarAndBatteryAnnualCosts = result.solarAndBatteryAnnualCosts,
                )
            }
        }
        Card(
            modifier = Modifier.weight(1f),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text("Cost Summary", style = MaterialTheme.typography.titleLarge, textAlign = TextAlign.Center)
                Spacer(modifier = Modifier.height(16.dp))
                CostSummaryItem(
                    title = "Total Utility Cost",
                    amount = formatCurrency(result.totalUtilityCost),
                    breakdown = "(${formatCurrency(
                        result.nominalUtilityCost,
                    )} direct + ${formatCurrency(result.opportunityCostUtility)} opportunity)",
                    color = MaterialTheme.colorScheme.tertiary,
                )
                Spacer(modifier = Modifier.height(16.dp))
                CostSummaryItem(
                    title = "Total Solar + Battery Cost",
                    amount = formatCurrency(result.totalSolarCost),
                    breakdown = "(${formatCurrency(
                        result.nominalSolarCost,
                    )} direct + ${formatCurrency(result.opportunityCostSolar)} opportunity)",
                    color = MaterialTheme.colorScheme.primary,
                )
                Spacer(modifier = Modifier.height(16.dp))
                Divider(modifier = Modifier.padding(vertical = 8.dp))

                val savingsColor = if (result.savings >= 0) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.error
                Text(
                    text = if (result.savings >= 0) "Total Savings" else "Extra Cost",
                    style = MaterialTheme.typography.titleMedium,
                    color = savingsColor,
                )
                Text(
                    text = formatCurrency(abs(result.savings)),
                    style = MaterialTheme.typography.displaySmall,
                    fontWeight = FontWeight.ExtraBold,
                    color = savingsColor,
                )
            }
        }
    }
}

@Composable
fun CostSummaryItem(
    title: String,
    amount: String,
    breakdown: String,
    color: Color,
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = title, style = MaterialTheme.typography.titleMedium, color = color, textAlign = TextAlign.Center)
        Text(text = amount, style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.ExtraBold, color = color)
        Text(
            text = breakdown,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
        )
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FinancialAssumptions(
    inputs: FinancialInputs,
    onInputsChange: (FinancialInputs) -> Unit,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                "Financial Assumptions",
                style = MaterialTheme.typography.titleLarge,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(16.dp))
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                AssumptionGroup(title = "General", color = MaterialTheme.colorScheme.secondary, modifier = Modifier.weight(1f)) {
                    InputField(
                        label = "Analysis Duration (Years)",
                        value = inputs.duration,
                        onValueChange = { onInputsChange(inputs.copy(duration = it.toInt())) },
                        description = "Length of the cost comparison.",
                    )
                    InputField(
                        label = "Investment Opportunity Cost (%)",
                        value = inputs.opportunityCostRate,
                        onValueChange = { onInputsChange(inputs.copy(opportunityCostRate = it.toDouble())) },
                        description = "Expected return if you invested the money instead.",
                    )
                }
                AssumptionGroup(title = "Utility Settings", color = MaterialTheme.colorScheme.tertiary, modifier = Modifier.weight(1f)) {
                    InputField(
                        label = "Current Annual Utility Bill ($)",
                        value = inputs.initialUtilityCost,
                        onValueChange = { onInputsChange(inputs.copy(initialUtilityCost = it.toDouble())) },
                        description = "Your total electricity cost for the last 12 months.",
                    )
                    InputField(
                        label = "Annual Cost Increase (%)",
                        value = inputs.utilityCostIncrease,
                        onValueChange = { onInputsChange(inputs.copy(utilityCostIncrease = it.toDouble())) },
                        description = "The average yearly rate increase from your utility.",
                    )
                }
                AssumptionGroup(
                    title = "Solar + Battery Settings",
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.weight(1f),
                ) {
                    InputField(
                        label = "Upfront Solar System Cost ($)",
                        value = inputs.solarCostBase,
                        onValueChange = { onInputsChange(inputs.copy(solarCostBase = it.toDouble())) },
                        description = "Initial cost to purchase and install solar panels.",
                    )
                    InputField(
                        label = "Solar System Lifespan (Years)",
                        value = inputs.solarLife,
                        onValueChange = { onInputsChange(inputs.copy(solarLife = it.toInt())) },
                        description = "How long the solar panels are expected to last.",
                    )
                    InputField(
                        label = "Battery Cost ($)",
                        value = inputs.batteryCostBase,
                        onValueChange = { onInputsChange(inputs.copy(batteryCostBase = it.toDouble())) },
                        description = "Initial cost to purchase and install a home battery.",
                    )
                    InputField(
                        label = "Battery Lifespan (Years)",
                        value = inputs.batteryLife,
                        onValueChange = { onInputsChange(inputs.copy(batteryLife = it.toInt())) },
                        description = "How long the battery is expected to last before replacement.",
                    )
                    InputField(
                        label = "Battery Cost Decrease per ${inputs.batteryLife} years (%)",
                        value = inputs.batteryCostDecrease,
                        onValueChange = { onInputsChange(inputs.copy(batteryCostDecrease = it.toDouble())) },
                        description = "Projected price drop for batteries at each replacement.",
                    )
                    InputField(
                        label = "Ongoing Grid Connection Fee (%)",
                        value = inputs.unavoidableUtilityPercent,
                        onValueChange = { onInputsChange(inputs.copy(unavoidableUtilityPercent = it.toDouble())) },
                        description = "Percentage of utility bill for grid access, even with solar.",
                    )
                }
            }
        }
    }
}

@Composable
fun AssumptionGroup(
    title: String,
    color: Color,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .background(MaterialTheme.colorScheme.background, shape = MaterialTheme.shapes.medium)
            .padding(12.dp),
    ) {
        Text(text = title, style = MaterialTheme.typography.titleMedium, color = color)
        Divider(color = color.copy(alpha = 0.3f), thickness = 1.dp, modifier = Modifier.padding(vertical = 8.dp))
        content()
    }
}

@Composable
fun InputField(
    label: String,
    value: Number,
    onValueChange: (Number) -> Unit,
    description: String,
) {
    var text by remember(value) { mutableStateOf(value.toString()) }
    var isError by remember { mutableStateOf(false) }

    val onTextChange: (String) -> Unit = { newText ->
        text = newText
        val number = newText.toDoubleOrNull()
        if (number != null) {
            onValueChange(number)
            isError = false
        } else {
            isError = true
        }
    }

    Column(modifier = Modifier.padding(vertical = 8.dp)) {
        Text(label, style = MaterialTheme.typography.labelLarge)
        Spacer(modifier = Modifier.height(2.dp))
        Text(description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(modifier = Modifier.height(4.dp))
        OutlinedTextField(
            value = text,
            onValueChange = onTextChange,
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            isError = isError,
        )
    }
}

@Composable
fun ActionButtons(onRestoreDefaults: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(top = 16.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Button(onClick = { /*TODO: Share*/ }) {
            Text("Share")
        }
        Spacer(modifier = Modifier.width(16.dp))
        Button(onClick = onRestoreDefaults) {
            Text("Restore Defaults")
        }
    }
}

fun formatCurrency(value: Double): String = formatNumber(value)

@Preview
@Composable
fun SolarBatteryScreenPreview() {
    SolarBatteryScreen()
}
