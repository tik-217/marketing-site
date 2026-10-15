// Пререндер страниц в статичный HTML после сборки (npm run build).
// Берет собранный dist/index.html как шаблон, рендерит страницы серверной сборкой из dist-ssr
// и кладет готовый HTML в dist. Без пререндера страницы собирались бы только JavaScript в браузере.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')

// Маршрут и файл. Главная становится dist/index.html, остальные лежат в dist/_pages,
// а на нужные адреса их направляет public/.htaccess.
const pages = [
  { url: '/', file: 'index.html' },
  { url: '/audit', file: '_pages/audit.html' },
  { url: '/cases', file: '_pages/cases.html' },
  { url: '/cases/legalizaciya-kommercheskih-obektov', file: '_pages/cases-legalizaciya-kommercheskih-obektov.html' },
  { url: '/cases/bankrotstvo-fizicheskih-lic', file: '_pages/cases-bankrotstvo-fizicheskih-lic.html' },
]

// React 19 кладет теги из Helmet (title, meta, link, JSON-LD) прямо в строку разметки.
// Переносим их в <head> и помечаем data-prerender: браузер уберет их при запуске приложения,
// чтобы заголовок и мета-теги не дублировались теми, что выставит React.
const HEAD_TAGS = [
  /<title\b[^>]*>[\s\S]*?<\/title>/g,
  /<meta\b[^>]*>/g,
  /<link\b[^>]*>/g,
  /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g,
]

function splitHead(markup) {
  const tags = []
  let body = markup
  for (const pattern of HEAD_TAGS) {
    body = body.replace(pattern, (tag) => {
      tags.push(tag.replace(/^<(\w+)/, '<$1 data-prerender'))
      return ''
    })
  }
  // React сам добавляет preload для картинки с fetchPriority, а Helmet добавляет свой, с типом.
  // Оставляем один preload на адрес, тот, где указан тип (image/avif).
  const preloads = new Map()
  const unique = []
  for (const tag of tags) {
    const href = /^<link[^>]*\brel="preload"[^>]*\bhref="([^"]+)"/.exec(tag)?.[1]
    if (!href) {
      unique.push(tag)
    } else if (!preloads.has(href) || (tag.includes(' type="') && !preloads.get(href).includes(' type="'))) {
      preloads.set(href, tag)
    }
  }
  return { body, head: [...unique, ...preloads.values()].map((tag) => `    ${tag}`).join('\n') }
}

const template = readFileSync(resolve(dist, 'index.html'), 'utf8')

// Чистый шаблон без содержимого нужен остальным адресам (отчеты, 404, политика):
// их собирает JavaScript в браузере, как и раньше.
copyFileSync(resolve(dist, 'index.html'), resolve(dist, 'app-shell.html'))

const { render, professionalService } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)

const failed = []
for (const page of pages) {
  try {
    const split = splitHead(render(page.url))
    const { body } = split
    // JSON-LD только у главной и без data-prerender: браузер его не трогает.
    const head = page.url === '/'
      ? `${split.head}\n    <script type="application/ld+json">${JSON.stringify(professionalService)}</script>`
      : split.head
    if (!/<h1[\s>]/.test(body)) throw new Error('в результате нет заголовка h1')

    const output = template
      .replace('<div id="root"></div>', () => `<div id="root" data-prerendered>${body}</div>`)
      .replace('</head>', () => `${head}\n  </head>`)

    const target = resolve(dist, page.file)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, output)
    console.log(`prerender ${page.url} -> dist/${page.file}`)
  } catch (error) {
    failed.push(page.url)
    console.error(`prerender ${page.url} не удался: ${error.message}`)
  }
}

if (failed.length > 0) {
  console.error(`Не удалось отрендерить: ${failed.join(', ')}`)
  process.exit(1)
}

// sitemap.xml: lastmod у всех адресов ставится датой сборки (по Москве), чтобы не править вручную.
try {
  const sitemapPath = resolve(dist, 'sitemap.xml')
  const date = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Moscow' }) // ГГГГ-ММ-ДД по Москве
  const sitemap = readFileSync(sitemapPath, 'utf8')
    .replace(/\s*<lastmod>[^<]*<\/lastmod>/g, '')
    .replace(/(<loc>[^<]*<\/loc>)/g, `$1\n    <lastmod>${date}</lastmod>`)
  writeFileSync(sitemapPath, sitemap)
  console.log(`sitemap lastmod ${date}`)
} catch (error) {
  console.error(`sitemap: не удалось обновить lastmod: ${error.message}`)
}
