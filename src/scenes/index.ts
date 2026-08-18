import { createChorus } from './chorus'
import { createOrbit } from './orbit'
import { createPelagic } from './pelagic'
import { createStrata } from './strata'
import type { Phenomenon, SceneId } from '../core/types'

const SCENES: Record<SceneId, Phenomenon> = {
  pelagic: createPelagic(),
  strata: createStrata(),
  orbit: createOrbit(),
  chorus: createChorus()
}

export function getScene(sceneId: SceneId): Phenomenon {
  return SCENES[sceneId]
}
