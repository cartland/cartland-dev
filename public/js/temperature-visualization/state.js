// state.js

// Constants
export const ORIGINAL_DATA_FILE_PATH =
  '../../global-temperatures/hadcrut-1850-1900.csv'
export const FILTERED_3_MONTH_DATA_FILE_PATH =
  '../../global-temperatures/hadcrut-1850-1900-f3m.csv'
export const FILTERED_5_MONTH_DATA_FILE_PATH =
  '../../global-temperatures/hadcrut-1850-1900-f5m.csv'
export const BASELINE_FILE_PATH =
  '../../global-temperatures/base-1850-1900.json'
export const DEFAULT_LOW_COLOR_HEX = '#3300FF'
export const DEFAULT_LOW_MID_COLOR_HEX = '#50A0C0'
export const DEFAULT_MID_COLOR_HEX = '#FFFFFF'
export const DEFAULT_HIGH_MID_COLOR_HEX = '#FFB000'
export const DEFAULT_HIGH_COLOR_HEX = '#990000'

// Mutable State
export let monthlyBaselineTemps = new Map()
export let annualOverallBaselineTempC
export let currentMode = 'temperature'
export let originalData = []
export let filtered3MonthData = []
export let filtered5MonthData = []
export let lowColor = { h: 0, s: 0, v: 0 }
export let lowMidColor = { h: 0, s: 0, v: 0 }
export let midColor = { h: 0, s: 0, v: 0 }
export let highMidColor = { h: 0, s: 0, v: 0 }
export let highColor = { h: 0, s: 0, v: 0 }

// State Setters
export function setCurrentMode(mode) {
  currentMode = mode
}
export function setOriginalData(data) {
  originalData = data
}
export function setFiltered3MonthData(data) {
  filtered3MonthData = data
}
export function setFiltered5MonthData(data) {
  filtered5MonthData = data
}
export function setLowColor(color) {
  lowColor = color
}
export function setLowMidColor(color) {
  lowMidColor = color
}
export function setMidColor(color) {
  midColor = color
}
export function setHighMidColor(color) {
  highMidColor = color
}
export function setHighColor(color) {
  highColor = color
}
export function setAnnualOverallBaselineTempC(temp) {
  annualOverallBaselineTempC = temp
}
