import { lerp, mapRange } from '../core/math'
import { createRandom, randomBetween } from '../core/random'
import type { FrameContext, Phenomenon, Viewport } from '../core/types'

interface Voice {
  phase: number
  rateX: number
  rateY: number
  amplitude: number
}

export function createChorus(): Phenomenon {
  let voices: Voice[] = []

  const initialize = (seed: number, viewport: Viewport) => {
    const random = createRandom(seed)
    const count = Math.round(8 + viewport.density * 8)
    voices = Array.from({ length: count }, () => ({
      phase: randomBetween(random, 0, Math.PI * 2),
      rateX: randomBetween(random, 1, 4),
      rateY: randomBetween(random, 2, 5),
      amplitude: randomBetween(random, 0.12, 0.42)
    }))
  }

  return {
    id: 'chorus',
    title: 'CHORUS',
    equation: 'x=sin(at+φ), y=sin(bt+κ·pointer)',
    description: 'A harmonic lattice braids phase relationships into a slow visual chorus without any audio.',
    hint: 'Move to retune the phase. Hold to tighten the coupling between the voices.',
    reset(seed, viewport) {
      initialize(seed, viewport)
    },
    update() {},
    render(ctx, frame) {
      const { width, height } = frame.viewport
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#09050c')
      gradient.addColorStop(0.45, '#170d16')
      gradient.addColorStop(1, '#040405')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      const motion = frame.reducedMotion ? 0.18 : 1
      const coupling = frame.pointer.active ? frame.pointer.influence * (0.8 + frame.state.force) : 0.08
      const phaseBias = frame.pointer.active ? lerp(-Math.PI, Math.PI, frame.pointer.x) : 0

      voices.forEach((voice, index) => {
        const normalized = index / Math.max(1, voices.length - 1)
        const centerY = lerp(height * 0.18, height * 0.82, normalized)
        const amplitude = voice.amplitude * height * (0.22 + frame.state.scale * 0.48)
        const samples = Math.round(100 + width / 14)

        ctx.beginPath()
        for (let sample = 0; sample <= samples; sample += 1) {
          const t = sample / samples
          const x =
            width * 0.08 +
            t * width * 0.84 +
            Math.sin(t * Math.PI * 2 * voice.rateX + frame.elapsed * 0.4 * motion + voice.phase + phaseBias) *
              18 *
              coupling
          const y =
            centerY +
            Math.sin(t * Math.PI * 2 * voice.rateY + frame.elapsed * (0.2 + normalized * 0.22) * motion + voice.phase) *
              amplitude *
              (0.28 + coupling * 0.72)
          if (sample === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.strokeStyle = `hsla(${mapRange(normalized, 0, 1, 312, 24)}, 78%, 76%, ${0.2 + normalized * 0.45})`
        ctx.lineWidth = 1.1 + normalized * 0.6
        ctx.stroke()
      })
    }
  }
}
