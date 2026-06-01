<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const defaultValues = {
  duration: 30,
  opportunityCostRate: 4,
  initialUtilityCost: 2400,
  utilityCostIncrease: 2,
  solarCostBase: 10200,
  solarLife: 30,
  batteryCostBase: 14500,
  batteryLife: 10,
  batteryCostDecrease: 30,
  unavoidableUtilityPercent: 20,
}

const duration = ref(defaultValues.duration)
const opportunityCostRate = ref(defaultValues.opportunityCostRate)
const initialUtilityCost = ref(defaultValues.initialUtilityCost)
const utilityCostIncrease = ref(defaultValues.utilityCostIncrease)
const solarCostBase = ref(defaultValues.solarCostBase)
const solarLife = ref(defaultValues.solarLife)
const batteryCostBase = ref(defaultValues.batteryCostBase)
const batteryLife = ref(defaultValues.batteryLife)
const batteryCostDecrease = ref(defaultValues.batteryCostDecrease)
const unavoidableUtilityPercent = ref(defaultValues.unavoidableUtilityPercent)

const inputs: Record<string, Ref<number>> = {
  duration,
  opportunityCostRate,
  initialUtilityCost,
  utilityCostIncrease,
  solarCostBase,
  solarLife,
  batteryCostBase,
  batteryLife,
  batteryCostDecrease,
  unavoidableUtilityPercent,
}

// URL parameter config - DO NOT CHANGE abbreviations
const urlParamsConfig: Record<string, { abbr: string }> = {
  duration: { abbr: 'd' },
  opportunityCostRate: { abbr: 'ocr' },
  initialUtilityCost: { abbr: 'iuc' },
  utilityCostIncrease: { abbr: 'uci' },
  solarCostBase: { abbr: 'scb' },
  solarLife: { abbr: 'sl' },
  batteryCostBase: { abbr: 'bcb' },
  batteryLife: { abbr: 'bl' },
  batteryCostDecrease: { abbr: 'bcd' },
  unavoidableUtilityPercent: { abbr: 'uup' },
}

const paramAliases = Object.fromEntries(
  Object.entries(urlParamsConfig).map(([key, config]) => [key, config.abbr])
)
const reverseParamAliases = Object.fromEntries(
  Object.entries(urlParamsConfig).map(([key, config]) => [config.abbr, key])
)

const showShareableLink = ref(false)
const shareableLink = ref('')
const shareButtonText = ref('Share')

const results = computed(() => {
  const vals = {
    duration: duration.value,
    opportunityCostRate: opportunityCostRate.value,
    initialUtilityCost: initialUtilityCost.value,
    utilityCostIncrease: utilityCostIncrease.value,
    solarCostBase: solarCostBase.value,
    solarLife: solarLife.value,
    batteryCostBase: batteryCostBase.value,
    batteryLife: batteryLife.value,
    batteryCostDecrease: batteryCostDecrease.value,
    unavoidableUtilityPercent: unavoidableUtilityPercent.value,
  }

  const utilityAnnualCosts: number[] = []
  const solarAndBatteryAnnualCosts: number[] = []

  let nominalCumulativeUtility = 0
  let nominalCumulativeSolarAndBattery = 0
  let opportunityCostUtility = 0
  let opportunityCostSolarAndBattery = 0

  const costScalingFactor = vals.initialUtilityCost / 2400
  const rate = vals.opportunityCostRate / 100

  for (let year = 1; year <= vals.duration; year++) {
    const currentUtilityCost =
      vals.initialUtilityCost *
      Math.pow(1 + vals.utilityCostIncrease / 100, year - 1)
    utilityAnnualCosts.push(currentUtilityCost)
    nominalCumulativeUtility += currentUtilityCost

    let currentSolarAndBatteryYearCost = 0
    if ((year - 1) % vals.solarLife === 0) {
      currentSolarAndBatteryYearCost += vals.solarCostBase * costScalingFactor
    }
    if ((year - 1) % vals.batteryLife === 0) {
      const numBatteriesPreviouslyPurchased = Math.floor(
        (year - 1) / vals.batteryLife
      )
      currentSolarAndBatteryYearCost +=
        vals.batteryCostBase *
        costScalingFactor *
        Math.pow(
          1 - vals.batteryCostDecrease / 100,
          numBatteriesPreviouslyPurchased
        )
    }
    const unavoidableCost =
      currentUtilityCost * (vals.unavoidableUtilityPercent / 100)
    currentSolarAndBatteryYearCost += unavoidableCost

    solarAndBatteryAnnualCosts.push(currentSolarAndBatteryYearCost)
    nominalCumulativeSolarAndBattery += currentSolarAndBatteryYearCost

    if (rate > 0) {
      const yearsToGrow = vals.duration - year
      opportunityCostUtility +=
        currentUtilityCost * (Math.pow(1 + rate, yearsToGrow) - 1)
      opportunityCostSolarAndBattery +=
        currentSolarAndBatteryYearCost * (Math.pow(1 + rate, yearsToGrow) - 1)
    }
  }

  const cumulativeUtility = nominalCumulativeUtility + opportunityCostUtility
  const cumulativeSolarAndBattery =
    nominalCumulativeSolarAndBattery + opportunityCostSolarAndBattery
  const savings = cumulativeUtility - cumulativeSolarAndBattery

  return {
    utilityAnnualCosts,
    solarAndBatteryAnnualCosts,
    nominalCumulativeUtility,
    nominalCumulativeSolarAndBattery,
    opportunityCostUtility,
    opportunityCostSolarAndBattery,
    cumulativeUtility,
    cumulativeSolarAndBattery,
    savings,
  }
})

const assumptionsText = computed(() => {
  return `Assumptions: Analysis over ${duration.value} years, with a ${opportunityCostRate.value}% investment opportunity cost. Starts with a ${formatCurrency(initialUtilityCost.value)} annual utility bill, increasing ${utilityCostIncrease.value}% annually. Assumes a ${unavoidableUtilityPercent.value}% ongoing grid fee, a ${solarLife.value}-year solar lifespan, and a ${batteryLife.value}-year battery lifespan with a ${batteryCostDecrease.value}% cost reduction each replacement.`
})

function restoreDefaults() {
  for (const key in defaultValues) {
    inputs[key].value = defaultValues[key as keyof typeof defaultValues]
  }
}

function clearURLParams() {
  const url = new URL(window.location.href)
  if (url.search) {
    url.search = ''
    window.history.pushState({}, '', url)
  }
}

function updateShareableLink() {
  const params = new URLSearchParams()
  for (const key in inputs) {
    params.set(paramAliases[key] || key, String(inputs[key].value))
  }
  shareableLink.value = `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

function share() {
  updateShareableLink()
  showShareableLink.value = true
  navigator.clipboard
    .writeText(shareableLink.value)
    .then(() => {
      shareButtonText.value = 'Copied!'
      setTimeout(() => {
        shareButtonText.value = 'Share'
      }, 2000)
    })
    .catch(() => {
      alert('Failed to copy URL to clipboard.')
    })
}

function loadParamsFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  for (const [key, value] of urlParams.entries()) {
    const fullKey = reverseParamAliases[key] || key
    if (inputs[fullKey]) {
      const numValue = Number(value)
      if (!isNaN(numValue)) {
        inputs[fullKey].value = numValue
      }
    }
  }
}

// Chart.js integration
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: any = null

async function updateChart() {
  if (!chartCanvas.value) return

  const Chart = (await import('chart.js/auto')).default
  const r = results.value

  if (chartInstance) {
    chartInstance.data.labels = Array.from(
      { length: duration.value },
      (_, i) => `Year ${i + 1}`
    )
    chartInstance.data.datasets[0].data = r.utilityAnnualCosts
    chartInstance.data.datasets[1].data = r.solarAndBatteryAnnualCosts
    chartInstance.update()
  } else {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'bar',
      data: {
        labels: Array.from(
          { length: duration.value },
          (_, i) => `Year ${i + 1}`
        ),
        datasets: [
          {
            label: 'Utility (Nominal)',
            data: r.utilityAnnualCosts,
            backgroundColor: '#6366F1',
            borderRadius: 4,
          },
          {
            label: 'Solar + Battery (Nominal)',
            data: r.solarAndBatteryAnnualCosts,
            backgroundColor: '#34D399',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#E2E8F0' } },
          tooltip: {
            backgroundColor: 'rgb(31 41 55 / 0.9)',
            titleFont: { size: 16, weight: 'bold' },
            bodyFont: { size: 14 },
            callbacks: {
              label: function (context: any) {
                let label = context.dataset.label || ''
                if (label) {
                  label = label.replace(' (Nominal)', '')
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  label += formatCurrency(context.parsed.y)
                }
                return label
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: '#4A5568' },
            ticks: { color: '#A0AEC0' },
          },
          y: {
            grid: { color: '#4A5568' },
            ticks: {
              color: '#A0AEC0',
              callback: (value: any) => formatCurrency(value),
            },
          },
        },
      },
    })
  }
}

watch(results, () => {
  updateChart()
  if (showShareableLink.value) updateShareableLink()
  clearURLParams()
})

onMounted(() => {
  loadParamsFromURL()
  updateChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<template>
  <div class="solar-calc">
    <header class="calc-header">
      <h1 class="gradient-title">
        Utility vs. Solar + Battery: A Cost Analysis
      </h1>
      <p class="calc-subtitle">
        An interactive calculator to compare the long-term costs
      </p>
    </header>

    <main class="calc-main">
      <div class="chart-panel">
        <h2>Annual Cost Comparison</h2>
        <div class="chart-wrapper">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>

      <div class="summary-panel">
        <div class="summary-content">
          <h2>Cost Summary &amp; Assumptions</h2>
          <div class="summary-items">
            <div class="summary-item">
              <p class="label indigo">Total Utility Cost</p>
              <p class="value indigo">
                {{ formatCurrency(results.cumulativeUtility) }}
              </p>
              <p class="breakdown">
                ({{ formatCurrency(results.nominalCumulativeUtility) }} direct
                cost +
                {{ formatCurrency(results.opportunityCostUtility) }} opportunity
                cost)
              </p>
            </div>
            <div class="summary-item">
              <p class="label green">Total Solar + Battery Cost</p>
              <p class="value green">
                {{ formatCurrency(results.cumulativeSolarAndBattery) }}
              </p>
              <p class="breakdown">
                ({{ formatCurrency(results.nominalCumulativeSolarAndBattery) }}
                direct cost +
                {{ formatCurrency(results.opportunityCostSolarAndBattery) }}
                opportunity cost)
              </p>
            </div>
          </div>
        </div>

        <div class="savings-section">
          <p class="assumptions">{{ assumptionsText }}</p>
          <p
            class="savings-label"
            :class="results.savings >= 0 ? 'cyan' : 'red'"
          >
            {{
              results.savings >= 0
                ? 'Savings with Solar + Battery'
                : 'Extra Cost with Solar + Battery'
            }}
          </p>
          <p
            class="savings-value"
            :class="results.savings >= 0 ? 'cyan' : 'red'"
          >
            {{ formatCurrency(Math.abs(results.savings)) }}
          </p>
        </div>
      </div>
    </main>

    <section class="inputs-section">
      <h2>Financial Assumptions</h2>
      <div class="inputs-grid">
        <div class="input-group general">
          <h3>General</h3>
          <div class="input-field">
            <label for="duration">Analysis Duration (Years)</label>
            <small>Length of the cost comparison.</small>
            <input id="duration" type="number" v-model.number="duration" />
          </div>
          <div class="input-field">
            <label for="opportunityCostRate"
              >Investment Opportunity Cost (%)</label
            >
            <small>Expected return if you invested the money instead.</small>
            <input
              id="opportunityCostRate"
              type="number"
              v-model.number="opportunityCostRate"
            />
          </div>
        </div>

        <div class="input-group utility">
          <h3>Utility Settings</h3>
          <div class="input-field">
            <label for="initialUtilityCost"
              >Current Annual Utility Bill ($)</label
            >
            <small>Your total electricity cost for the last 12 months.</small>
            <input
              id="initialUtilityCost"
              type="number"
              v-model.number="initialUtilityCost"
            />
          </div>
          <div class="input-field">
            <label for="utilityCostIncrease">Annual Cost Increase (%)</label>
            <small>The average yearly rate increase from your utility.</small>
            <input
              id="utilityCostIncrease"
              type="number"
              v-model.number="utilityCostIncrease"
            />
          </div>
        </div>

        <div class="input-group solar">
          <h3>Solar + Battery Settings</h3>
          <div class="input-field">
            <label for="solarCostBase">Upfront Solar System Cost ($)</label>
            <small>Initial cost to purchase and install solar panels.</small>
            <input
              id="solarCostBase"
              type="number"
              v-model.number="solarCostBase"
            />
            <small class="note"
              >Cost is estimated based on your annual utility bill.</small
            >
          </div>
          <div class="input-field">
            <label for="solarLife">Solar System Lifespan (Years)</label>
            <small>How long the solar panels are expected to last.</small>
            <input id="solarLife" type="number" v-model.number="solarLife" />
          </div>
          <div class="input-field">
            <label for="batteryCostBase">Battery Cost ($)</label>
            <small>Initial cost to purchase and install a home battery.</small>
            <input
              id="batteryCostBase"
              type="number"
              v-model.number="batteryCostBase"
            />
            <small class="note"
              >Cost is estimated based on your annual utility bill.</small
            >
          </div>
          <div class="input-field">
            <label for="batteryLife">Battery Lifespan (Years)</label>
            <small
              >How long the battery is expected to last before
              replacement.</small
            >
            <input
              id="batteryLife"
              type="number"
              v-model.number="batteryLife"
            />
          </div>
          <div class="input-field">
            <label for="batteryCostDecrease"
              >Battery Cost Decrease per {{ batteryLife }} years (%)</label
            >
            <small
              >Projected price drop for batteries at each replacement.</small
            >
            <input
              id="batteryCostDecrease"
              type="number"
              v-model.number="batteryCostDecrease"
            />
          </div>
          <div class="input-field">
            <label for="unavoidableUtilityPercent"
              >Ongoing Grid Connection Fee (%)</label
            >
            <small
              >Percentage of utility bill for grid access, even with
              solar.</small
            >
            <input
              id="unavoidableUtilityPercent"
              type="number"
              v-model.number="unavoidableUtilityPercent"
            />
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-share" @click="share">{{ shareButtonText }}</button>
        <button class="btn-restore" @click="restoreDefaults">
          Restore Defaults
        </button>
      </div>

      <div v-if="showShareableLink" class="shareable-link-container">
        <p>Shareable Link:</p>
        <input type="text" :value="shareableLink" readonly />
      </div>
    </section>
  </div>
</template>

<style scoped>
.solar-calc {
  color: white;
  max-width: 1280px;
  margin: 0 auto;
}

.calc-header {
  margin-bottom: 32px;
  text-align: center;
}

.gradient-title {
  font-size: 2.5em;
  font-weight: 700;
  background: linear-gradient(to right, #34d399, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
  border: none;
}

.calc-subtitle {
  margin-top: 8px;
  font-size: 1.1em;
  color: #9ca3af;
}

.calc-main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 40px;
}

.chart-panel {
  background-color: #1f2937;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #374151;
}

.chart-panel h2 {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 16px;
  border: none;
}

.chart-wrapper {
  width: 100%;
  height: 400px;
}

.summary-panel {
  background-color: #1f2937;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #374151;
}

.summary-panel h2 {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 16px;
  border: none;
}

.summary-items {
  text-align: center;
}

.summary-item {
  margin-bottom: 16px;
}

.label {
  font-size: 1.1em;
  margin-bottom: 4px;
}

.label.indigo {
  color: #a5b4fc;
}

.label.green {
  color: #86efac;
}

.value {
  font-size: 2.5em;
  font-weight: 800;
  margin: 4px 0;
}

.value.indigo {
  color: #818cf8;
}

.value.green {
  color: #34d399;
}

.breakdown {
  font-size: 0.85em;
  color: #9ca3af;
}

.savings-section {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid #374151;
  text-align: center;
}

.assumptions {
  font-size: 0.75em;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
}

.savings-label {
  font-size: 1.1em;
}

.savings-label.cyan {
  color: #67e8f9;
}

.savings-label.red {
  color: #f87171;
}

.savings-value {
  font-size: 3em;
  font-weight: 800;
  margin: 4px 0;
}

.savings-value.cyan {
  color: #22d3ee;
}

.savings-value.red {
  color: #ef4444;
}

.inputs-section {
  background-color: #1f2937;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #374151;
  margin-top: 40px;
}

.inputs-section h2 {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 24px;
  border: none;
}

.inputs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.input-group {
  padding: 16px;
  background-color: #111827;
  border-radius: 8px;
}

.input-group h3 {
  font-size: 1.2em;
  font-weight: 600;
  padding-bottom: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.input-group.general h3 {
  color: #22d3ee;
  border-bottom-color: rgba(34, 211, 238, 0.3);
}

.input-group.utility h3 {
  color: #818cf8;
  border-bottom-color: rgba(129, 140, 248, 0.3);
}

.input-group.solar h3 {
  color: #34d399;
  border-bottom-color: rgba(52, 211, 153, 0.3);
}

.input-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.input-field label {
  color: #d1d5db;
  margin-bottom: 4px;
}

.input-field small {
  color: #6b7280;
  margin-top: -2px;
  margin-bottom: 8px;
}

.input-field small.note {
  margin-top: 4px;
  margin-bottom: 0;
}

.input-field input {
  background-color: #374151;
  border: 1px solid #4b5563;
  border-radius: 6px;
  padding: 8px;
  color: white;
}

.input-field input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #22d3ee;
}

.action-buttons {
  margin-top: 32px;
  text-align: center;
}

.btn-share {
  background-color: #059669;
  color: white;
  font-weight: 700;
  padding: 8px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-share:hover {
  background-color: #047857;
  transform: scale(1.05);
}

.btn-restore {
  margin-left: 16px;
  background-color: #0891b2;
  color: white;
  font-weight: 700;
  padding: 8px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-restore:hover {
  background-color: #0e7490;
  transform: scale(1.05);
}

.shareable-link-container {
  margin-top: 16px;
  text-align: center;
}

.shareable-link-container p {
  color: #9ca3af;
}

.shareable-link-container input {
  width: 100%;
  max-width: 480px;
  background-color: #374151;
  border: 1px solid #4b5563;
  border-radius: 6px;
  padding: 8px;
  margin-top: 4px;
  text-align: center;
  color: white;
}

@media (max-width: 1024px) {
  .calc-main {
    grid-template-columns: 1fr;
  }

  .inputs-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .gradient-title {
    font-size: 1.8em;
  }
}
</style>
