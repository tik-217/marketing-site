// Секция отзывов: заглушка под виджет Яндекс Карт.
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

let server
let Reviews

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  ;({ Reviews } = await server.ssrLoadModule('/src/widgets/reviews/ui/Reviews.jsx'))
})

after(async () => {
  await server.close()
})

test('секция отзывов: заголовок, комментарий-заглушка под iframe и ссылка на Яндекс Карты', () => {
  const html = renderToStaticMarkup(createElement(Reviews))
  assert.match(html, /<h2[^>]*>Что говорят клиенты<\/h2>/)
  assert.match(html, /<!-- сюда вставить iframe отзывов Яндекс Карт -->/)
  assert.equal(html.includes('<iframe'), false)
  assert.match(html, /<a[^>]*href="#"[^>]*>Все отзывы на Яндекс Картах<\/a>/)
})
