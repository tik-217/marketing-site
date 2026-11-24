// Кнопки "Получить разбор": прямой чат в Telegram, data-cta с названием блока, на сайте нет ссылок на бота.
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { after, before, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

let server
let CtaButton
let ctaName

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  ;({ CtaButton } = await server.ssrLoadModule('/src/features/contact-cta/ui/CtaButton.jsx'))
  ;({ ctaName } = await server.ssrLoadModule('/src/shared/lib/ctaSource.js'))
})

after(async () => {
  await server.close()
})

const CHAT = '/#razbor'

test('кнопка: ссылка на форму, подпись и data-cta', () => {
  const html = renderToStaticMarkup(createElement(CtaButton, { source: 's-hero' }))
  assert.ok(html.includes(`href="${CHAT}"`))
  assert.ok(html.includes('data-cta="hero"'))
  assert.equal(html.includes('target="_blank"'), false)
  assert.ok(html.includes('Получить план рекламы для вашей фирмы'))
  assert.equal(html.includes('start='), false)
})

test('названия блоков для data-cta', () => {
  for (const [source, name] of [
    ['s-hero', 'hero'],
    ['s-case-steps', 'case-steps'],
    ['s-situations', 'situations'],
    ['s-terms', 'terms'],
    ['s-faq', 'faq'],
    ['s-footer', 'footer'],
    ['s-sticky', 'sticky'],
    ['s-audit-limits', 'audit-limits'],
  ]) {
    assert.equal(ctaName(source), name)
  }

})

test('в коде сайта нет ссылок на бота tigran_audit_bot', () => {
  const root = fileURLToPath(new URL('../../../', import.meta.url))
  const found = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) {
        if (name !== '__tests__') walk(path)
      } else if (/\.(jsx?|css|html)$/.test(name) && readFileSync(path, 'utf8').includes('tigran_audit_bot')) {
        found.push(path)
      }
    }
  }
  walk(root)
  assert.deepEqual(found, [])
})
