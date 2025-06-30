package com.chriscartland.solarbattery

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.chriscartland.solarbattery.ui.theme.SolarBatteryTheme
import org.jetbrains.compose.ui.tooling.preview.Preview

@Composable
fun SolarBatteryScreen() {
    // State for all the input fields
    var duration by remember { mutableStateOf("30") }
    var opportunityCostRate by remember { mutableStateOf("4") }
    var initialUtilityCost by remember { mutableStateOf("2400") }
    var utilityCostIncrease by remember { mutableStateOf("2") }
    var solarCostBase by remember { mutableStateOf("10200") }
    var solarLife by remember { mutableStateOf("30") }
    var batteryCostBase by remember { mutableStateOf("14500") }
    var batteryLife by remember { mutableStateOf("10") }
    var batteryCostDecrease by remember { mutableStateOf("30") }
    var unavoidableUtilityPercent by remember { mutableStateOf("20") }

    SolarBatteryTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                item { Header() }
                item { Spacer(modifier = Modifier.height(24.dp)) }
                item { MainContent() }
                item { Spacer(modifier = Modifier.height(24.dp)) }
                item {
                    FinancialAssumptions(
                        duration = duration, onDurationChange = { duration = it },
                        opportunityCostRate = opportunityCostRate, onOpportunityCostRateChange = { opportunityCostRate = it },
                        initialUtilityCost = initialUtilityCost, onInitialUtilityCostChange = { initialUtilityCost = it },
                        utilityCostIncrease = utilityCostIncrease, onUtilityCostIncreaseChange = { utilityCostIncrease = it },
                        solarCostBase = solarCostBase, onSolarCostBaseChange = { solarCostBase = it },
                        solarLife = solarLife, onSolarLifeChange = { solarLife = it },
                        batteryCostBase = batteryCostBase, onBatteryCostBaseChange = { batteryCostBase = it },
                        batteryLife = batteryLife, onBatteryLifeChange = { batteryLife = it },
                        batteryCostDecrease = batteryCostDecrease, onBatteryCostDecreaseChange = { batteryCostDecrease = it },
                        unavoidableUtilityPercent = unavoidableUtilityPercent, onUnavoidableUtilityPercentChange = { unavoidableUtilityPercent = it }
                    )
                }
                item { Spacer(modifier = Modifier.height(16.dp)) }
                item { ActionButtons() }
            }
        }
    }
}

@Composable
fun Header() {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Utility vs. Solar + Battery: A Cost Analysis",
            style = MaterialTheme.typography.headlineMedium,
            textAlign = TextAlign.Center,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "An interactive calculator to compare the long-term costs",
            style = MaterialTheme.typography.bodyLarge,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun MainContent() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Card(
            modifier = Modifier.weight(2f),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Annual Cost Comparison", style = MaterialTheme.typography.titleLarge, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
                Spacer(modifier = Modifier.height(16.dp))
                // Placeholder for chart
                Box(modifier = Modifier.fillMaxWidth().height(200.dp).background(Color.DarkGray))
            }
        }
        Card(
            modifier = Modifier.weight(1f),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("Cost Summary & Assumptions", style = MaterialTheme.typography.titleLarge, textAlign = TextAlign.Center)
                Spacer(modifier = Modifier.height(16.dp))
                CostSummaryItem("Total Utility Cost", "$0", "($0 direct cost + $0 opportunity cost)", MaterialTheme.colorScheme.tertiary)
                Spacer(modifier = Modifier.height(16.dp))
                CostSummaryItem("Total Solar + Battery Cost", "$0", "($0 direct cost + $0 opportunity cost)", MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(16.dp))
                Divider(modifier = Modifier.padding(vertical = 8.dp))
                Text("Total Savings", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.secondary)
                Text("$0", style = MaterialTheme.typography.displaySmall, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.secondary)
            }
        }
    }
}

@Composable
fun CostSummaryItem(title: String, amount: String, breakdown: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = title, style = MaterialTheme.typography.titleMedium, color = color)
        Text(text = amount, style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.ExtraBold, color = color)
        Text(text = breakdown, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FinancialAssumptions(
    duration: String, onDurationChange: (String) -> Unit,
    opportunityCostRate: String, onOpportunityCostRateChange: (String) -> Unit,
    initialUtilityCost: String, onInitialUtilityCostChange: (String) -> Unit,
    utilityCostIncrease: String, onUtilityCostIncreaseChange: (String) -> Unit,
    solarCostBase: String, onSolarCostBaseChange: (String) -> Unit,
    solarLife: String, onSolarLifeChange: (String) -> Unit,
    batteryCostBase: String, onBatteryCostBaseChange: (String) -> Unit,
    batteryLife: String, onBatteryLifeChange: (String) -> Unit,
    batteryCostDecrease: String, onBatteryCostDecreaseChange: (String) -> Unit,
    unavoidableUtilityPercent: String, onUnavoidableUtilityPercentChange: (String) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Financial Assumptions", style = MaterialTheme.typography.titleLarge, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
            Spacer(modifier = Modifier.height(16.dp))
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                AssumptionGroup(title = "General", color = MaterialTheme.colorScheme.secondary, modifier = Modifier.weight(1f)) {
                    InputField(label = "Analysis Duration (Years)", value = duration, onValueChange = onDurationChange, description = "Length of the cost comparison.")
                    InputField(label = "Investment Opportunity Cost (%)", value = opportunityCostRate, onValueChange = onOpportunityCostRateChange, description = "Expected return if you invested the money instead.")
                }
                AssumptionGroup(title = "Utility Settings", color = MaterialTheme.colorScheme.tertiary, modifier = Modifier.weight(1f)) {
                    InputField(label = "Current Annual Utility Bill ($)", value = initialUtilityCost, onValueChange = onInitialUtilityCostChange, description = "Your total electricity cost for the last 12 months.")
                    InputField(label = "Annual Cost Increase (%)", value = utilityCostIncrease, onValueChange = onUtilityCostIncreaseChange, description = "The average yearly rate increase from your utility.")
                }
                AssumptionGroup(title = "Solar + Battery Settings", color = MaterialTheme.colorScheme.primary, modifier = Modifier.weight(1f)) {
                    InputField(label = "Upfront Solar System Cost ($)", value = solarCostBase, onValueChange = onSolarCostBaseChange, description = "Initial cost to purchase and install solar panels.")
                    InputField(label = "Solar System Lifespan (Years)", value = solarLife, onValueChange = onSolarLifeChange, description = "How long the solar panels are expected to last.")
                    InputField(label = "Battery Cost ($)", value = batteryCostBase, onValueChange = onBatteryCostBaseChange, description = "Initial cost to purchase and install a home battery.")
                    InputField(label = "Battery Lifespan (Years)", value = batteryLife, onValueChange = onBatteryLifeChange, description = "How long the battery is expected to last before replacement.")
                    InputField(label = "Battery Cost Decrease per 10 years (%)", value = batteryCostDecrease, onValueChange = onBatteryCostDecreaseChange, description = "Projected price drop for batteries at each replacement.")
                    InputField(label = "Ongoing Grid Connection Fee (%)", value = unavoidableUtilityPercent, onValueChange = onUnavoidableUtilityPercentChange, description = "Percentage of utility bill for grid access, even with solar.")
                }
            }
        }
    }
}

@Composable
fun AssumptionGroup(title: String, color: Color, modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = modifier
            .background(MaterialTheme.colorScheme.surface, shape = MaterialTheme.shapes.medium)
            .padding(12.dp)
    ) {
        Text(text = title, style = MaterialTheme.typography.titleMedium, color = color)
        Divider(color = color.copy(alpha = 0.3f), thickness = 1.dp, modifier = Modifier.padding(vertical = 8.dp))
        content()
    }
}

@Composable
fun InputField(label: String, value: String, onValueChange: (String) -> Unit, description: String) {
    Column(modifier = Modifier.padding(vertical = 8.dp)) {
        Text(label, style = MaterialTheme.typography.labelLarge)
        Spacer(modifier = Modifier.height(2.dp))
        Text(description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(modifier = Modifier.height(4.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
    }
}

@Composable
fun ActionButtons() {
    Row(
        modifier = Modifier.fillMaxWidth().padding(top = 16.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Button(onClick = { /*TODO*/ }) {
            Text("Share")
        }
        Spacer(modifier = Modifier.width(16.dp))
        Button(onClick = { /*TODO*/ }) {
            Text("Restore Defaults")
        }
    }
}

@Preview
@Composable
fun SolarBatteryScreenPreview() {
    SolarBatteryScreen()
}
