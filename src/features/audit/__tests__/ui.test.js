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

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  ;({ AuditResult } = await server.ssrLoadModule('/src/features/audit/ui/AuditResult.jsx'))
  ;({ AuditErrorPanel } = await server.ssrLoadModule('/src/features/audit/ui/AuditErrorPanel.jsx'))
  ;({ SavedNotice } = await server.ssrLoadModule('/src/features/audit/ui/SavedNotice.jsx'))
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

test('completed с auditId: Telegram главный, PDF вторичный и идет после него', async () => {
  const response = await audit('example.ru')
  const html = render(response, { pdf: { status: 'idle', onClick: noop } })
  assert.match(html, /Скачать отчет в PDF/)
  assert.match(html, /https:\/\/t\.me\/tigran_front\?text=/)
  assert.ok(html.indexOf('Написать в Telegram') < html.indexOf('Скачать отчет в PDF'))
  const pdfButton = html.match(/<button[^>]*>Скачать отчет в PDF<\/button>/)[0]
  assert.match(pdfButton, /ad-btn--outline/)
  const telegramButton = html.match(/<a[^>]*ad-final__btn[^>]*>/)[0]
  assert.doesNotMatch(telegramButton, /ad-btn--outline/)
})

test('auditId не показывается пользователю и не попадает в ссылку Telegram', async () => {
  const response = await audit('example.ru')
  const html = render(response, { pdf: { status: 'idle', onClick: noop } })
  assert.equal(html.includes(response.auditId), false)
  assert.equal(decodeURIComponent(html).includes(response.auditId), false)
})

test('без auditId кнопки PDF нет, разбор и Telegram на месте', async () => {
  const response = await audit('noid.example.ru')
  const html = render(response, { pdf: undefined })
  assert.equal(html.includes('PDF'), false)
  assert.match(html, /Краткий итог/)
  assert.match(html, /Написать в Telegram/)
})

test('partial с auditId: заметка и полный разбор, PDF доступен', async () => {
  const response = await audit('partial.example.ru')
  const html = render(response, { pdf: { status: 'idle', onClick: noop } })
  assert.ok(html.includes(PARTIAL_NOTICE))
  assert.match(html, /Скачать отчет в PDF/)
  assert.match(html, /Краткий итог/)
})

test('PDF loading: кнопка отключена и показывает «Готовлю PDF...»', async () => {
  const html = render(await audit('example.ru'), { pdf: { status: 'loading', onClick: noop } })
  assert.ok(html.includes(PDF_LOADING))
  assert.match(html, /<button[^>]*disabled[^>]*>Готовлю PDF\.\.\.<\/button>/)
})

test('ошибка PDF показывает сообщение, а разбор остается на странице', async () => {
  const response = await audit('pdferr.example.ru')
  const html = render(response, { pdf: { status: 'error', onClick: noop } })
  assert.ok(html.includes(PDF_ERROR))
  assert.match(html, /Краткий итог/)
  assert.match(html, /Основные проблемы/)
  assert.match(html, /Написать в Telegram/)
})

test('структура результата: пустые блоки не показываются', async () => {
  const empty = render(await audit('empty.example.ru'), { pdf: undefined })
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
