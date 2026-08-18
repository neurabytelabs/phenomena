import { chorusTemporalRate } from '../src/scenes/chorus'
import { orbitTrailLimit } from '../src/scenes/orbit'
import { strataMotionFactor } from '../src/scenes/strata'

describe('scene parameter grammar', () => {
  it('maps ORBIT memory to trail persistence', () => {
    expect(orbitTrailLimit(0, 1)).toBe(72)
    expect(orbitTrailLimit(1, 1)).toBe(172)
  })

  it('maps CHORUS memory to temporal persistence', () => {
    expect(chorusTemporalRate(0)).toBeCloseTo(1.25)
    expect(chorusTemporalRate(1)).toBeCloseTo(0.45)
  })

  it('reduces STRATA motion when reduced motion is requested', () => {
    expect(strataMotionFactor(false)).toBe(1)
    expect(strataMotionFactor(true)).toBe(0.15)
  })
})
