#!/usr/bin/env node
/**
 * Builds every brand asset for The Haven from the brand fonts:
 *   brand-kit/        wordmark, stacked wordmark, monogram, app icon, splash, posters, brand sheet
 *   app/icon.svg      website favicon
 *   public/posters/   website posters
 *   mobile/assets/    app icon, adaptive icon, favicon, splash, posters
 *
 * The logo is text only: italic gold "the", Fraunces Bold "Haven", and a gold full stop (the light).
 * Letters are converted to outlines so the SVGs render the same everywhere.
 *
 *   node scripts/brand/build.mjs        (needs Google Chrome installed for the PNGs)
 */
import fs from 'node:fs'
import path from 'node:path'
import opentype from 'opentype.js'
import puppeteer from 'puppeteer-core'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const r = (...p) => path.join(root, ...p)
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export const C = { navy: '#0f2d6e', navyDeep: '#0a1f4d', gold: '#d9a441', ink: '#0B0F12', linen: '#fafbfc', white: '#ffffff' }
export const MINISTRY = 'The Copperbelt University SDA Public Campus Ministries'
export const MINISTRY_SHORT = 'CBU SDA PCM'

const bold = opentype.loadSync(r('brand-kit/fonts/Fraunces_700Bold.ttf'))
const italic = opentype.loadSync(r('brand-kit/fonts/Fraunces_400Regular_Italic.ttf'))

/** Lay out text with kerning and tracking (em fraction), return path data and advance width */
function shape(font, text, size, x, y, tracking = 0) {
  const glyphs = font.stringToGlyphs(text)
  const scale = size / font.unitsPerEm
  let cx = x
  const parts = []
  glyphs.forEach((g, i) => {
    parts.push(g.getPath(cx, y, size).toPathData(2))
    let adv = g.advanceWidth * scale
    if (i < glyphs.length - 1) adv += font.getKerningValue(g, glyphs[i + 1]) * scale
    cx += adv + tracking * size
  })
  return { d: parts.join(''), width: cx - x - tracking * size }
}


/** Measure ink bounds of an SVG fragment by rendering it (exact, font-independent) */
async function measure(page, inner) {
  return page.evaluate((inner) => {
    const ns = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('width', '2000')
    svg.setAttribute('height', '2000')
    svg.innerHTML = inner
    document.body.appendChild(svg)
    const b = svg.getBBox()
    svg.remove()
    return { x: b.x, y: b.y, w: b.width, h: b.height }
  }, inner)
}

// ───────────────────────── Logo geometry (units at Haven = 100) ─────────────────────────

function wordmarkInner(tone) {
  const ink = tone === 'white' ? C.white : C.navy
  const the = shape(italic, 'the', 58, 0, 100)
  const gap = 15
  const haven = shape(bold, 'Haven', 100, the.width + gap, 100, -0.015)
  const dot = shape(bold, '.', 100, the.width + gap + haven.width - 1, 100)
  return `<path fill="${C.gold}" d="${the.d}"/><path fill="${ink}" d="${haven.d}"/><path fill="${C.gold}" d="${dot.d}"/>`
}

function stackedInner(tone) {
  const ink = tone === 'white' ? C.white : C.navy
  const haven = shape(bold, 'Haven', 100, 0, 100, -0.015)
  const dot = shape(bold, '.', 100, haven.width - 1, 100)
  const the = shape(italic, 'the', 46, 4, 14)
  return `<path fill="${C.gold}" d="${the.d}"/><path fill="${ink}" d="${haven.d}"/><path fill="${C.gold}" d="${dot.d}"/>`
}

function monogramInner(tone) {
  const ink = tone === 'white' ? C.white : C.navy
  const h = shape(bold, 'H', 100, 0, 100)
  const dot = shape(bold, '.', 100, h.width + 2, 100)
  return `<path fill="${ink}" d="${h.d}"/><path fill="${C.gold}" d="${dot.d}"/>`
}

/** Wrap an inner fragment in a tight viewBox with padding */
const svgDoc = (inner, b, pad = 0, bg = null) => {
  const x = b.x - pad, y = b.y - pad, w = b.w + pad * 2, h = b.h + pad * 2
  const rect = bg ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}">${rect}${inner}</svg>\n`
}

/** Centre an inner fragment inside a square canvas at a given fill ratio */
const squareDoc = (inner, b, size, ratio, bg, radius = 0) => {
  const s = (size * ratio) / Math.max(b.w, b.h)
  const tx = size / 2 - (b.x + b.w / 2) * s
  const ty = size / 2 - (b.y + b.h / 2) * s
  const rect = bg ? `<rect width="${size}" height="${size}" rx="${radius}" fill="${bg}"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${rect}<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})">${inner}</g></svg>\n`
}

const write = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, data)
}

async function png(page, html, file, width, height, { transparent = false } = {}) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  await page.screenshot({ path: file, omitBackground: transparent, clip: { x: 0, y: 0, width, height } })
}

/** An SVG centred on a solid canvas, its width a fraction of the canvas */
const framed = (svg, w, h, bg, ratio) =>
  `<html><body style="margin:0;background:${bg};width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center">${svg.replace('<svg ', `<svg style="width:${Math.round(w * ratio)}px;max-height:${Math.round(h * 0.7)}px" `)}</body></html>`

const page100 = (svg, w, h, bg) =>
  `<html><body style="margin:0;background:${bg ?? 'transparent'};width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center">${svg.replace('<svg ', `<svg style="width:${w}px;height:${h}px" `)}</body></html>`

const dataUri = (file) => `data:${file.endsWith('.png') ? 'image/png' : 'image/jpeg'};base64,${fs.readFileSync(file).toString('base64')}`

// ───────────────────────── Posters ─────────────────────────

const FONT_CSS = `
@font-face{font-family:FB;src:url(${dataUri(r('brand-kit/fonts/Fraunces_700Bold.ttf')).replace('image/jpeg', 'font/ttf')})}
@font-face{font-family:FI;src:url(${dataUri(r('brand-kit/fonts/Fraunces_400Regular_Italic.ttf')).replace('image/jpeg', 'font/ttf')})}
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;color:#fff;overflow:hidden}
.eyebrow{font:800 22px/1 -apple-system,"Helvetica Neue",sans-serif;letter-spacing:.22em;text-transform:uppercase;color:${C.gold}}
.h{font-family:FB;letter-spacing:-.02em;line-height:.98}
.i{font-family:FI;color:${C.gold}}
`

function poster({ photo, eyebrow, title, accent, lines = [], verse, cta, wordmark, shield, tone = 'photo' }) {
  const bg =
    tone === 'navy'
      ? `background:${C.navy}`
      : `background:${C.navyDeep} url(${photo}) center/cover`
  const overlay =
    tone === 'navy'
      ? `<div style="position:absolute;inset:0;background:radial-gradient(900px 600px at 85% 0%,rgba(217,164,65,.22),transparent 60%),radial-gradient(700px 500px at 0% 100%,rgba(255,255,255,.08),transparent 60%)"></div>`
      : `<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,31,77,.55) 0%,rgba(10,31,77,.35) 30%,rgba(10,31,77,.82) 62%,rgba(10,31,77,.97) 100%)"></div>`
  return `<html><head><style>${FONT_CSS}</style></head><body style="position:relative;${bg}">
${overlay}
<div style="position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column">
  <div style="display:flex;align-items:center;justify-content:space-between">
    <div style="height:64px">${wordmark}</div>
    <img src="${shield}" style="height:84px"/>
  </div>
  <div style="flex:1"></div>
  <p class="eyebrow">${eyebrow}</p>
  <h1 class="h" style="font-size:${title.length > 16 ? 112 : 132}px;margin-top:26px">${title}${accent ? `<br/><span class="i" style="font-size:.86em">${accent}</span>` : ''}</h1>
  ${lines.length ? `<div style="margin-top:44px;display:flex;flex-direction:column;gap:14px">${lines
    .map(([k, v]) => `<div style="display:flex;gap:22px;font-size:32px;line-height:1.25"><span style="width:150px;flex:none;color:rgba(255,255,255,.6);font-weight:600">${k}</span><span style="font-weight:700">${v}</span></div>`)
    .join('')}</div>` : ''}
  ${verse ? `<p style="margin-top:44px;font-family:FI;font-size:34px;line-height:1.35;color:rgba(255,255,255,.88)">“${verse[0]}”<br/><span style="font-family:-apple-system,sans-serif;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:${C.gold};font-weight:800">${verse[1]}</span></p>` : ''}
  ${cta ? `<div style="margin-top:48px;align-self:flex-start;background:${C.gold};color:${C.ink};font-weight:800;font-size:30px;padding:22px 40px;border-radius:999px">${cta}</div>` : ''}
  <div style="margin-top:56px;padding-top:28px;border-top:2px solid rgba(255,255,255,.18);display:flex;justify-content:space-between;font-size:22px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7)">
    <span>${MINISTRY_SHORT}</span><span>Copperbelt University · Kitwe</span>
  </div>
</div></body></html>`
}

// ───────────────────────── Build ─────────────────────────

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  const page = await browser.newPage()
  await page.setContent('<html><body></body></html>')

  const variants = {
    wordmark: wordmarkInner,
    stacked: stackedInner,
    monogram: monogramInner,
  }
  const bounds = {}
  for (const [k, fn] of Object.entries(variants)) bounds[k] = await measure(page, fn('navy'))

  // Clean the old kit
  for (const dir of ['symbol', 'logo-icon', 'logo-text', 'monogram', 'app-icon', 'splash', 'posters', 'logo'])
    fs.rmSync(r('brand-kit', dir), { recursive: true, force: true })
  for (const f of ['brand-sheet.png', 'brand-sheet.svg']) fs.rmSync(r('brand-kit', f), { force: true })

  // Logo SVGs (transparent) + PNGs (on a solid background)
  const files = []
  for (const [k, fn] of Object.entries(variants)) {
    for (const tone of ['navy', 'white']) {
      const name = k === 'wordmark' ? `the-haven-${tone}` : k === 'stacked' ? `the-haven-stacked-${tone}` : `the-haven-monogram-${tone}`
      const b = bounds[k]
      const svg = svgDoc(fn(tone), b, 4)
      write(r('brand-kit/logo/svg', `${name}.svg`), svg)
      // PNG on a solid background with generous clear space
      const bg = tone === 'white' ? C.navy : C.white
      const w = 1600
      const h = Math.round(w * (k === 'monogram' ? 1 : Math.max(0.42, (b.h / b.w) * 1.6)))
      await png(page, framed(svg, w, h, bg, k === 'monogram' ? 0.45 : 0.62), r('brand-kit/logo/png', `${name}.png`), w, h)
      files.push(name)
    }
  }

  // Email logo (PNG — email apps don't show SVG): white wordmark on transparent, 2× for sharp screens
  const emailLogo = svgDoc(wordmarkInner('white'), bounds.wordmark, 2)
  const ew = 480, eh = Math.round(480 * ((bounds.wordmark.h + 4) / (bounds.wordmark.w + 4)))
  await png(page, page100(emailLogo, ew, eh), r('public/email/the-haven-white.png'), ew, eh, { transparent: true })

  // Website favicon and in-code mark
  write(r('app/icon.svg'), squareDoc(monogramInner('white'), bounds.monogram, 64, 0.62, C.navy, 14))

  // App icon (square, opaque), Android adaptive foreground (safe zone), favicon
  const icon = squareDoc(monogramInner('white'), bounds.monogram, 1024, 0.56, C.navy)
  const adaptive = squareDoc(monogramInner('white'), bounds.monogram, 1024, 0.4, null)
  write(r('brand-kit/app-icon/svg/icon.svg'), icon)
  write(r('brand-kit/app-icon/svg/adaptive-foreground.svg'), adaptive)
  await png(page, page100(icon, 1024, 1024), r('brand-kit/app-icon/png/icon-1024.png'), 1024, 1024)
  await png(page, page100(adaptive, 1024, 1024), r('brand-kit/app-icon/png/android-adaptive-foreground.png'), 1024, 1024, { transparent: true })
  fs.copyFileSync(r('brand-kit/app-icon/png/icon-1024.png'), r('mobile/assets/images/icon.png'))
  fs.copyFileSync(r('brand-kit/app-icon/png/android-adaptive-foreground.png'), r('mobile/assets/images/adaptive-icon.png'))
  await png(page, page100(squareDoc(monogramInner('white'), bounds.monogram, 48, 0.6, C.navy, 10), 48, 48), r('mobile/assets/images/favicon.png'), 48, 48, { transparent: true })

  // Splash (shown on navy at 240 px wide): stacked wordmark + ministry
  const shield = dataUri(r('public/pcm-shield.png'))
  const stackedWhite = svgDoc(stackedInner('white'), bounds.stacked, 2)
  const splash = `<html><head><style>${FONT_CSS}body{width:1200px;height:1500px}</style></head><body style="background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0">
    ${stackedWhite.replace('<svg ', '<svg style="width:900px" ')}
    <img src="${shield}" style="height:200px;margin-top:150px"/>
    <p style="margin-top:36px;font:800 52px/1 -apple-system,sans-serif;letter-spacing:.16em;color:#fff">${MINISTRY_SHORT}</p>
  </body></html>`
  await png(page, splash, r('brand-kit/splash/png/splash.png'), 1200, 1500, { transparent: true })
  fs.copyFileSync(r('brand-kit/splash/png/splash.png'), r('mobile/assets/images/splash.png'))

  // Posters
  const photo = (k) => dataUri(r('mobile/assets/images/photos', `${k}.jpg`))
  const wm = svgDoc(wordmarkInner('white'), bounds.wordmark, 2).replace('<svg ', '<svg style="height:64px;width:auto" ')
  const POSTERS = [
    { file: '01-welcome', photo: photo('kcm_0549'), eyebrow: 'A place to belong', title: 'Welcome to', accent: 'the Haven.', lines: [['Weekly', 'Worship · Bible study · Fellowship · Service'], ['Who', 'Every student is welcome']] },
    { file: '02-sabbath-worship', photo: photo('kcm_0822'), eyebrow: 'Every Saturday', title: 'Sabbath', accent: 'Worship', lines: [['When', 'Saturdays · 10:00'], ['Who', 'All students welcome']], verse: ['Remember the sabbath day, to keep it holy.', 'Exodus 20:8'] },
    { file: '03-bible-study', photo: photo('kcm_0729'), eyebrow: 'Midweek', title: 'Bible Study', lines: [['When', 'Wednesdays · 19:00'], ['Where', 'Ministry Center – Room A'], ['Led by', 'Bible Study Band']], verse: ['Thy word is a lamp unto my feet, and a light unto my path.', 'Psalm 119:105'] },
    { file: '04-need-prayer', tone: 'navy', eyebrow: 'We pray with you', title: 'Need', accent: 'prayer?', lines: [['How', 'Send a request in The Haven app or on the website'], ['Private', 'Named or anonymous — only the prayer team sees it']], verse: ['Cast all your anxiety on him because he cares for you.', '1 Peter 5:7'] },
    { file: '05-get-the-app', photo: photo('kcm_0799'), eyebrow: 'The Haven app', title: 'Your ministry,', accent: 'in your pocket.', lines: [['Inside', 'Events · Bands · Prayer · Counseling · Merch'], ['Sign in', 'With Google or email — one account for app and web']], cta: 'pcm-pi.vercel.app' },
  ]
  fs.rmSync(r('public/posters/haven'), { recursive: true, force: true })
  fs.rmSync(r('mobile/assets/images/posters'), { recursive: true, force: true })
  for (const p of POSTERS) {
    const html = poster({ ...p, wordmark: wm, shield })
    write(r('brand-kit/posters/html', `${p.file}.html`), html.replace(/data:[^)"']{200,}/g, '…'))
    await png(page, html, r('brand-kit/posters/png', `${p.file}.png`), 1080, 1350)
    for (const dest of ['public/posters/haven', 'mobile/assets/images/posters']) {
      fs.mkdirSync(r(dest), { recursive: true })
      fs.copyFileSync(r('brand-kit/posters/png', `${p.file}.png`), r(dest, `${p.file}.png`))
    }
  }
  fs.rmSync(r('brand-kit/posters/html'), { recursive: true, force: true })

  // Brand sheet
  const svgInline = (k, tone, h) => svgDoc(variants[k](tone), bounds[k], 2).replace('<svg ', `<svg style="height:${h}px;width:auto" `)
  const sheet = `<html><head><style>${FONT_CSS}body{width:1800px;height:1100px;background:${C.linen};color:${C.ink};padding:72px}
    .card{border-radius:28px;display:flex;align-items:center;justify-content:center}
    .lab{font:800 16px -apple-system,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#5b6472;margin-bottom:14px}</style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:44px">
      <div><p class="lab" style="color:${C.navy}">Brand sheet</p>${svgInline('wordmark', 'navy', 92)}</div>
      <p style="font-size:22px;color:#5b6472;text-align:right;line-height:1.5">${MINISTRY}<br/><b style="color:${C.navy}">${MINISTRY_SHORT}</b></p>
    </div>
    <div style="display:grid;grid-template-columns:1.3fr 1fr 0.7fr;gap:24px;height:420px">
      <div class="card" style="background:${C.navy}">${svgInline('wordmark', 'white', 110)}</div>
      <div class="card" style="background:#fff;border:2px solid #e4e7ec">${svgInline('stacked', 'navy', 150)}</div>
      <div class="card" style="background:#fff;border:2px solid #e4e7ec;flex-direction:column;gap:28px">
        <div style="width:150px;height:150px;border-radius:36px;background:${C.navy};display:flex;align-items:center;justify-content:center">${svgInline('monogram', 'white', 76)}</div>
        <div style="width:64px;height:64px;border-radius:16px;background:${C.navy};display:flex;align-items:center;justify-content:center">${svgInline('monogram', 'white', 32)}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:24px;margin-top:40px">
      ${[['Haven Navy', C.navy, '#fff'], ['Lamp Gold', C.gold, C.ink], ['Night', C.ink, '#fff'], ['Linen', C.linen, C.ink], ['White', '#ffffff', C.ink]]
        .map(([n, c, t]) => `<div style="height:150px;border-radius:22px;background:${c};color:${t};border:2px solid #e4e7ec;padding:22px;display:flex;flex-direction:column;justify-content:flex-end"><b style="font-size:22px">${n}</b><span style="font-size:18px;opacity:.75">${c}</span></div>`)
        .join('')}
    </div>
    <p style="margin-top:40px;font-size:22px;color:#5b6472"><span class="h" style="font-size:30px;color:${C.ink}">Fraunces Bold</span> for headlines · <span class="i" style="font-size:30px">Fraunces Italic</span> for the lead-in “the” · Inter / system sans for body text</p>
  </body></html>`
  await png(page, sheet, r('brand-kit/brand-sheet.png'), 1800, 1100)

  await browser.close()
  console.log('✓ Brand assets written:', files.join(', '), '+ app icon, splash, 5 posters, brand sheet')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
