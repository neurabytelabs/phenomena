import { clamp, lerp, mapRange, smoothstep } from '../core/math'
import { createRandom, randomBetween } from '../core/random'
import type { FrameContext, Phenomenon, Viewport } from '../core/types'

interface Band {
  level: number
  amplitude: number
  wavelength: number
  drift: number
  phase: number
}

export function createPelagic(): Phenomenon {
  let bands: Band[] = []
  let swell = 0
  let memoryField = 0

  const buildBands = (seed: number, viewport: Viewport) => {
    const random = createRandom(seed)
    const count = Math.round(10 + viewport.density * 8)
    bands = Array.from({ length: count }, (_, index) => ({
      level: lerp(0.24, 0.88, index / Math.max(1, count - 1)),
      amplitude: randomBetween(random, 14, 48) * viewport.density,
      wavelength: randomBetween(random, 0.65, 1.6),
      drift: randomBetween(random, -0.2, 0.24),
      phase: randomBetween(random, 0, Math.PI * 2)
    }))
  }

  return {
    id: 'pelagic',
    title: 'PELAGIC',
    equation: 'h(x,t)=sin(ax+pt)+sin(bx-qt)+J(pointer, memory)',
    description: 'Contour currents drift in stacked bands that bow around your touch and settle with inertia.',
    hint: 'Sweep for current. Hold to deepen the pull. Release to watch the field remember.',
    reset(seed, viewport) {
      buildBands(seed, viewport)
      swell = 0
      memoryField = 0
    },
    update(frame) {
      const target = frame.pointer.active ? frame.pointer.influence * frame.state.force : 0
      swell = lerp(swell, target, frame.pointer.down ? 0.12 : 0.045)
      const memoryDrag = clamp(0.016 + (1 - frame.state.memory) * 0.08, 0.02, 0.1)
      memoryField = lerp(memoryField, frame.pointer.active ? frame.pointer.y : 0.64, memoryDrag)
      if (!frame.pointer.active) {
        memoryField = lerp(memoryField, 0.64, 0.012 + (1 - frame.state.memory) * 0.06)
      }
    },
    render(ctx, frame) {
      const { width, height } = frame.viewport
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#05080d')
      gradient.addColorStop(0.52, '#09131d')
      gradient.addColorStop(1, '#03070a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      ctx.lineWidth = 1
      const pointerX = frame.pointer.x * width
      const pointerY = frame.pointer.y * height
      const pointerRadius = lerp(90, 280, frame.state.scale) * frame.viewport.density
      const motion = frame.reducedMotion ? 0.2 : 1

      bands.forEach((band, index) => {
        const normalized = index / Math.max(1, bands.length - 1)
        const baseY = height * band.level
        const path = new Path2D()
        path.moveTo(0, height)
        const samples = Math.round(72 + width / 16)

        for (let sample = 0; sample <= samples; sample += 1) {
          const x = (sample / samples) * width
          const nx = x / width
          const waveA = Math.sin(nx * Math.PI * 2 * band.wavelength + frame.elapsed * band.drift * motion + band.phase)
          const waveB =
            Math.sin(nx * Math.PI * 4 * (0.7 + frame.state.scale * 1.6) - frame.elapsed * 0.22 * motion) *
            0.38
          const distance = Math.hypot(x - pointerX, baseY - pointerY)
          const local = Math.exp(-(distance * distance) / (pointerRadius * pointerRadius))
          const contour = waveA + waveB + local * swell * 4.2
          const y =
            baseY -
            band.amplitude * contour * (0.35 + frame.state.scale * 0.8) -
            smoothstep(0.25, 0.9, normalized) * height * 0.04 * memoryField

          path.lineTo(x, y)
        }

        path.lineTo(width, height)
        path.closePath()
        ctx.fillStyle = `hsla(${mapRange(normalized, 0, 1, 184, 213)}, 56%, ${mapRange(
          normalized,
          0,
          1,
          12,
          34
        )}%, ${0.1 + normalized * 0.13})`
        ctx.fill(path)

        ctx.strokeStyle = `hsla(${mapRange(normalized, 0, 1, 184, 198)}, 62%, 86%, ${0.22 + normalized * 0.42})`
        ctx.stroke(path)
      })

      ctx.strokeStyle = 'rgba(198, 236, 255, 0.18)'
      ctx.beginPath()
      ctx.moveTo(0, height * 0.17)
      for (let x = 0; x <= width; x += 12) {
        ctx.lineTo(x, height * 0.15 + Math.sin(x * 0.004 + frame.elapsed * 0.12 * motion) * 10)
      }
      ctx.stroke()
    }
  }
}
