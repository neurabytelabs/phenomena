export interface ToastHandle {
  element: HTMLElement
  show(message: string): void
}

export function createToast(root: HTMLElement): ToastHandle {
  const element = document.createElement('div')
  element.className = 'toast'
  element.setAttribute('role', 'status')
  element.setAttribute('aria-live', 'polite')
  root.append(element)

  let timer = 0

  return {
    element,
    show(message) {
      element.textContent = message
      element.dataset.visible = 'true'
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        element.dataset.visible = 'false'
      }, 2200)
    }
  }
}
