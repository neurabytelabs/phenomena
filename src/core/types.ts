export const SCENE_IDS = ['pelagic', 'strata', 'orbit', 'chorus'] as const

export type SceneId = (typeof SCENE_IDS)[number]

export interface ExperienceState {
  scene: SceneId
  seed: number
  force: number
  memory: number
  scale: number
  paused: boolean
}

export interface Viewport {
  width: number
  height: number
  aspect: number
  dpr: number
  pixelWidth: number
  pixelHeight: number
  density: number
  coarsePointer: boolean
}

export interface PointerState {
  active: boolean
  down: boolean
  x: number
  y: number
  hold: number
  influence: number
  velocityX: number
  velocityY: number
}

export interface FrameContext {
  elapsed: number
  delta: number
  viewport: Viewport
  pointer: PointerState
  state: ExperienceState
  reducedMotion: boolean
  density: number
}

export interface Phenomenon {
  id: SceneId
  title: string
  equation: string
  description: string
  hint: string
  reset(seed: number, viewport: Viewport): void
  update(frame: FrameContext): void
  render(ctx: CanvasRenderingContext2D, frame: FrameContext): void
}

export const DEFAULT_STATE: ExperienceState = {
  scene: 'pelagic',
  seed: 1729,
  force: 0.54,
  memory: 0.48,
  scale: 0.5,
  paused: false
}
