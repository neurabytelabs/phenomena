function normalizeSeed(seed: number): number {
  if (!Number.isFinite(seed)) {
    return 1
  }

  return (Math.floor(seed) >>> 0) || 1
}

export function createRandom(seed: number): () => number {
  let state = normalizeSeed(seed)

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function randomBetween(random: () => number, min: number, max: number): number {
  return min + (max - min) * random()
}

export function randomInt(random: () => number, min: number, max: number): number {
  return Math.floor(randomBetween(random, min, max + 1))
}
