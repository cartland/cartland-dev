import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface CalculatorInputs {
  duration: Ref<number>
  opportunityCostRate: Ref<number>
  initialUtilityCost: Ref<number>
  utilityCostIncrease: Ref<number>
  solarCostBase: Ref<number>
  solarLife: Ref<number>
  batteryCostBase: Ref<number>
  batteryLife: Ref<number>
  batteryCostDecrease: Ref<number>
  unavoidableUtilityPercent: Ref<number>
}

export interface CalculatorResults {
  utilityAnnualCosts: number[]
  solarAndBatteryAnnualCosts: number[]
  nominalCumulativeUtility: number
  nominalCumulativeSolarAndBattery: number
  opportunityCostUtility: number
  opportunityCostSolarAndBattery: number
  cumulativeUtility: number
  cumulativeSolarAndBattery: number
  savings: number
}

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
} as const

export type InputKey = keyof typeof defaultValues

function runAnalysis(vals: Record<InputKey, number>): CalculatorResults {
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

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export function useCalculator() {
  const inputs: CalculatorInputs = {
    duration: ref(defaultValues.duration),
    opportunityCostRate: ref(defaultValues.opportunityCostRate),
    initialUtilityCost: ref(defaultValues.initialUtilityCost),
    utilityCostIncrease: ref(defaultValues.utilityCostIncrease),
    solarCostBase: ref(defaultValues.solarCostBase),
    solarLife: ref(defaultValues.solarLife),
    batteryCostBase: ref(defaultValues.batteryCostBase),
    batteryLife: ref(defaultValues.batteryLife),
    batteryCostDecrease: ref(defaultValues.batteryCostDecrease),
    unavoidableUtilityPercent: ref(defaultValues.unavoidableUtilityPercent),
  }

  const results: ComputedRef<CalculatorResults> = computed(() => {
    const vals: Record<InputKey, number> = {
      duration: inputs.duration.value,
      opportunityCostRate: inputs.opportunityCostRate.value,
      initialUtilityCost: inputs.initialUtilityCost.value,
      utilityCostIncrease: inputs.utilityCostIncrease.value,
      solarCostBase: inputs.solarCostBase.value,
      solarLife: inputs.solarLife.value,
      batteryCostBase: inputs.batteryCostBase.value,
      batteryLife: inputs.batteryLife.value,
      batteryCostDecrease: inputs.batteryCostDecrease.value,
      unavoidableUtilityPercent: inputs.unavoidableUtilityPercent.value,
    }
    return runAnalysis(vals)
  })

  const assumptionsText: ComputedRef<string> = computed(() => {
    const i = inputs
    return [
      `Analysis duration: ${i.duration.value} years`,
      `Opportunity cost rate: ${i.opportunityCostRate.value}%`,
      `Initial annual utility cost: ${formatCurrency(i.initialUtilityCost.value)}`,
      `Annual utility cost increase: ${i.utilityCostIncrease.value}%`,
      `Solar panel cost: ${formatCurrency(i.solarCostBase.value)}`,
      `Solar panel lifespan: ${i.solarLife.value} years`,
      `Battery cost: ${formatCurrency(i.batteryCostBase.value)}`,
      `Battery lifespan: ${i.batteryLife.value} years`,
      `Battery cost decrease per replacement: ${i.batteryCostDecrease.value}%`,
      `Unavoidable utility percentage: ${i.unavoidableUtilityPercent.value}%`,
    ].join('\n')
  })

  function resetDefaults(): void {
    for (const key of Object.keys(defaultValues) as InputKey[]) {
      inputs[key].value = defaultValues[key]
    }
  }

  return {
    inputs,
    results,
    assumptionsText,
    resetDefaults,
    formatCurrency,
  }
}
