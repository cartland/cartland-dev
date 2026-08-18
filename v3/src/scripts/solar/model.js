// Pure financial model for the Utility vs. Solar + Battery calculator.
// Kept free of DOM access so it can be unit tested directly.

export const defaultValues = {
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

// URL parameter abbreviations. DO NOT CHANGE: existing shared links rely on
// these exact keys.
export const urlParamAbbreviations = {
  duration: 'd',
  opportunityCostRate: 'ocr',
  initialUtilityCost: 'iuc',
  utilityCostIncrease: 'uci',
  solarCostBase: 'scb',
  solarLife: 'sl',
  batteryCostBase: 'bcb',
  batteryLife: 'bl',
  batteryCostDecrease: 'bcd',
  unavoidableUtilityPercent: 'uup',
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function computeResults(vals) {
  const utilityAnnualCosts = []
  const solarAndBatteryAnnualCosts = []

  let nominalCumulativeUtility = 0
  let nominalCumulativeSolarAndBattery = 0
  let opportunityCostUtility = 0
  let opportunityCostSolarAndBattery = 0

  // Solar and battery system costs scale with household usage, approximated
  // by the ratio of the annual utility bill to the $2,400 reference bill.
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
    currentSolarAndBatteryYearCost +=
      currentUtilityCost * (vals.unavoidableUtilityPercent / 100)

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

  return {
    utilityAnnualCosts,
    solarAndBatteryAnnualCosts,
    nominalCumulativeUtility,
    nominalCumulativeSolarAndBattery,
    opportunityCostUtility,
    opportunityCostSolarAndBattery,
    cumulativeUtility,
    cumulativeSolarAndBattery,
    savings: cumulativeUtility - cumulativeSolarAndBattery,
  }
}

export function buildAssumptionsText(vals) {
  return (
    `Assumptions: Analysis over ${vals.duration} years, with a ` +
    `${vals.opportunityCostRate}% investment opportunity cost. Starts with a ` +
    `${formatCurrency(vals.initialUtilityCost)} annual utility bill, increasing ` +
    `${vals.utilityCostIncrease}% annually. Assumes a ` +
    `${vals.unavoidableUtilityPercent}% ongoing grid fee, a ${vals.solarLife}-year ` +
    `solar lifespan, and a ${vals.batteryLife}-year battery lifespan with a ` +
    `${vals.batteryCostDecrease}% cost reduction each replacement.`
  )
}
