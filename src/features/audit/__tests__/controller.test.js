import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createMockAuditClient } from '../api/mockAuditClient.js'
import { createAuditController } from '../model/controller.js'
import { createPdfController } from '../model/pdfController.js'
import { AuditError } from '../model/types.js'

const attribution = {
  utmSource: 'threads',
  utmMedium: 'social',
  utmCampaign: 'audit',
  referrer: 'https://t.co/path',
  referrerHost: 't.co',
  fromPage: '/cases',
}

function setup(overrides = {}) {
  const events = []
  const results = []
  const controller = createAuditController({
    client: createMockAuditClient({ delayMs: 0 }),
    track: (name, params) => events.push([name, params]),
    attribution,
    makeCode: () => 'A7K3',
    onResult: (entry) => results.push(entry),
    ...overrides,
  })
  return { controller, events, results, names: () => events.map(([name]) => name) }
}

test('пустая отправка и невалидный URL: запросов нет', () => {
  let calls = 0
  const client = { runAudit: async () => { calls += 1 } }
  const { controller, names } = setup({ client })
  controller.submit('   ')
  assert.equal(controller.getState().fieldError, 'empty')
  controller.submit('not a url')
  assert.equal(controller.getState().fieldError, 'invalid')
  assert.equal(controller.getState().phase, 'idle')
  assert.deepEqual(names(), ['audit_validation_error', 'audit_validation_error'])
  assert.equal(calls, 0)
})

test('домен без протокола: запрос с https, UTM и referrer уходят на бэкенд', async () => {
  const seen = []
  const client = { runAudit: async (input) => { seen.push(input); return { status: 'completed', audit: { summary: 's' } } } }
  const { controller } = setup({ client })
  await controller.submit('example.ru')
  assert.deepEqual(seen, [{
    url: 'https://example.ru/',
    utmSource: 'threads',
    utmMedium: 'social',
    utmCampaign: 'audit',
    referrer: 'https://t.co/path',
  }])
})

test('без атрибуции на бэкенд уходит только url', async () => {
  const seen = []
  const client = { runAudit: async (input) => { seen.push(input); return { status: 'completed', audit: { summary: 's' } } } }
  const { controller } = setup({ client, attribution: {} })
  await controller.submit('example.ru')
  assert.equal(seen[0].url, 'https://example.ru/')
  assert.equal(seen[0].utmSource, undefined)
})

test('completed с auditId: состояния и событие audit_completed', async () => {
  const { controller, events, results } = setup()
  const phases = []
  controller.subscribe(() => phases.push(controller.getState().phase))
  await controller.submit('example.ru')
  assert.deepEqual(phases.slice(-2), ['loading', 'result'])
  const state = controller.getState()
  assert.equal(state.url, 'https://example.ru/')
  assert.equal(state.hostname, 'example.ru')
  assert.equal(state.response.status, 'completed')
  assert.match(state.response.auditId, /^[0-9a-f-]{36}$/)
  assert.deepEqual(events.map(([name]) => name), ['audit_submit', 'audit_loading_started', 'audit_completed'])
  const completed = events.at(-1)[1]
  assert.equal(completed.auditId, state.response.auditId)
  assert.equal(completed.status, 'completed')
  assert.equal(completed.hostname, 'example.ru')
  assert.equal(completed.utmSource, 'threads')
  assert.equal(results.length, 1)
})

test('completed без auditId тоже успешный', async () => {
  const { controller, events } = setup()
  await controller.submit('noid.example.ru')
  assert.equal(controller.getState().phase, 'result')
  assert.equal(controller.getState().response.auditId, undefined)
  assert.equal(events.at(-1)[0], 'audit_completed')
})

test('partial с auditId: событие audit_partial', async () => {
  const { controller, events } = setup()
  await controller.submit('partial.example.ru')
  assert.equal(controller.getState().response.status, 'partial')
  assert.ok(controller.getState().response.auditId)
  assert.equal(events.at(-1)[0], 'audit_partial')
  assert.equal(events.at(-1)[1].status, 'partial')
})

test('в аналитику не попадают полный URL, query, тексты и referrer целиком', async () => {
  const { controller, events } = setup()
  await controller.submit('https://example.ru/secret/path?token=1')
  const dump = JSON.stringify(events)
  for (const forbidden of ['secret', 'token', 'Юридическая', 'https://', 't.co/path']) {
    assert.equal(dump.includes(forbidden), false, forbidden)
  }
  assert.ok(dump.includes('"referrerHost":"t.co"'))
})

test('повторная отправка во время загрузки игнорируется: один запрос', async () => {
  let calls = 0
  const client = { runAudit: async () => { calls += 1; await new Promise((r) => setTimeout(r, 10)); return { status: 'completed', audit: { summary: 's' } } } }
  const { controller } = setup({ client })
  const first = controller.submit('example.ru')
  for (let i = 0; i < 5; i += 1) controller.submit('example.ru')
  await first
  assert.equal(calls, 1)
})

test('ошибки: временная, лимиты, занято, сеть', async () => {
  for (const [host, code] of [
    ['error.example.ru', 'AUDIT_TEMPORARILY_UNAVAILABLE'],
    ['limit.example.ru', 'RATE_LIMITED'],
    ['budget.example.ru', 'AUDIT_LIMIT_REACHED'],
    ['busy.example.ru', 'AUDIT_BUSY'],
    ['down.example.ru', 'AUDIT_NOT_AVAILABLE'],
    ['offline.example.ru', 'NETWORK_ERROR'],
  ]) {
    const { controller, names } = setup()
    await controller.submit(host)
    assert.equal(controller.getState().phase, 'error')
    assert.equal(controller.getState().errorCode, code)
    assert.equal(names().at(-1), 'audit_failed')
  }
})

test('неизвестная ошибка клиента считается сетевой', async () => {
  const client = { runAudit: async () => { throw Object.assign(new Error('x'), { code: 'INVALID_URL' }) } }
  const { controller } = setup({ client })
  await controller.submit('example.ru')
  assert.equal(controller.getState().phase, 'error')
  assert.equal(controller.getState().errorCode, 'NETWORK_ERROR')
})

test('retry: тот же URL, новый запрос по клику, без автоповторов', async () => {
  let attempt = 0
  const urls = []
  const client = {
    runAudit: async (input) => {
      attempt += 1
      urls.push(input.url)
      if (attempt === 1) throw new AuditError('AUDIT_TEMPORARILY_UNAVAILABLE')
      return { status: 'completed', audit: { summary: 's' } }
    },
  }
  const { controller, names } = setup({ client })
  await controller.submit('example.ru')
  assert.equal(controller.getState().phase, 'error')
  assert.equal(attempt, 1)
  assert.equal(controller.getState().input, 'example.ru')
  await controller.retry()
  assert.equal(controller.getState().phase, 'result')
  assert.deepEqual(urls, ['https://example.ru/', 'https://example.ru/'])
  assert.ok(names().includes('audit_retry_click'))
})

test('INVALID_URL из API возвращает форму с подсказкой', async () => {
  const client = { runAudit: async () => { throw new AuditError('INVALID_URL') } }
  const { controller } = setup({ client })
  await controller.submit('example.ru')
  assert.equal(controller.getState().phase, 'idle')
  assert.equal(controller.getState().fieldError, 'invalid')
})

test('проверить другой сайт возвращает форму в исходное состояние', async () => {
  const { controller, names } = setup()
  await controller.submit('example.ru')
  controller.newSite()
  const state = controller.getState()
  assert.equal(state.phase, 'idle')
  assert.equal(state.input, '')
  assert.equal(state.response, null)
  assert.equal(names().at(-1), 'audit_new_site_click')
})

function pdfSetup(clientOverrides = {}) {
  const events = []
  const opened = []
  let failed = 0
  const client = { getPdfLink: async () => ({ downloadUrl: 'https://api.test/pdf/token-secret' }), ...clientOverrides }
  const pdf = createPdfController({
    client,
    track: (name, params) => events.push([name, params]),
    openUrl: (url) => opened.push(url),
    onFail: () => { failed += 1 },
  })
  return { pdf, events, opened, failed: () => failed }
}

const args = { auditId: '2f5c8d0e-1111-4222-8333-444455556666', hostname: 'example.ru' }

test('PDF: loading → открытие ссылки → возврат в idle, токен не уходит в аналитику', async () => {
  const { pdf, events, opened } = pdfSetup()
  const states = []
  pdf.subscribe(() => states.push(pdf.getState().status))
  await pdf.download(args)
  assert.deepEqual(states, ['loading', 'idle'])
  assert.deepEqual(opened, ['https://api.test/pdf/token-secret'])
  assert.deepEqual(events.map(([name]) => name), ['audit_pdf_click', 'audit_pdf_ready'])
  assert.equal(JSON.stringify(events).includes('token-secret'), false)
  assert.equal(events[0][1].auditId, args.auditId)
})

test('PDF: ошибка переводит в локальное состояние error и не открывает ссылку', async () => {
  const { pdf, events, opened, failed } = pdfSetup({ getPdfLink: async () => { throw new AuditError('PDF_FAILED') } })
  await pdf.download(args)
  assert.equal(pdf.getState().status, 'error')
  assert.deepEqual(opened, [])
  assert.equal(failed(), 1)
  assert.equal(events.at(-1)[0], 'audit_pdf_failed')
  await pdf.download(args)
  assert.equal(pdf.getState().status, 'error')
})

test('PDF: двойной клик создает один запрос, без auditId запроса нет', async () => {
  let calls = 0
  const { pdf } = pdfSetup({ getPdfLink: async () => { calls += 1; await new Promise((r) => setTimeout(r, 10)); return { downloadUrl: 'https://api.test/x' } } })
  const first = pdf.download(args)
  pdf.download(args)
  pdf.download(args)
  await first
  assert.equal(calls, 1)
  await pdf.download({ hostname: 'example.ru' })
  assert.equal(calls, 1)
})

test('ошибка PDF не затрагивает состояние аудита', async () => {
  const { controller } = setup()
  await controller.submit('pdferr.example.ru')
  const before = controller.getState()
  const { pdf } = pdfSetup({ getPdfLink: async () => { throw new AuditError('PDF_FAILED') } })
  await pdf.download({ auditId: before.response.auditId, hostname: before.hostname })
  assert.equal(pdf.getState().status, 'error')
  assert.equal(controller.getState(), before)
  assert.equal(controller.getState().phase, 'result')
})
