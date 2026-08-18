import { clamp, lerp, mapRange } from '../core/math'
import { createRandom, randomBetween } from '../core/random'
import type { FrameContext, Phenomenon, Viewport } from '../core/types'

interface Layer {
  level: number
  amplitude: number
  skew: number
  phase: number
  roughness: number
}

interface Pulse {
  x: number
  y: number
  radius: number
  strength: number
}

export function createStrata(): Phenomenon {
  let layers: Layer[] = []
  let pulses: Pulse[] = []
  let pressure = 0
  let previousDown = false

  const buildLayers = (seed: number, viewport: Viewport) => {
    const random = createRandom(seed)
    const count = Math.round(9 + viewport.density * 7)
    layers = Array.from({ length: count }, (_, index) => ({
      level: lerp(0.18, 0.88, index / Math.max(1, count - 1)),
      amplitude: randomBetween(random, 12, 44) * viewport.density,
      skew: randomBetween(random, -0.28, 0.26),
      phase: randomBetween(random, 0, Math.PI * 2),
      roughness: randomBetween(random, 0.8, 2.1)
    }))
  }

  return {
    id: 'strata',
    title: 'STRATA',
    equation: 'z(x,t)=ridge(x)+fault(x,t)+P(hold)-R(release)',
    description: 'Compressed layers bend into pressure ridges, then crack outward in short fracture rings.',
    hint: 'Press to accumulate strain. Release to send a bounded fracture through the field.',
    reset(seed, viewport) {
      buildLayers(seed, viewport)
      pulses = []
      pressure = 0
      previousDown = false
    },
    update(frame) {
      pressure = lerp(pressure, frame.pointer.down ? frame.pointer.hold * frame.state.force : 0, frame.pointer.down ? 0.1 : 0.08)

      if (previousDown && !frame.pointer.down && pressure > 0.08) {
        pulses.push({
          x: frame.pointer.x,
          y: frame.pointer.y,
          radius: 0.04,
          strength: clamp(pressure * (0.6 + frame.state.scale), 0.12, 1)
        })
      }

      previousDown = frame.pointer.down
      pulses = pulses
        .map((pulse) => ({
          ...pulse,
          radius: pulse.radius + frame.delta * (0.36 + frame.state.scale * 0.48),
          strength: pulse.strength * (0.986 - (1 - frame.state.memory) * 0.012)
        }))
        .filter((pulse) => pulse.radius < 1.4 && pulse.strength > 0.03)
    },
    render(ctx, frame) {
      const { width, height } = frame.viewport
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#09080b')
      gradient.addColorStop(0.45, '#15100e')
      gradient.addColorStop(1, '#050505')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      const pointerX = frame.pointer.x * width
      const pointerY = frame.pointer.y * height

      layers.forEach((layer, index) => {
        const normalized = index / Math.max(1, layers.length - 1)
        const baseY = height * layer.level
        ctx.beginPath()

        for (let sample = 0; sample <= width; sample += 10) {
          const nx = sample / width
          const ridge =
            Math.sin(nx * Math.PI * (2.6 + frame.state.scale * 3.4) + layer.phase) * layer.amplitude +
            Math.cos(nx * Math.PI * 11 * layer.roughness + frame.elapsed * 0.04) * layer.amplitude * 0.18
          const tilt = (nx - 0.5) * width * layer.skew * (0.25 + frame.state.scale * 0.55)
          const pointerDistance = Math.hypot(sample - pointerX, baseY - pointerY)
          const indentation = Math.exp(-(pointerDistance * pointerDistance) / (11000 + frame.state.force * 24000))
          let y = baseY + ridge + tilt - indentation * pressure * 80

          for (const pulse of pulses) {
            const dx = nx - pulse.x
            const dy = baseY / height - pulse.y
            const ringDistance = Math.abs(Math.hypot(dx, dy) - pulse.radius)
            y -= Math.max(0, 1 - ringDistance * 18) * pulse.strength * 28
          }

          if (sample === 0) {
            ctx.moveTo(sample, y)
          } else {
            ctx.lineTo(sample, y)
          }
        }

        ctx.strokeStyle = `hsla(${mapRange(normalized, 0, 1, 22, 42)}, 56%, ${mapRange(
          normalized,
          0,
          1,
          72,
          46
        )}%, ${0.24 + normalized * 0.34})`
        ctx.lineWidth = normalized < 0.45 ? 1.3 : 0.9
        ctx.stroke()
      })
    }
  }
}
