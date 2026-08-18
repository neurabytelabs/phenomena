import { BUILDER_CREDIT } from '../app'
import type { ExperienceState, Phenomenon, SceneId } from '../core/types'

export interface ControlsOptions {
  root: HTMLElement
  state: ExperienceState
  onSceneSelect(scene: SceneId): void
  onParamChange(key: 'force' | 'memory' | 'scale', value: number): void
  onRemix(): void
  onPause(): void
  onInfo(): void
  onCopy(): void
  onCapture(): void
}

export interface ControlsHandle {
  element: HTMLElement
  infoButton: HTMLButtonElement
  sync(state: ExperienceState, phenomenon: Phenomenon, infoOpen: boolean): void
}

export function builderCreditMarkup(): string {
  return `<a class="credit" href="https://mustafasarac.com/" target="_blank" rel="noreferrer">${BUILDER_CREDIT}</a>`
}

function createRange(
  label: string,
  key: 'force' | 'memory' | 'scale',
  value: number,
  onParamChange: ControlsOptions['onParamChange']
): HTMLElement {
  const wrapper = document.createElement('label')
  wrapper.className = 'range-control'
  wrapper.innerHTML = `
    <span class="range-label">${label}</span>
    <input type="range" min="0" max="1" step="0.001" value="${value}" />
  `

  const input = wrapper.querySelector('input') as HTMLInputElement
  input.addEventListener('input', () => {
    onParamChange(key, Number(input.value))
  })
  input.name = key
  return wrapper
}

export function createControls(options: ControlsOptions): ControlsHandle {
  const shell = document.createElement('div')
  shell.className = 'ui-shell'
  shell.innerHTML = `
    <header class="masthead">
      <a class="skip-link" href="#controls-panel">Skip to controls</a>
      <div>
        <p class="ui-kicker">PHENOMENA</p>
        <h1 class="tagline">Touch the equation. Watch the world answer.</h1>
      </div>
      ${builderCreditMarkup()}
    </header>
    <nav class="scene-rail" aria-label="Scenes"></nav>
    <section class="controls-panel" id="controls-panel" aria-label="Controls"></section>
    <div class="actions" aria-label="Actions"></div>
  `
  options.root.append(shell)

  const rail = shell.querySelector('.scene-rail') as HTMLElement
  const panel = shell.querySelector('.controls-panel') as HTMLElement
  const actions = shell.querySelector('.actions') as HTMLElement

  const sceneButtons = new Map<SceneId, HTMLButtonElement>()
  ;(['pelagic', 'strata', 'orbit', 'chorus'] as SceneId[]).forEach((scene) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'scene-pill'
    button.textContent = scene.toUpperCase()
    button.addEventListener('click', () => options.onSceneSelect(scene))
    rail.append(button)
    sceneButtons.set(scene, button)
  })

  panel.append(
    createRange('FORCE', 'force', options.state.force, options.onParamChange),
    createRange('MEMORY', 'memory', options.state.memory, options.onParamChange),
    createRange('SCALE', 'scale', options.state.scale, options.onParamChange)
  )

  const actionButtons: Array<[string, string, () => void]> = [
    ['remix', 'Remix', options.onRemix],
    ['share', 'Share', options.onCopy],
    ['capture', 'Capture', options.onCapture],
    ['pause', 'Pause', options.onPause],
    ['info', 'Info', options.onInfo]
  ]

  const actionButtonMap = new Map<string, HTMLButtonElement>()
  actionButtons.forEach(([action, label, handler]) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'action-button'
    button.dataset.action = action
    button.textContent = label
    button.addEventListener('click', handler)
    actions.append(button)
    actionButtonMap.set(action, button)
  })

  const rangeInputs = Array.from(panel.querySelectorAll('input[type="range"]')) as HTMLInputElement[]
  const infoButton = actionButtonMap.get('info') as HTMLButtonElement
  infoButton.setAttribute('aria-controls', 'info-panel')

  return {
    element: shell,
    infoButton,
    sync(state, phenomenon, infoOpen) {
      sceneButtons.forEach((button, scene) => {
        button.dataset.active = scene === state.scene ? 'true' : 'false'
        button.setAttribute('aria-pressed', scene === state.scene ? 'true' : 'false')
      })

      rangeInputs.forEach((input) => {
        const key = input.name as 'force' | 'memory' | 'scale'
        input.value = String(state[key])
      })

      shell.dataset.infoOpen = infoOpen ? 'true' : 'false'
      shell.setAttribute('data-scene', phenomenon.id)
      infoButton.setAttribute('aria-expanded', infoOpen ? 'true' : 'false')
    }
  }
}
