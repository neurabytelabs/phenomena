import { APP_NAME, SCENE_IDS } from '../src/app'

describe('application metadata', () => {
  it('exports the exact product name', () => {
    expect(APP_NAME).toBe('PHENOMENA')
  })

  it('exports the four supported scenes', () => {
    expect(SCENE_IDS).toEqual(['pelagic', 'strata', 'orbit', 'chorus'])
  })
})
