// Тесты интерфейса без браузера: Vite собирает компоненты на сервере, React рендерит их в HTML.
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { createMockAuditClient } from '../api/mockAuditClient.js'
import { PARTIAL_NOTICE, PDF_ERROR, PDF_LOADING } from '../lib/messages.js'

let server
let AuditResult
let AuditErrorPanel
let SavedNotice
let ResultActions

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  ;({ AuditResult } = await server.ssrLoadModule('/src/features/audit/ui/AuditResult.jsx'))
  ;({ AuditErrorPanel } = await server.ssrLoadModule('/src/features/audit/ui/AuditErrorPanel.jsx'))
  ;({ SavedNotice } = await server.ssrLoadModule('/src/features/audit/ui/SavedNotice.jsx'))
  ;({ ResultActions } = await server.ssrLoadModule('/src/features/audit/ui/ResultActions.jsx'))
})

after(async () => {
  await server.close()
})

const client = createMockAuditClient({ delayMs: 0 })
const audit = (host) => client.runAudit({ url: `https://${host}/` })
const noop = () => {}

function render(response, extra = {}) {
  return renderToStaticMarkup(
    createElement(AuditResult, { response, hostname: 'example.ru', code: 'A7K3', track: noop, ...extra }),
  )
}

const pdfRow = (pdf) =>
  renderToStaticMarkup(createElement(ResultActions, { pdf, copy: undefined }, createElement('span', null, 'Проверить другую страницу')))

test('PDF в ряду кнопок наверху, Telegram остается главным действием результата', async () => {
  const response = await audit('example.ru')
  const top = pdfRow({ status: 'idle', onClick: noop })
  const result = render(response)
  assert.match(top, /Скачать отчет в PDF/)
  assert.match(top, /Проверить другую страницу/)
  assert.ok(top.indexOf('Скачать отчет в PDF') < top.indexOf('Проверить другую страницу'))
  assert.match(top.match(/<button[^>]*>Скачать отчет в PDF<\/button>/)[0], /ad-btn--outline/)
  // внизу результата PDF больше нет
  assert.equal(result.includes('PDF'), false)
  assert.match(result, /https:\/\/t\.me\/tigran_front\?text=/)
  const telegramButton = result.match(/<a[^>]*ad-final__btn[^>]*>/)[0]
  assert.doesNotMatch(telegramButton, /ad-btn--outline/)
})

test('ряд действий: PDF, копирование ссылки и «другая страница» в одном контейнере', () => {
  const html = renderToStaticMarkup(
    createElement(
      ResultActions,
      { pdf: { status: 'idle', onClick: noop }, copy: { label: 'Скопировать ссылку', copied: false, onCopy: noop } },
      createElement('span', null, 'Проверить другую страницу'),
    ),
  )
  assert.equal((html.match(/ad-result__actions/g) ?? []).length, 1)
  const order = ['Скачать отчет в PDF', 'Скопировать ссылку', 'Проверить другую страницу'].map((text) => html.indexOf(text))
  assert.ok(order.every((index) => index >= 0))
  assert.deepEqual([...order].sort((x, y) => x - y), order)
  assert.match(html.match(/<button[^>]*>Скопировать ссылку<\/button>/)[0], /ad-btn--outline/)
})

test('auditId не показывается пользователю и не попадает в ссылку Telegram', async () => {
  const response = await audit('example.ru')
  const html = render(response) + pdfRow({ status: 'idle', onClick: noop })
  assert.equal(html.includes(response.auditId), false)
  assert.equal(decodeURIComponent(html).includes(response.auditId), false)
})

test('без auditId кнопки PDF нет, разбор и Telegram на месте', async () => {
  const response = await audit('noid.example.ru')
  const html = render(response) + pdfRow(undefined)
  assert.equal(html.includes('PDF'), false)
  assert.match(html, /Краткий итог/)
  assert.match(html, /Написать в Telegram/)
})

test('partial с auditId: заметка и полный разбор, PDF доступен', async () => {
  const response = await audit('partial.example.ru')
  const html = render(response)
  assert.ok(html.includes(PARTIAL_NOTICE))
  assert.match(html, /Краткий итог/)
  assert.match(pdfRow({ status: 'idle', onClick: noop }), /Скачать отчет в PDF/)
})

test('PDF loading: кнопка отключена и показывает «Готовлю PDF...»', () => {
  const html = pdfRow({ status: 'loading', onClick: noop })
  assert.ok(html.includes(PDF_LOADING))
  assert.match(html, /<button[^>]*disabled[^>]*>Готовлю PDF\.\.\.<\/button>/)
})

test('ошибка PDF показывает сообщение, а разбор остается на странице', async () => {
  const response = await audit('pdferr.example.ru')
  const result = render(response)
  assert.ok(pdfRow({ status: 'error', onClick: noop }).includes(PDF_ERROR))
  assert.match(result, /Краткий итог/)
  assert.match(result, /Основные проблемы/)
  assert.match(result, /Написать в Telegram/)
})

test('структура результата: пустые блоки не показываются', async () => {
  const empty = render(await audit('empty.example.ru'))
  assert.equal(empty.includes('Основные проблемы'), false)
  assert.equal(empty.includes('Мобильная версия'), false)
  assert.equal(/\b(high|medium|low|critical)\b/i.test(empty), false)
})

function renderError(code) {
  return renderToStaticMarkup(
    createElement(AuditErrorPanel, {
      code,
      hostname: 'example.ru',
      displayUrl: 'https://example.ru',
      track: noop,
      onRetry: noop,
      onNewSite: noop,
    }),
  )
}

test('ошибки: тексты, повтор и Telegram', () => {
  const limit = renderError('RATE_LIMITED')
  assert.match(limit, /На сегодня лимит бесплатных аудитов исчерпан\./)
  assert.equal(limit.includes('Попробовать еще раз'), false)
  assert.match(limit, /t\.me\/tigran_front/)

  const reached = renderError('AUDIT_LIMIT_REACHED')
  assert.match(reached, /На сегодня лимит бесплатных аудитов исчерпан\./)
  assert.equal(reached.includes('Попробовать еще раз'), false)

  const busy = renderError('AUDIT_BUSY')
  assert.match(busy, /Сейчас много запросов\. Попробуйте чуть позже\./)
  assert.match(busy, /Попробовать еще раз/)

  const temp = renderError('AUDIT_TEMPORARILY_UNAVAILABLE')
  assert.match(temp, /Попробовать еще раз/)

  const network = renderError('NETWORK_ERROR')
  assert.match(network, /Не удалось связаться с сервисом\. Проверьте интернет и попробуйте еще раз\./)
  assert.match(network, /Попробовать еще раз/)

  const down = renderError('AUDIT_NOT_AVAILABLE')
  assert.match(down, /Сервис временно недоступен\./)
  for (const html of [limit, reached, busy, temp, network, down]) {
    assert.doesNotMatch(html, /429|503|Yandex|Alice|Flash|provider|токен/i)
  }
})

test('плашка сохраненного разбора: текст и дата', () => {
  const html = renderToStaticMarkup(createElement(SavedNotice, { savedAt: new Date(2026, 9, 1, 10, 42).getTime() }))
  assert.match(html, /Эту страницу уже проверяли сегодня/)
  assert.match(html, /Показываю сохраненный разбор от 1 октября, 10:42\./)
  assert.match(html, /Новая проверка этой страницы будет доступна завтра\./)
  assert.match(html, /role="status"/)
})
