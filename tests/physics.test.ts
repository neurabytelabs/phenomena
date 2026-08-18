import { computeAcceleration, createSeededBodies, stepBodies } from '../src/core/physics'

describe('physics', () => {
  it('uses softening to avoid singularities', () => {
    const [body] = createSeededBodies(10, 1)
    const acceleration = computeAcceleration(body, [{ ...body }], 0.08)
    expect(Number.isFinite(acceleration.ax)).toBe(true)
    expect(Number.isFinite(acceleration.ay)).toBe(true)
  })

  it('reproduces seeded initial conditions', () => {
    expect(createSeededBodies(99, 4)).toEqual(createSeededBodies(99, 4))
  })

  it('remains finite over a long bounded simulation', () => {
    let bodies = createSeededBodies(12, 4)

    for (let step = 0; step < 10_000; step += 1) {
      bodies = stepBodies(bodies, 0.005, 0.09)
    }

    for (const body of bodies) {
      expect(Number.isFinite(body.x)).toBe(true)
      expect(Number.isFinite(body.y)).toBe(true)
      expect(Number.isFinite(body.vx)).toBe(true)
      expect(Number.isFinite(body.vy)).toBe(true)
    }
  })
})
