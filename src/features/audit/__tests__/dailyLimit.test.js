// Дневной лимит запусков на фронтенде: 2 POST /api/audit в сутки с одного браузера (localStorage).
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { createMockAuditClient, MOCK_REPORT_ID } from '../api/mockAuditClient.js'
import { auditsWord, createDailyLimit, DAILY_LIMIT, limitWord, localDateKey, USAGE_KEY } from '../lib/dailyLimit.js'
import { createAuditController } from '../model/controller.js'
import { createPdfController } from '../model/pdfController.js'
import { createReportController } from '../model/reportController.js'

const memoryStorage = () => {
  const store = new Map()
  return { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), raw: store }
}

/** Часы, которые можно переводить. Время локальное, как у пользователя. */
function clock(year = 2026, month = 9, day = 2, hour = 12, minute = 0) {
  let current = new Date(year, month, day, hour, minute)
  return { now: () => current, set: (date) => { current = date } }
}

function setup({ storage = memoryStorage(), time = clock() } = {}) {
  const calls = { runAudit: 0, getReport: 0, pdf: 0 }
  const events = []
  const mock = createMockAuditClient({ delayMs: 0 })
  const client = {
    ...mock,
    runAudit: (input) => (calls.runAudit++, mock.runAudit(input)),
    getReport: (id) => (calls.getReport++, mock.getReport(id)),
    getReportPdfLink: (id) => (calls.pdf++, mock.getReportPdfLink(id)),
  }
  const limit = createDailyLimit({ storage, now: time.now })
  const controller = createAuditController({
    client,
    limit,
    track: (name, params) => events.push([name, params]),
    attribution: {},
  })
  return { storage, time, calls, events, limit, controller, client }
}

const HOSTS = ['a.example.ru', 'b.example.ru', 'c.example.ru', 'd.example.ru']
const exhaust = async (t) => {
  for (const host of HOSTS.slice(0, DAILY_LIMIT)) await run(t, host)
}

const run = async (t, host = 'example.ru') => {
  await t.controller.submit(host)
  t.controller.newSite()
}

test('первый запуск → осталось 1, второй → 0', async () => {
  const t = setup()
  assert.deepEqual(t.limit.getState(), { enabled: true, limit: 2, used: 0, remaining: 2, exhausted: false })

  await t.controller.submit('example.ru')
  assert.equal(t.controller.getState().phase, 'result')
  assert.equal(t.controller.getState().usage.remaining, 1)
  assert.equal(t.limit.getState().used, 1)
  t.controller.newSite()
  assert.equal(t.controller.getState().usage.remaining, 1)
  assert.equal(t.controller.getState().usage.exhausted, false)

  await t.controller.submit('example.ru/b')
  assert.equal(t.controller.getState().usage.remaining, 0)
  assert.equal(t.controller.getState().usage.exhausted, true)
  assert.equal(t.calls.runAudit, 2)
  assert.equal(DAILY_LIMIT, 2)
})

test('третий запуск: POST /api/audit не выполняется, форма остается с пояснением', async () => {
  const t = setup()
  await exhaust(t)
  assert.equal(t.calls.runAudit, 2)

  await t.controller.submit('d.example.ru')
  assert.equal(t.calls.runAudit, 2)
  const state = t.controller.getState()
  assert.equal(state.phase, 'idle')
  assert.equal(state.input, 'd.example.ru')
  assert.equal(state.usage.exhausted, true)
  assert.ok(t.events.some(([name]) => name === 'audit_local_limit_blocked'))
  assert.equal(t.limit.getState().used, 2)
})

test('повторная отправка после лимита не увеличивает счетчик и не бросает', async () => {
  const t = setup()
  await exhaust(t)
  for (let i = 0; i < 5; i += 1) await t.controller.submit('x.example.ru')
  assert.equal(t.calls.runAudit, 2)
  assert.equal(JSON.parse(t.storage.getItem(USAGE_KEY)).count, 2)
})

test('на следующий календарный день лимит снова 2', async () => {
  const t = setup({ time: clock(2026, 9, 2, 23, 58) })
  await exhaust(t)
  assert.equal(t.limit.getState().exhausted, true)

  t.time.set(new Date(2026, 9, 2, 23, 59))
  assert.equal(t.limit.getState().exhausted, true)

  t.time.set(new Date(2026, 9, 3, 0, 1))
  assert.deepEqual(t.limit.getState(), { enabled: true, limit: 2, used: 0, remaining: 2, exhausted: false })
  t.controller.refreshUsage()
  assert.equal(t.controller.getState().usage.remaining, 2)

  await t.controller.submit('d.example.ru')
  assert.equal(t.calls.runAudit, 3)
  assert.equal(t.controller.getState().usage.remaining, 1)
  assert.deepEqual(JSON.parse(t.storage.getItem(USAGE_KEY)), { date: '2026-10-03', count: 1 })
})

test('ключ versioned, хранится только локальная дата и счетчик', async () => {
  const t = setup()
  await t.controller.submit('example.ru')
  assert.equal(USAGE_KEY, 'site_audit_daily_usage_v1')
  assert.deepEqual([...t.storage.raw.keys()], [USAGE_KEY])
  assert.deepEqual(JSON.parse(t.storage.getItem(USAGE_KEY)), { date: '2026-10-02', count: 1 })
  assert.equal(localDateKey(new Date(2026, 0, 5, 9, 3)), '2026-01-05')
})

test('страница отчета, обновление отчета и PDF не расходуют лимит', async () => {
  const t = setup()
  await t.controller.submit('example.ru')
  const before = t.storage.getItem(USAGE_KEY)

  // открытие /audit/report/:id и повторное открытие (refresh): только GET
  const reportEvents = []
  for (let i = 0; i < 3; i += 1) {
    const report = createReportController({ client: t.client, track: (name) => reportEvents.push(name) })
    await report.load(MOCK_REPORT_ID)
    assert.equal(report.getState().phase, 'result')
  }
  // PDF отчета
  const pdf = createPdfController({ client: { getPdfLink: (id) => t.client.getReportPdfLink(id) }, track: () => {}, openUrl: () => {} })
  await pdf.download({ auditId: MOCK_REPORT_ID, hostname: 'example.ru' })

  assert.equal(t.calls.getReport, 3)
  assert.equal(t.calls.pdf, 1)
  assert.equal(t.calls.runAudit, 1)
  assert.equal(t.storage.getItem(USAGE_KEY), before)
  assert.equal(t.limit.getState().used, 1)
})

test('отчет открывается и после исчерпания лимита: чтение лимит не проверяет', async () => {
  const t = setup()
  await exhaust(t)
  const report = createReportController({ client: t.client, track: () => {} })
  await report.load(MOCK_REPORT_ID)
  assert.equal(report.getState().phase, 'result')
  assert.equal(t.limit.getState().used, 2)
})

test('невалидная ссылка и ошибки валидации не расходуют лимит', async () => {
  const t = setup()
  await t.controller.submit('not a url')
  await t.controller.submit('')
  assert.equal(t.calls.runAudit, 0)
  assert.equal(t.limit.getState().used, 0)
})

test('retry тоже новый запуск и после лимита не выполняется', async () => {
  const t = setup()
  await run(t, 'a.example.ru')
  await t.controller.submit('error.example.ru') // второй запуск, ошибка
  assert.equal(t.controller.getState().phase, 'error')
  assert.equal(t.limit.getState().exhausted, true)

  await t.controller.retry()
  assert.equal(t.calls.runAudit, 2)
  assert.equal(t.controller.getState().phase, 'idle')
  assert.equal(t.controller.getState().usage.exhausted, true)
})

test('без localStorage ограничения нет, форма и аудит работают как обычно', async () => {
  for (const storage of [null, { getItem() { throw new Error('SecurityError') }, setItem() { throw new Error('SecurityError') } }]) {
    const t = setup({ storage })
    assert.equal(t.limit.getState().enabled, false)
    assert.equal(t.limit.getState().exhausted, false)
    for (let i = 0; i < 5; i += 1) await run(t, `s${i}.example.ru`)
    assert.equal(t.calls.runAudit, 5)
    assert.equal(t.controller.getState().usage.exhausted, false)
  }
})

test('переполненное хранилище: запись не удалась, запуск не блокируется', async () => {
  const storage = { getItem: () => null, setItem() { throw new Error('QuotaExceededError') } }
  const t = setup({ storage })
  for (let i = 0; i < 4; i += 1) await run(t, `q${i}.example.ru`)
  assert.equal(t.calls.runAudit, 4)
})

test('поврежденное значение в localStorage считается нулем', async () => {
  const storage = memoryStorage()
  storage.setItem(USAGE_KEY, '{oops')
  const t = setup({ storage })
  assert.equal(t.limit.getState().used, 0)
  storage.setItem(USAGE_KEY, JSON.stringify({ date: '2026-10-02', count: -5 }))
  assert.equal(t.limit.getState().used, 0)
  await t.controller.submit('example.ru')
  assert.equal(t.limit.getState().used, 1)
})

// ---- интерфейс формы (без браузера)

let server
let AuditForm

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  ;({ AuditForm } = await server.ssrLoadModule('/src/features/audit/ui/AuditForm.jsx'))
})

after(async () => {
  await server.close()
})

const formHtml = (state) =>
  renderToStaticMarkup(
    createElement(AuditForm, { state: { phase: 'idle', input: '', fieldError: '', ...state }, onChange() {}, onSubmit() {}, inputRef: null }),
  )

const usage = (used, enabled = true) => ({
  enabled,
  limit: DAILY_LIMIT,
  used,
  remaining: Math.max(0, DAILY_LIMIT - used),
  exhausted: enabled && used >= DAILY_LIMIT,
})

test('форма до первого запуска: без строк про лимит, без счетчика и без предупреждений', () => {
  const html = formHtml({ usage: usage(0) })
  assert.equal(html.includes('До 2 аудитов'), false)
  assert.equal(html.includes('Разбор смотрит одну страницу'), false)
  assert.equal(html.includes('Осталось сегодня'), false)
  assert.equal(html.includes('role="alert"'), false)
  assert.equal(html.includes('Лимит на сегодня закончился'), false)
  assert.doesNotMatch(html.match(/<button[^>]*type="submit"[^>]*>/)[0], /disabled/)
})

test('форма после первого запуска: «Осталось сегодня: 1 из 2»', () => {
  assert.match(formHtml({ usage: usage(1) }), /Осталось сегодня: 1 из 2/)
})

test('форма после двух запусков: сообщение о лимите и отключенный submit', () => {
  const html = formHtml({ usage: usage(2) })
  assert.match(html, /Лимит на сегодня закончился/)
  assert.match(html, /Вы уже использовали 2 аудита\. Каждый разбор я оплачиваю из своих денег, поэтому пока ограничил использование двумя запусками в день с одного браузера\. Новый лимит будет доступен завтра\./)
  assert.match(html.match(/<button[^>]*type="submit"[^>]*>/)[0], /disabled/)
  assert.equal(html.includes('Осталось сегодня'), false)
  assert.equal(html.includes('role="alert"'), false)
})

test('форма без localStorage: submit включен, счетчика нет, форма не сломана', () => {
  const html = formHtml({ usage: usage(0, false) })
  assert.doesNotMatch(html.match(/<button[^>]*type="submit"[^>]*>/)[0], /disabled/)
  assert.equal(html.includes('Осталось сегодня'), false)
  assert.match(html, /Проверить страницу/)
  const noState = formHtml({ usage: undefined })
  assert.match(noState, /Проверить страницу/)
})

test('склонения в сообщениях лимита', () => {
  assert.equal(limitWord(2), 'двумя')
  assert.equal(limitWord(3), 'тремя')
  assert.deepEqual([1, 2, 3, 4, 5, 11, 12, 21, 22].map(auditsWord), ['аудит', 'аудита', 'аудита', 'аудита', 'аудитов', 'аудитов', 'аудитов', 'аудит', 'аудита'])
})
