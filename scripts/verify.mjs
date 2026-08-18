import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const htmlPath = path.join(distDir, 'index.html')
const cssPath = path.join(root, 'src', 'styles.css')
const nginxPath = path.join(root, 'nginx.conf')
const dockerfilePath = path.join(root, 'Dockerfile')
const packagePath = path.join(root, 'package.json')
const sourceRoots = ['src', 'index.html', 'public', 'package.json']
const forbiddenPatterns = [
  /getusermedia/i,
  /microphone/i,
  /camera/i,
  /analytics/i,
  /stripe/i,
  /payment/i,
  /webgpu/i,
  /tol\.is/i
]

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function readTree(currentPath) {
  const fileStat = await stat(currentPath)
  if (fileStat.isFile()) {
    return [{ path: currentPath, content: await readFile(currentPath, 'utf8') }]
  }

  const entries = await readdir(currentPath, { withFileTypes: true })
  const nested = await Promise.all(
    entries
      .filter((entry) => !entry.name.startsWith('.'))
      .map((entry) => readTree(path.join(currentPath, entry.name)))
  )
  return nested.flat()
}

async function main() {
  const html = await readFile(htmlPath, 'utf8')
  const css = await readFile(cssPath, 'utf8')
  const nginx = await readFile(nginxPath, 'utf8')
  const dockerfile = await readFile(dockerfilePath, 'utf8')
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8'))

  assert(html.includes('<title>PHENOMENA'), 'Missing PHENOMENA title in built HTML.')
  assert(html.includes('Touch the equation. Watch the world answer.'), 'Missing tagline in built HTML.')
  assert(html.includes('site.webmanifest'), 'Missing manifest link in built HTML.')
  assert(html.includes('og.svg'), 'Missing OG asset marker in built HTML.')
  assert(html.includes('theme-color'), 'Missing theme-color metadata.')
  assert(html.includes('noindex,nofollow'), 'Missing Release 1 noindex metadata.')
  assert(
    html.includes('href="https://phenomena.91-98-46-190.sslip.io/"'),
    'Canonical URL does not match the isolated deployment host.'
  )
  assert(
    html.includes('content="https://phenomena.91-98-46-190.sslip.io/"'),
    'Open Graph URL does not match the isolated deployment host.'
  )

  const distEntries = await readdir(distDir)
  assert(distEntries.includes('favicon.svg'), 'Missing generated favicon asset.')
  assert(distEntries.includes('og.svg'), 'Missing generated OG asset.')
  assert(distEntries.includes('robots.txt'), 'Missing robots.txt asset.')
  assert(distEntries.includes('site.webmanifest'), 'Missing site manifest asset.')
  const robots = await readFile(path.join(distDir, 'robots.txt'), 'utf8')
  assert(robots.includes('Disallow: /'), 'Release 1 robots policy must block crawling.')

  const assetsDir = path.join(distDir, 'assets')
  const assetEntries = await readdir(assetsDir)
  const jsAsset = assetEntries.find((entry) => /^index-[\w-]+\.js$/.test(entry))
  const cssAsset = assetEntries.find((entry) => /^index-[\w-]+\.css$/.test(entry))
  assert(Boolean(jsAsset), 'Missing hashed JavaScript asset.')
  assert(Boolean(cssAsset), 'Missing hashed CSS asset.')

  const jsStats = await stat(path.join(assetsDir, jsAsset))
  assert(jsStats.size <= 250_000, `JavaScript bundle exceeds budget: ${jsStats.size} bytes.`)

  assert(css.includes('overflow-x: hidden'), 'Missing horizontal overflow guard in CSS.')
  assert(css.includes('@media (max-width: 390px)'), 'Missing 390px mobile rule in CSS.')
  assert(css.includes('prefers-reduced-motion'), 'Missing reduced-motion CSS rule.')

  assert(nginx.includes('try_files $uri $uri/ /index.html;'), 'Missing SPA route fallback.')
  assert(nginx.includes('location /assets/'), 'Missing strict asset location.')
  assert(nginx.includes('try_files $uri =404;'), 'Missing real 404 behavior for unknown assets.')
  assert(nginx.includes('X-Robots-Tag "noindex, nofollow"'), 'Missing runtime noindex header.')
  assert(dockerfile.includes('HEALTHCHECK'), 'Missing container healthcheck.')
  assert(
    packageJson.optionalDependencies?.['@rollup/rollup-linux-x64-musl'] === '4.62.2',
    'Missing pinned Linux Rollup binary required by the Alpine build image.'
  )

  const files = (await Promise.all(sourceRoots.map((sourceRoot) => readTree(path.join(root, sourceRoot))))).flat()
  for (const file of files) {
    for (const pattern of forbiddenPatterns) {
      assert(!pattern.test(file.content), `Forbidden feature marker ${pattern} found in ${path.relative(root, file.path)}.`)
    }
  }

  console.log('verify: ok')
}

main().catch((error) => {
  console.error(`verify: failed - ${error.message}`)
  process.exitCode = 1
})
