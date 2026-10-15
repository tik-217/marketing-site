// Блок отзывов: показывается только при заполненном номере и включенном переключателе.
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

let server
let Reviews
let reviewsConfig
let isReviewsVisible

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  ;({ Reviews } = await server.ssrLoadModule('/src/widgets/reviews/ui/Reviews.jsx'))
  ;({ reviewsConfig, isReviewsVisible } = await server.ssrLoadModule('/src/shared/config/reviews.js'))
})

after(async () => {
  await server.close()
})

const render = (config) => renderToStaticMarkup(createElement(Reviews, { config }))

test('настройки сайта: ссылка строкой, переключатель логическим значением, показ следует из них', () => {
  assert.equal(typeof reviewsConfig.profileUrl, 'string')
  assert.equal(typeof reviewsConfig.enabled, 'boolean')
  assert.equal(render(reviewsConfig) !== '', isReviewsVisible(reviewsConfig))
})

const url = 'https://profi.ru/profile/Test/#reviews-tab'

test('ссылка есть, переключатель выключен: блока нет совсем', () => {
  assert.equal(isReviewsVisible({ profileUrl: url, enabled: false }), false)
  assert.equal(render({ profileUrl: url, enabled: false }), '')
})

test('переключатель включен, ссылки нет: блока нет совсем', () => {
  assert.equal(isReviewsVisible({ profileUrl: '', enabled: true }), false)
  assert.equal(isReviewsVisible({ profileUrl: '   ', enabled: true }), false)
  assert.equal(render({ profileUrl: '', enabled: true }), '')
})

test('ссылка и переключатель: заголовок, два скриншота и ссылка на Профи.ру в новой вкладке', () => {
  const html = render({ profileUrl: url, enabled: true })
  assert.match(html, /Эти отзывы клиенты оставили на Профи\.ру/)
  assert.equal(html.includes('Яндекс Карт'), false)
  assert.equal(html.includes('<iframe'), false)
  assert.equal((html.match(/<img/g) || []).length, 2)
  assert.match(html, /Все отзывы на Профи\.ру/)
  assert.match(html, /href="https:\/\/profi\.ru\/profile\/Test\/#reviews-tab"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/)
})
