export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount
}

export function mapRange(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
): number {
  if (inputMin === inputMax) {
    return outputMin
  }

  const amount = (value - inputMin) / (inputMax - inputMin)
  return lerp(outputMin, outputMax, amount)
}

export function smoothstep(min: number, max: number, value: number): number {
  const amount = clamp((value - min) / (max - min), 0, 1)
  return amount * amount * (3 - 2 * amount)
}

export function capDpr(input: number, max = 1.5): number {
  if (!Number.isFinite(input) || input <= 0) {
    return 1
  }

  return clamp(input, 1, max)
}

export function adaptiveDensity(
  width: number,
  height: number,
  coarsePointer: boolean,
  reducedMotion: boolean
): number {
  const area = Math.max(1, width * height)
  const base = clamp(Math.sqrt(area / (1440 * 900)), 0.72, 1.18)
  const coarseFactor = coarsePointer ? 0.82 : 1
  const motionFactor = reducedMotion ? 0.76 : 1

  return clamp(base * coarseFactor * motionFactor, 0.5, 1.15)
}
