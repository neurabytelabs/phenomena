import { clamp, lerp } from '../core/math'
import { createSeededBodies, stepBodies, type Body, type GravitySource } from '../core/physics'
import type { FrameContext, Phenomenon, Viewport } from '../core/types'

interface TrailPoint {
  x: number
  y: number
}

export function createOrbit(): Phenomenon {
  let bodies: Body[] = []
  let trails: TrailPoint[][] = []
  let historyLimit = 96

  const initialize = (seed: number, viewport: Viewport) => {
    bodies = createSeededBodies(seed, 4).map((body, index) => ({
      ...body,
      x: body.x + (index - 1.5) * 0.08,
      vy: body.vy + (index % 2 === 0 ? 0.18 : -0.18)
    }))
    trails = bodies.map(() => [])
    historyLimit = Math.round(56 + viewport.density * 70)
  }

  return {
    id: 'orbit',
    title: 'ORBIT',
    equation: 'ẍ = Σ Gm(r)/(r²+ε²)^(3/2)',
    description: 'A small gravity field draws quiet trail structures that bend around a temporary attractor.',
    hint: 'Hover to redirect the system. Hold to strengthen the attractor, then let the bodies settle again.',
    reset(seed, viewport) {
      initialize(seed, viewport)
    },
    update(frame) {
      const pointer: GravitySource | undefined = frame.pointer.active
        ? {
            x: lerp(-0.5, 0.5, frame.pointer.x),
            y: lerp(-0.35, 0.35, frame.pointer.y),
            mass: 0.9 + frame.pointer.influence * (1.8 + frame.state.force * 2.2)
          }
        : undefined
      const iterations = frame.reducedMotion ? 1 : 2
      const step = clamp(frame.delta / iterations, 0.004, 0.018)

      for (let iteration = 0; iteration < iterations; iteration += 1) {
        bodies = stepBodies(bodies, step, 0.08 + (1 - frame.state.scale) * 0.05, pointer)
      }

      bodies.forEach((body, index) => {
        const trail = trails[index]
        trail.push({ x: body.x, y: body.y })
        if (trail.length > historyLimit) {
          trail.shift()
        }
      })
    },
    render(ctx, frame) {
      const { width, height } = frame.viewport
      const gradient = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.65)
      gradient.addColorStop(0, '#08111c')
      gradient.addColorStop(1, '#040608')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      trails.forEach((trail, index) => {
        if (trail.length < 2) {
          return
        }

        ctx.beginPath()
        trail.forEach((point, pointIndex) => {
          const x = width * 0.5 + point.x * width * 0.64
          const y = height * 0.5 + point.y * height * 0.92
          if (pointIndex === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.strokeStyle = `hsla(${188 + index * 26}, 74%, 74%, ${0.22 + index * 0.08})`
        ctx.lineWidth = 1.2
        ctx.stroke()
      })

      bodies.forEach((body, index) => {
        const x = width * 0.5 + body.x * width * 0.64
        const y = height * 0.5 + body.y * height * 0.92
        ctx.beginPath()
        ctx.arc(x, y, 3.2 + index, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${194 + index * 24}, 82%, 80%, 0.95)`
        ctx.fill()
      })
    }
  }
}
