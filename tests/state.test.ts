import { parseState, serializeState } from '../src/core/state'

describe('state parsing', () => {
  it('falls back to the default scene for unknown scene ids', () => {
    expect(parseState('?scene=unknown').scene).toBe('pelagic')
  })

  it('clamps numeric values into safe bounds', () => {
    expect(parseState('?force=4&memory=-2&scale=88&seed=-3')).toMatchObject({
      force: 1,
      memory: 0,
      scale: 1,
      seed: 1
    })
  })

  it('ignores malformed values', () => {
    expect(parseState('?force=nope&memory=hello&scale=abc&paused=wat')).toMatchObject({
      force: 0.54,
      memory: 0.48,
      scale: 0.5,
      paused: false
    })
  })

  it('round-trips through serialization', () => {
    const parsed = parseState('?scene=chorus&seed=42&force=0.333&memory=0.666&scale=0.999&paused=1')
    expect(parseState(serializeState(parsed))).toEqual(parsed)
  })
})
