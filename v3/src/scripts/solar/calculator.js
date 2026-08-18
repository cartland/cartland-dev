// Interactive controller for the Utility vs. Solar + Battery calculator.
// Reads the ten numeric inputs, recomputes the model on every change, and
// updates the Chart.js chart, summary panel, and shareable link.

import Chart from 'chart.js/auto'
import {
  defaultValues,
  urlParamAbbreviations,
  computeResults,
  buildAssumptionsText,
  formatCurrency,
} from './model.js'

const reverseAbbreviations = Object.fromEntries(
  Object.entries(urlParamAbbreviations).map(([key, abbr]) => [abbr, key])
)

export function initSolarCalculator() {
  const chartCanvas = document.getElementById('solar-chart')
  if (!chartCanvas) return

  const inputs = {}
  Object.keys(defaultValues).forEach((key) => {
    inputs[key] = document.getElementById(key)
  })

  const el = (id) => document.getElementById(id)
  let chartInstance = null

  function currentValues() {
    const vals = {}
    Object.keys(defaultValues).forEach((key) => {
      const parsed = Number(inputs[key]?.value)
      vals[key] = Number.isFinite(parsed) ? parsed : defaultValues[key]
    })
    // Guard against zero/negative lifetimes and durations, which would make
    // the model loop forever or divide by zero.
    vals.duration = Math.max(1, Math.min(100, Math.round(vals.duration)))
    vals.solarLife = Math.max(1, Math.round(vals.solarLife))
    vals.batteryLife = Math.max(1, Math.round(vals.batteryLife))
    return vals
  }

  function updateChart(vals, results) {
    const labels = Array.from(
      { length: vals.duration },
      (_, i) => `Year ${i + 1}`
    )
    if (chartInstance) {
      chartInstance.data.labels = labels
      chartInstance.data.datasets[0].data = results.utilityAnnualCosts
      chartInstance.data.datasets[1].data = results.solarAndBatteryAnnualCosts
      chartInstance.update()
      return
    }
    chartInstance = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Utility (Nominal)',
            data: results.utilityAnnualCosts,
            backgroundColor: '#6366F1',
            borderRadius: 4,
          },
          {
            label: 'Solar + Battery (Nominal)',
            data: results.solarAndBatteryAnnualCosts,
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
            backgroundColor: 'rgb(26 15 61 / 0.95)',
            titleFont: { size: 16, weight: 'bold' },
            bodyFont: { size: 14 },
            callbacks: {
              label(context) {
                let label = context.dataset.label || ''
                if (label) {
                  label = `${label.replace(' (Nominal)', '')}: `
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
            grid: { color: 'rgb(255 255 255 / 0.1)' },
            ticks: { color: '#A0AEC0' },
          },
          y: {
            grid: { color: 'rgb(255 255 255 / 0.1)' },
            ticks: {
              color: '#A0AEC0',
              callback: (value) => formatCurrency(value),
            },
          },
        },
      },
    })
  }

  function updateSummary(vals, results) {
    el('total-utility').textContent = formatCurrency(results.cumulativeUtility)
    el('total-utility-breakdown').textContent =
      `(${formatCurrency(results.nominalCumulativeUtility)} direct cost + ` +
      `${formatCurrency(results.opportunityCostUtility)} opportunity cost)`
    el('total-solar').textContent = formatCurrency(
      results.cumulativeSolarAndBattery
    )
    el('total-solar-breakdown').textContent =
      `(${formatCurrency(results.nominalCumulativeSolarAndBattery)} direct cost + ` +
      `${formatCurrency(results.opportunityCostSolarAndBattery)} opportunity cost)`

    const savingsLabel = el('savings-label')
    const savingsValue = el('savings-value')
    const positive = results.savings >= 0
    savingsLabel.textContent = positive
      ? 'Savings with Solar + Battery'
      : 'Extra Cost with Solar + Battery'
    savingsLabel.classList.toggle('positive', positive)
    savingsLabel.classList.toggle('negative', !positive)
    savingsValue.textContent = formatCurrency(Math.abs(results.savings))
    savingsValue.classList.toggle('positive', positive)
    savingsValue.classList.toggle('negative', !positive)

    el('assumptions-text').textContent = buildAssumptionsText(vals)
    el('battery-decrease-label').textContent =
      `Battery Cost Decrease per ${vals.batteryLife} years (%)`
  }

  function buildShareableLink() {
    const params = new URLSearchParams()
    const vals = currentValues()
    Object.keys(defaultValues).forEach((key) => {
      params.set(urlParamAbbreviations[key], String(vals[key]))
    })
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }

  function clearUrlParams() {
    const url = new URL(window.location.href)
    if (url.search) {
      url.search = ''
      window.history.replaceState({}, '', url)
    }
  }

  function recompute() {
    const vals = currentValues()
    const results = computeResults(vals)
    updateChart(vals, results)
    updateSummary(vals, results)
    const linkContainer = el('shareable-link-container')
    if (!linkContainer.hidden) {
      el('shareable-link').value = buildShareableLink()
    }
    clearUrlParams()
  }

  function share() {
    const link = buildShareableLink()
    const linkContainer = el('shareable-link-container')
    linkContainer.hidden = false
    el('shareable-link').value = link
    const shareButton = el('share-btn')
    navigator.clipboard
      ?.writeText(link)
      .then(() => {
        shareButton.textContent = 'Copied!'
        setTimeout(() => {
          shareButton.textContent = 'Share'
        }, 2000)
      })
      .catch(() => {
        // Clipboard access denied: the link stays visible for manual copy.
        el('shareable-link').select()
      })
  }

  function restoreDefaults() {
    Object.keys(defaultValues).forEach((key) => {
      if (inputs[key]) inputs[key].value = defaultValues[key]
    })
    recompute()
  }

  function loadParamsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    for (const [abbr, value] of urlParams.entries()) {
      const key = reverseAbbreviations[abbr] || abbr
      if (inputs[key]) {
        const parsed = Number(value)
        if (!isNaN(parsed)) inputs[key].value = parsed
      }
    }
  }

  Object.values(inputs).forEach((input) => {
    input?.addEventListener('input', recompute)
  })
  el('share-btn').addEventListener('click', share)
  el('restore-defaults-btn').addEventListener('click', restoreDefaults)

  loadParamsFromUrl()
  recompute()
}
