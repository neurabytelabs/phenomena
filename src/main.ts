import { APP_NAME, BUILDER_CREDIT, DEFAULT_STATE, TAGLINE } from './app'
import { captureCanvas } from './core/capture'
import { createEngine } from './core/engine'
import { clampState, createSeed, parseState, serializeState } from './core/state'
import type { ExperienceState } from './core/types'
import { getScene } from './scenes'
import { createControls } from './ui/controls'
import { createInfo } from './ui/info'
import { createToast } from './ui/toast'
import './styles.css'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Missing #app root element.')
}

const canvas = document.createElement('canvas')
canvas.className = 'phenomena-canvas'
canvas.setAttribute('aria-label', 'Interactive living systems field. Touch, hold, remix, inspect, and share.')
root.querySelector('.canvas-fallback')?.remove()
root.append(canvas)

const overlay = document.createElement('div')
overlay.className = 'overlay'
root.append(overlay)

if (!canvas.getContext('2d')) {
  root.innerHTML = `
    <div class="unsupported">
      <h1>${APP_NAME}</h1>
      <p>${TAGLINE}</p>
      <p>Your browser cannot start the Canvas 2D instrument. Try a current browser with canvas enabled.</p>
      <p>${BUILDER_CREDIT}</p>
    </div>
  `
} else {
  let state: ExperienceState = clampState({ ...DEFAULT_STATE, ...parseState(window.location.search) })
  let infoOpen = false
  let idleTimer = 0

  const markActive = () => {
    document.body.dataset.uiState = 'active'
    window.clearTimeout(idleTimer)
    idleTimer = window.setTimeout(() => {
      document.body.dataset.uiState = 'idle'
    }, 2200)
  }

  const phenomenon = getScene(state.scene)
  const controls = createControls({
    root: overlay,
    state,
    onSceneSelect(scene) {
      setState({ ...state, scene })
    },
    onParamChange(key, value) {
      setState({ ...state, [key]: value })
    },
    onRemix() {
      setState({ ...state, seed: createSeed(), paused: false })
      toast.show(`Remixed ${state.scene.toUpperCase()} state.`)
    },
    onPause() {
      const nextPaused = !state.paused
      setState({ ...state, paused: nextPaused })
      toast.show(nextPaused ? 'Playback paused.' : 'Playback resumed.')
    },
    onInfo() {
      infoOpen = !infoOpen
      syncUi()
      markActive()
    },
    async onCopy() {
      const url = `${window.location.origin}${window.location.pathname}${serializeState(state)}`
      try {
        await navigator.clipboard.writeText(url)
        toast.show('Share link copied.')
      } catch {
        const input = document.createElement('textarea')
        input.value = url
        document.body.append(input)
        input.select()
        document.execCommand('copy')
        input.remove()
        toast.show('Share link copied with fallback.')
      }
    },
    async onCapture() {
      const size = await captureCanvas(canvas, `phenomena-${state.scene}-${state.seed}.png`)
      toast.show(`Captured ${Math.round(size / 1024)} KB PNG.`)
    }
  })
  const info = createInfo(overlay)
  const toast = createToast(overlay)

  const engine = createEngine({
    canvas,
    phenomenon,
    state,
    onActivity: markActive
  })

  function syncUrl() {
    window.history.replaceState({}, '', serializeState(state))
  }

  function syncUi() {
    const currentScene = getScene(state.scene)
    controls.sync(state, currentScene, infoOpen)
    info.sync(currentScene, infoOpen)
  }

  function setState(nextState: ExperienceState) {
    const previousScene = state.scene
    state = clampState(nextState)
    engine.setState(state)
    if (state.scene !== previousScene) {
      engine.setPhenomenon(getScene(state.scene), state)
    }
    syncUrl()
    syncUi()
    markActive()
  }

  function isFormTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false
    }

    return Boolean(target.closest('button, input, textarea, select, [contenteditable="true"]'))
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && infoOpen) {
      infoOpen = false
      syncUi()
      controls.infoButton.focus()
      markActive()
      return
    }

    if (isFormTarget(event.target)) {
      return
    }

    if (event.key >= '1' && event.key <= '4') {
      const scenes = ['pelagic', 'strata', 'orbit', 'chorus'] as const
      setState({ ...state, scene: scenes[Number(event.key) - 1] })
      toast.show(`Switched to ${state.scene.toUpperCase()}.`)
      return
    }

    if (event.key.toLowerCase() === 'r') {
      setState({ ...state, seed: createSeed(), paused: false })
      toast.show(`Remixed ${state.scene.toUpperCase()} state.`)
      return
    }

    if (event.key.toLowerCase() === 'i') {
      infoOpen = !infoOpen
      syncUi()
      markActive()
      return
    }

    if (event.code === 'Space') {
      event.preventDefault()
      const nextPaused = !state.paused
      setState({ ...state, paused: nextPaused })
      toast.show(nextPaused ? 'Playback paused.' : 'Playback resumed.')
    }
  })

  window.addEventListener('popstate', () => {
    state = parseState(window.location.search)
    engine.setPhenomenon(getScene(state.scene), state)
    syncUi()
  })

  document.title = `${APP_NAME} — ${TAGLINE}`
  document.documentElement.style.colorScheme = 'dark'
  document.body.dataset.uiState = 'active'
  document.body.dataset.credit = BUILDER_CREDIT

  syncUrl()
  syncUi()
  markActive()
}
