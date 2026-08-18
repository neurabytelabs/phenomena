import type { Phenomenon } from '../core/types'

export interface InfoHandle {
  element: HTMLElement
  sync(phenomenon: Phenomenon, open: boolean): void
}

export function createInfo(root: HTMLElement): InfoHandle {
  const panel = document.createElement('aside')
  panel.className = 'info-panel'
  panel.id = 'info-panel'
  panel.innerHTML = `
    <p class="ui-kicker">Inspection</p>
    <h2 class="info-title"></h2>
    <p class="info-equation"></p>
    <p class="info-description"></p>
    <p class="info-hint"></p>
  `
  root.append(panel)

  const title = panel.querySelector('.info-title') as HTMLElement
  const equation = panel.querySelector('.info-equation') as HTMLElement
  const description = panel.querySelector('.info-description') as HTMLElement
  const hint = panel.querySelector('.info-hint') as HTMLElement

  return {
    element: panel,
    sync(phenomenon, open) {
      title.textContent = phenomenon.title
      equation.textContent = phenomenon.equation
      description.textContent = phenomenon.description
      hint.textContent = phenomenon.hint
      panel.dataset.open = open ? 'true' : 'false'
      panel.setAttribute('aria-hidden', open ? 'false' : 'true')
      panel.toggleAttribute('inert', !open)
    }
  }
}
