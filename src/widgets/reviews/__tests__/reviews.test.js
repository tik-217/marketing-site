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

test('в репозитории блок выключен и номер пустой', () => {
  assert.equal(reviewsConfig.enabled, false)
  assert.equal(reviewsConfig.orgId, '')
  assert.equal(render(reviewsConfig), '')
})

test('номер есть, переключатель выключен: блока нет совсем', () => {
  assert.equal(isReviewsVisible({ orgId: '123', enabled: false }), false)
  assert.equal(render({ orgId: '123', enabled: false }), '')
})

test('переключатель включен, номера нет: блока нет совсем', () => {
  assert.equal(isReviewsVisible({ orgId: '', enabled: true }), false)
  assert.equal(isReviewsVisible({ orgId: '   ', enabled: true }), false)
  assert.equal(render({ orgId: '', enabled: true }), '')
})

test('номер и переключатель: заголовок, ленивый iframe и ссылка в новую вкладку', () => {
  const html = render({ orgId: '123', enabled: true })
  assert.match(html, /Эти отзывы клиенты оставили на Яндекс Картах\. Изменить их я не могу/)
  assert.match(html, /<iframe[^>]*src="https:\/\/yandex\.ru\/maps-reviews-widget\/123\?comments"/)
  assert.match(html, /loading="lazy"/)
  assert.match(html, /href="https:\/\/yandex\.ru\/maps\/org\/123\/reviews\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/)
  assert.match(html, /Все отзывы на Яндекс Картах/)
})
