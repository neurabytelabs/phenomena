import { APP_NAME, SCENE_IDS } from '../src/app'
import mainSource from '../src/main.ts?raw'
import styles from '../src/styles.css?raw'
import { builderCreditMarkup } from '../src/ui/controls'

describe('application metadata', () => {
  it('exports the exact product name', () => {
    expect(APP_NAME).toBe('PHENOMENA')
  })

  it('exports the four supported scenes', () => {
    expect(SCENE_IDS).toEqual(['pelagic', 'strata', 'orbit', 'chorus'])
  })

  it('links the builder credit to the public creator surface', () => {
    const credit = builderCreditMarkup()

    expect(credit).toContain('<a class="credit" href="https://mustafasarac.com/"')
    expect(credit).toContain('target="_blank"')
    expect(credit).toContain('rel="noreferrer"')
  })

  it('reuses the linked credit in the unsupported-canvas fallback', () => {
    expect(mainSource).toContain('${builderCreditMarkup()}')
  })

  it('keeps the builder credit visible at the 390px mobile target', () => {
    expect(styles).not.toContain(".credit {\n    display: none;")
  })
})
