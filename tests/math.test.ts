import { adaptiveDensity, capDpr, clamp, lerp } from '../src/core/math'

describe('math helpers', () => {
  it('clamps values inside the provided range', () => {
    expect(clamp(-2, 0, 1)).toBe(0)
    expect(clamp(2, 0, 1)).toBe(1)
    expect(clamp(0.4, 0, 1)).toBe(0.4)
  })

  it('interpolates between numbers', () => {
    expect(lerp(10, 20, 0.25)).toBe(12.5)
  })

  it('caps invalid dpr values safely', () => {
    expect(capDpr(0)).toBe(1)
    expect(capDpr(4)).toBe(1.5)
    expect(capDpr(1.5)).toBe(1.5)
  })

  it('adapts density within expected bounds', () => {
    expect(adaptiveDensity(390, 844, true, false)).toBeGreaterThanOrEqual(0.5)
    expect(adaptiveDensity(1512, 888, false, false)).toBeLessThanOrEqual(1.15)
    expect(adaptiveDensity(1512, 888, false, true)).toBeLessThan(adaptiveDensity(1512, 888, false, false))
  })
})
