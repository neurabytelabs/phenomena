import { adaptiveDensity, capDpr, clamp } from './math'
import { attachPointerInput, type InputController } from './input'
import type { ExperienceState, FrameContext, Phenomenon, Viewport } from './types'

export interface EngineOptions {
  canvas: HTMLCanvasElement
  phenomenon: Phenomenon
  state: ExperienceState
  onActivity: () => void
}

export interface EngineHandle {
  setState(state: ExperienceState): void
  setPhenomenon(phenomenon: Phenomenon, state: ExperienceState): void
  resize(): void
  renderNow(): void
  getViewport(): Viewport
  destroy(): void
}

function createViewport(
  canvas: HTMLCanvasElement,
  reducedMotion: boolean,
  coarsePointer: boolean
): Viewport {
  const width = Math.max(1, canvas.clientWidth || window.innerWidth)
  const height = Math.max(1, canvas.clientHeight || window.innerHeight)
  const dpr = capDpr(window.devicePixelRatio || 1)
  const density = adaptiveDensity(width, height, coarsePointer, reducedMotion)

  return {
    width,
    height,
    aspect: width / height,
    dpr,
    pixelWidth: Math.round(width * dpr),
    pixelHeight: Math.round(height * dpr),
    density,
    coarsePointer
  }
}

export function createEngine(options: EngineOptions): EngineHandle {
  const context = options.canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context is unavailable.')
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const coarsePointerQuery = window.matchMedia('(pointer: coarse)')
  let state = options.state
  let phenomenon = options.phenomenon
  let input: InputController = attachPointerInput(options.canvas, options.onActivity)
  let reducedMotion = reducedMotionQuery.matches
  let coarsePointer = coarsePointerQuery.matches
  let viewport = createViewport(options.canvas, reducedMotion, coarsePointer)
  let elapsed = 0
  let lastFrame = performance.now()
  let frameId = 0

  const resize = () => {
    reducedMotion = reducedMotionQuery.matches
    coarsePointer = coarsePointerQuery.matches
    viewport = createViewport(options.canvas, reducedMotion, coarsePointer)
    options.canvas.width = viewport.pixelWidth
    options.canvas.height = viewport.pixelHeight
    options.canvas.style.width = `${viewport.width}px`
    options.canvas.style.height = `${viewport.height}px`
    context.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0)
    phenomenon.reset(state.seed, viewport)
  }

  const renderFrame = (now: number) => {
    frameId = window.requestAnimationFrame(renderFrame)
    const rawDelta = clamp(now - lastFrame, 8, 40)
    lastFrame = now
    input.update(rawDelta)
    const delta = reducedMotion ? Math.min(rawDelta, 16) : rawDelta

    if (!state.paused) {
      elapsed += delta / 1000
      phenomenon.update({
        elapsed,
        delta: delta / 1000,
        viewport,
        pointer: input.state,
        state,
        reducedMotion,
        density: viewport.density
      })
    }

    context.clearRect(0, 0, viewport.width, viewport.height)
    phenomenon.render(context, {
      elapsed,
      delta: delta / 1000,
      viewport,
      pointer: input.state,
      state,
      reducedMotion,
      density: viewport.density
    })
  }

  resize()
  frameId = window.requestAnimationFrame(renderFrame)
  window.addEventListener('resize', resize)
  reducedMotionQuery.addEventListener('change', resize)
  coarsePointerQuery.addEventListener('change', resize)

  return {
    setState(nextState) {
      const sceneChanged = nextState.scene !== state.scene || nextState.seed !== state.seed
      state = nextState
      if (sceneChanged) {
        phenomenon.reset(state.seed, viewport)
      }
    },
    setPhenomenon(nextPhenomenon, nextState) {
      phenomenon = nextPhenomenon
      state = nextState
      phenomenon.reset(state.seed, viewport)
    },
    resize,
    renderNow() {
      phenomenon.render(context, {
        elapsed,
        delta: 0,
        viewport,
        pointer: input.state,
        state,
        reducedMotion,
        density: viewport.density
      })
    },
    getViewport() {
      return viewport
    },
    destroy() {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      reducedMotionQuery.removeEventListener('change', resize)
      coarsePointerQuery.removeEventListener('change', resize)
      input.destroy()
    }
  }
}
