import { ref, type Ref } from 'vue'
import type { TemperatureDataPoint } from './api'
import type { HSVColor } from './colors'

export type TemperatureMode = 'anomaly' | 'absolute'

export const DEFAULT_LOW_COLOR = '#0000ff'
export const DEFAULT_LOW_MID_COLOR = '#00ffff'
export const DEFAULT_MID_COLOR = '#ffffff'
export const DEFAULT_HIGH_MID_COLOR = '#ffff00'
export const DEFAULT_HIGH_COLOR = '#ff0000'

export interface TemperatureColorStops {
  low: Ref<HSVColor>
  lowMid: Ref<HSVColor>
  mid: Ref<HSVColor>
  highMid: Ref<HSVColor>
  high: Ref<HSVColor>
}

export interface TemperatureState {
  currentMode: Ref<TemperatureMode>
  originalData: Ref<TemperatureDataPoint[]>
  filtered3MonthData: Ref<TemperatureDataPoint[]>
  filtered5MonthData: Ref<TemperatureDataPoint[]>
  colorLow: Ref<HSVColor>
  colorLowMid: Ref<HSVColor>
  colorMid: Ref<HSVColor>
  colorHighMid: Ref<HSVColor>
  colorHigh: Ref<HSVColor>
  monthlyBaselineTemps: Ref<Map<number, number>>
  annualOverallBaselineTempC: Ref<number>
}

export function useTemperatureState(): TemperatureState {
  const currentMode = ref<TemperatureMode>('anomaly')

  const originalData = ref<TemperatureDataPoint[]>([])
  const filtered3MonthData = ref<TemperatureDataPoint[]>([])
  const filtered5MonthData = ref<TemperatureDataPoint[]>([])

  const colorLow = ref<HSVColor>({ h: 240, s: 100, v: 100 })
  const colorLowMid = ref<HSVColor>({ h: 180, s: 100, v: 100 })
  const colorMid = ref<HSVColor>({ h: 0, s: 0, v: 100 })
  const colorHighMid = ref<HSVColor>({ h: 60, s: 100, v: 100 })
  const colorHigh = ref<HSVColor>({ h: 0, s: 100, v: 100 })

  const monthlyBaselineTemps = ref<Map<number, number>>(new Map())
  const annualOverallBaselineTempC = ref<number>(13.0)

  return {
    currentMode,
    originalData,
    filtered3MonthData,
    filtered5MonthData,
    colorLow,
    colorLowMid,
    colorMid,
    colorHighMid,
    colorHigh,
    monthlyBaselineTemps,
    annualOverallBaselineTempC,
  }
}
