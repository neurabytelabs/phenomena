import { createRandom, randomBetween } from './random'

export interface Body {
  x: number
  y: number
  vx: number
  vy: number
  mass: number
}

export interface GravitySource {
  x: number
  y: number
  mass: number
}

export function createSeededBodies(seed: number, count: number): Body[] {
  const random = createRandom(seed)
  const bodies: Body[] = []

  for (let index = 0; index < count; index += 1) {
    bodies.push({
      x: randomBetween(random, -0.38, 0.38),
      y: randomBetween(random, -0.28, 0.28),
      vx: randomBetween(random, -0.05, 0.05),
      vy: randomBetween(random, -0.05, 0.05),
      mass: randomBetween(random, 0.9, 1.6)
    })
  }

  return bodies
}

export function computeAcceleration(
  body: Body,
  bodies: Body[],
  softening: number,
  pointer?: GravitySource
): { ax: number; ay: number } {
  let ax = 0
  let ay = 0

  const applySource = (source: GravitySource) => {
    const dx = source.x - body.x
    const dy = source.y - body.y
    const distanceSquared = dx * dx + dy * dy + softening * softening
    const distance = Math.sqrt(distanceSquared)
    const force = source.mass / (distanceSquared * distance)
    ax += dx * force
    ay += dy * force
  }

  for (const source of bodies) {
    if (source === body) {
      continue
    }

    applySource(source)
  }

  if (pointer) {
    applySource(pointer)
  }

  return { ax, ay }
}

export function stepBodies(
  bodies: Body[],
  dt: number,
  softening: number,
  pointer?: GravitySource
): Body[] {
  const snapshot = bodies.map((body) => ({ ...body }))

  return snapshot.map((body) => {
    const { ax, ay } = computeAcceleration(body, snapshot, softening, pointer)
    const vx = body.vx + ax * dt
    const vy = body.vy + ay * dt

    return {
      ...body,
      vx,
      vy,
      x: body.x + vx * dt,
      y: body.y + vy * dt
    }
  })
}
