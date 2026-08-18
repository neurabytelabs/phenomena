export async function captureCanvas(
  canvas: HTMLCanvasElement,
  filename: string
): Promise<number> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png')
  })

  if (!blob) {
    throw new Error('PNG capture failed.')
  }

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1_000)
  return blob.size
}
