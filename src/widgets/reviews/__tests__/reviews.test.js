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

test('ссылка и переключатель: заголовок, две карточки отзывов (Андрей первым) и ссылка на Профи.ру в новой вкладке', () => {
  const html = render({ profileUrl: url, enabled: true })
  assert.match(html, /Эти отзывы клиенты оставили на Профи\.ру/)
  assert.equal(html.includes('Яндекс Карт'), false)
  assert.equal(html.includes('<iframe'), false)
  assert.equal(html.includes('<img'), false)
  assert.equal((html.match(/class="review-card"/g) || []).length, 2)
  assert.ok(html.indexOf('Андрей Барс Консалт') < html.indexOf('Артем'))
  assert.equal((html.match(/Настройка Яндекс\.Директ/g) || []).length, 2)
  assert.equal(html.includes('Стоимость работ'), false)
  assert.equal(html.includes('30000'), false)
  assert.equal(html.includes('review-slider') || html.includes('reviews-slider'), false)
  assert.equal(html.includes('<button'), false)
  assert.match(html, /Все отзывы на Профи\.ру/)
  assert.match(html, /href="https:\/\/profi\.ru\/profile\/Test\/#reviews-tab"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/)
})
