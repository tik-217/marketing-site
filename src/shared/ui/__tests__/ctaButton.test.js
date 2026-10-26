// Кнопки "Получить разбор конкурентов": прямой чат в Telegram, data-cta с названием блока, на сайте нет ссылок на бота.
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
let packageSource
let moduleSource

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  ;({ CtaButton } = await server.ssrLoadModule('/src/shared/ui/CtaButton.jsx'))
  ;({ ctaName, packageSource, moduleSource } = await server.ssrLoadModule('/src/shared/lib/telegramSource.js'))
})

after(async () => {
  await server.close()
})

const CHAT = 'https://t.me/tigran_front?text=Здравствуйте%2C%20хочу%20разбор%20конкурентов'

test('кнопка: прямая ссылка на чат, подпись, новая вкладка и data-cta', () => {
  const html = renderToStaticMarkup(createElement(CtaButton, { source: 's-hero' }))
  assert.ok(html.includes(`href="${CHAT}"`))
  assert.ok(html.includes('data-cta="hero"'))
  assert.ok(html.includes('target="_blank"'))
  assert.match(html, /rel="noopener noreferrer"/)
  assert.ok(html.includes('Получить разбор конкурентов'))
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
  assert.equal(ctaName(packageSource('direct')), 'pricing-direct')
  assert.equal(ctaName(packageSource('traffic')), 'pricing-traffic')
  assert.equal(ctaName(packageSource('system')), 'pricing-system')
  assert.equal(ctaName(packageSource('launch')), 'pricing-zero')
  assert.equal(ctaName(moduleSource('ads')), 'pricing-module-direct')
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
