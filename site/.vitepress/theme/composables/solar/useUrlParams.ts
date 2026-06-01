import type { Ref } from 'vue'
import { type InputKey, defaultValues } from './useCalculator'

interface ParamConfig {
  abbr: string
}

const urlParamsConfig: Record<InputKey, ParamConfig> = {
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

type ReactiveInputs = Record<InputKey, Ref<number>>

export function loadParamsFromURL(inputs: ReactiveInputs): void {
  const params = new URLSearchParams(window.location.search)
  for (const [key, config] of Object.entries(urlParamsConfig) as [
    InputKey,
    ParamConfig,
  ][]) {
    const value = params.get(config.abbr)
    if (value !== null) {
      const parsed = parseFloat(value)
      if (!isNaN(parsed)) {
        inputs[key].value = parsed
      }
    }
  }
}

export function generateShareableUrl(inputs: ReactiveInputs): string {
  const url = new URL(window.location.href)
  url.search = ''
  const params = new URLSearchParams()
  for (const [key, config] of Object.entries(urlParamsConfig) as [
    InputKey,
    ParamConfig,
  ][]) {
    const value = inputs[key].value
    if (value !== defaultValues[key]) {
      params.set(config.abbr, String(value))
    }
  }
  const search = params.toString()
  if (search) {
    url.search = search
  }
  return url.toString()
}

export function clearURLParams(): void {
  const url = new URL(window.location.href)
  url.search = ''
  window.history.replaceState({}, '', url.toString())
}
