import { clamp, lerp } from './math'
import type { PointerState } from './types'

function createPointerState(): PointerState {
  return {
    active: false,
    down: false,
    x: 0.5,
    y: 0.5,
    hold: 0,
    influence: 0,
    velocityX: 0,
    velocityY: 0
  }
}

export interface InputController {
  state: PointerState
  update(delta: number): void
  destroy(): void
}

export function attachPointerInput(
  target: HTMLElement,
  onActivity: () => void
): InputController {
  const state = createPointerState()
  let previousX = state.x
  let previousY = state.y

  const updatePosition = (event: PointerEvent) => {
    const rect = target.getBoundingClientRect()
    const nextX = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const nextY = clamp((event.clientY - rect.top) / rect.height, 0, 1)
    state.velocityX = nextX - previousX
    state.velocityY = nextY - previousY
    state.x = nextX
    state.y = nextY
    previousX = nextX
    previousY = nextY
  }

  const handlePointerMove = (event: PointerEvent) => {
    updatePosition(event)
    state.active = true
    onActivity()
  }

  const handlePointerDown = (event: PointerEvent) => {
    target.setPointerCapture(event.pointerId)
    updatePosition(event)
    state.active = true
    state.down = true
    onActivity()
  }

  const releasePointer = () => {
    state.down = false
  }

  const handlePointerLeave = () => {
    state.active = state.down
  }

  target.addEventListener('pointermove', handlePointerMove)
  target.addEventListener('pointerdown', handlePointerDown)
  target.addEventListener('pointerup', releasePointer)
  target.addEventListener('pointercancel', releasePointer)
  target.addEventListener('pointerleave', handlePointerLeave)

  return {
    state,
    update(delta) {
      const attack = state.down ? 0.0018 : 0
      const release = state.down ? 0 : 0.0022

      state.hold = clamp(state.hold + delta * attack - delta * release, 0, 1)
      const targetInfluence = state.active ? (state.down ? 0.45 + state.hold * 0.55 : 0.24) : 0
      state.influence = lerp(state.influence, targetInfluence, state.down ? 0.16 : 0.06)
      state.velocityX = lerp(state.velocityX, 0, 0.2)
      state.velocityY = lerp(state.velocityY, 0, 0.2)

      if (!state.down && state.influence < 0.01) {
        state.active = false
      }
    },
    destroy() {
      target.removeEventListener('pointermove', handlePointerMove)
      target.removeEventListener('pointerdown', handlePointerDown)
      target.removeEventListener('pointerup', releasePointer)
      target.removeEventListener('pointercancel', releasePointer)
      target.removeEventListener('pointerleave', handlePointerLeave)
    }
  }
}
