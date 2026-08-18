import { clamp } from './math'
import { DEFAULT_STATE, SCENE_IDS, type ExperienceState, type SceneId } from './types'

const SCENE_SET = new Set<SceneId>(SCENE_IDS)

function isSceneId(value: string | null): value is SceneId {
  return value !== null && SCENE_SET.has(value as SceneId)
}

function parseNumber(value: string | null, fallback: number): number {
  if (value === null || value.trim() === '') {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseBoolean(value: string | null, fallback: boolean): boolean {
  if (value === null) {
    return fallback
  }

  return value === '1' || value === 'true'
}

export function createSeed(): number {
  return Math.floor(Math.random() * 0xffffffff) || 1
}

export function clampState(state: ExperienceState): ExperienceState {
  return {
    scene: isSceneId(state.scene) ? state.scene : DEFAULT_STATE.scene,
    seed: Math.max(1, Math.floor(Number.isFinite(state.seed) ? state.seed : DEFAULT_STATE.seed)),
    force: clamp(state.force, 0, 1),
    memory: clamp(state.memory, 0, 1),
    scale: clamp(state.scale, 0, 1),
    paused: Boolean(state.paused)
  }
}

export function parseState(search: string): ExperienceState {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const sceneParam = params.get('scene')
  const scene = isSceneId(sceneParam) ? sceneParam : DEFAULT_STATE.scene

  return clampState({
    scene,
    seed: parseNumber(params.get('seed'), DEFAULT_STATE.seed),
    force: parseNumber(params.get('force'), DEFAULT_STATE.force),
    memory: parseNumber(params.get('memory'), DEFAULT_STATE.memory),
    scale: parseNumber(params.get('scale'), DEFAULT_STATE.scale),
    paused: parseBoolean(params.get('paused'), DEFAULT_STATE.paused)
  })
}

export function serializeState(state: ExperienceState): string {
  const safe = clampState(state)
  const params = new URLSearchParams()
  params.set('scene', safe.scene)
  params.set('seed', String(safe.seed))
  params.set('force', safe.force.toFixed(3))
  params.set('memory', safe.memory.toFixed(3))
  params.set('scale', safe.scale.toFixed(3))
  params.set('paused', safe.paused ? '1' : '0')

  return `?${params.toString()}`
}
