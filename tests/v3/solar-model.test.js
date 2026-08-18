import {
  computeResults,
  defaultValues,
  buildAssumptionsText,
  formatCurrency,
  urlParamAbbreviations,
} from '../../v3/src/scripts/solar/model.js'

describe('solar cost model', () => {
  it('computes the documented totals for the default assumptions', () => {
    const results = computeResults(defaultValues)
    expect(results.utilityAnnualCosts).toHaveLength(30)
    expect(results.solarAndBatteryAnnualCosts).toHaveLength(30)
    // Year 1: full utility bill vs. solar + battery + 20% grid fee.
    expect(results.utilityAnnualCosts[0]).toBe(2400)
    expect(results.solarAndBatteryAnnualCosts[0]).toBe(10200 + 14500 + 480)
    // Regression pins for the cumulative totals.
    expect(results.nominalCumulativeUtility).toBeCloseTo(97363.39, 2)
    expect(results.nominalCumulativeSolarAndBattery).toBeCloseTo(61427.68, 2)
    expect(results.cumulativeUtility).toBeCloseTo(171844.31, 2)
    expect(results.cumulativeSolarAndBattery).toBeCloseTo(142896.7, 2)
    expect(results.savings).toBeCloseTo(28947.61, 2)
  })

  it('has zero opportunity cost when the investment rate is zero', () => {
    const results = computeResults({ ...defaultValues, opportunityCostRate: 0 })
    expect(results.opportunityCostUtility).toBe(0)
    expect(results.opportunityCostSolarAndBattery).toBe(0)
    expect(results.cumulativeUtility).toBe(results.nominalCumulativeUtility)
  })

  it('replaces the battery at each lifespan boundary with the cost decrease', () => {
    const results = computeResults({
      ...defaultValues,
      duration: 21,
      batteryLife: 10,
      batteryCostDecrease: 50,
      unavoidableUtilityPercent: 0,
      utilityCostIncrease: 0,
    })
    // Year 1: solar + battery. Year 11: half-price battery. Year 21: quarter.
    expect(results.solarAndBatteryAnnualCosts[0]).toBe(10200 + 14500)
    expect(results.solarAndBatteryAnnualCosts[10]).toBe(14500 / 2)
    expect(results.solarAndBatteryAnnualCosts[20]).toBe(14500 / 4)
  })

  it('scales system costs with the size of the utility bill', () => {
    const results = computeResults({
      ...defaultValues,
      initialUtilityCost: 4800,
      unavoidableUtilityPercent: 0,
    })
    // Double the reference bill doubles the estimated system cost.
    expect(results.solarAndBatteryAnnualCosts[0]).toBe((10200 + 14500) * 2)
  })

  it('formats currency without cents', () => {
    expect(formatCurrency(28947.61)).toBe('$28,948')
    expect(formatCurrency(0)).toBe('$0')
  })

  it('summarizes the assumptions in a sentence', () => {
    const text = buildAssumptionsText(defaultValues)
    expect(text).toContain('over 30 years')
    expect(text).toContain('$2,400 annual utility bill')
    expect(text).toContain('10-year battery lifespan')
  })

  it('keeps the shareable-link URL abbreviations stable', () => {
    // Existing shared links depend on these exact keys.
    expect(urlParamAbbreviations).toEqual({
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
    })
  })
})
