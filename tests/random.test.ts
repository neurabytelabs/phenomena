import { createRandom } from '../src/core/random'

describe('createRandom', () => {
  it('produces the same sequence for the same seed', () => {
    const a = createRandom(12345)
    const b = createRandom(12345)
    const sequenceA = Array.from({ length: 5 }, () => Number(a().toFixed(8)))
    const sequenceB = Array.from({ length: 5 }, () => Number(b().toFixed(8)))

    expect(sequenceA).toEqual(sequenceB)
    expect(sequenceA).toEqual([0.97972827, 0.30675226, 0.48420542, 0.81793441, 0.50942837])
  })

  it('changes sequence when the seed changes', () => {
    const first = createRandom(1)()
    const second = createRandom(2)()
    expect(first).not.toBe(second)
  })
})
