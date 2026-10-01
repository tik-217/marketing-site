import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createMockAuditClient } from '../api/mockAuditClient.js'
import { createAuditController } from '../model/controller.js'

function setup(overrides = {}) {
  const events = []
  const results = []
  const controller = createAuditController({
    client: createMockAuditClient({ delayMs: 0 }),
    track: (name, params) => events.push([name, params]),
    source: 'threads',
    makeCode: () => 'A7K3',
    onResult: (entry) => results.push(entry),
    ...overrides,
  })
  return { controller, events, results, names: () => events.map(([name]) => name) }
}

test('пустая отправка и невалидный URL', () => {
  const { controller, names } = setup()
  controller.submit('   ')
  assert.equal(controller.getState().fieldError, 'empty')
  controller.submit('not a url')
  assert.equal(controller.getState().fieldError, 'invalid')
  assert.equal(controller.getState().phase, 'idle')
  assert.deepEqual(names(), ['audit_validation_error', 'audit_validation_error'])
})

test('домен без протокола запускает аудит, результат completed', async () => {
  const { controller, names, results } = setup()
  const states = []
  controller.subscribe(() => states.push(controller.getState().phase))
  await controller.submit('example.ru')
  assert.deepEqual(states.slice(-2), ['loading', 'result'])
  const state = controller.getState()
  assert.equal(state.url, 'https://example.ru/')
  assert.equal(state.hostname, 'example.ru')
  assert.equal(state.resultCode, 'A7K3')
  assert.equal(state.response.status, 'completed')
  assert.deepEqual(names(), ['audit_submit', 'audit_loading_started', 'audit_completed'])
  assert.equal(results.length, 1)
})

test('события не содержат полный URL и текст результата', async () => {
  const { controller, events } = setup()
  await controller.submit('https://example.ru/secret/path?token=1')
  const dump = JSON.stringify(events)
  assert.equal(dump.includes('secret'), false)
  assert.equal(dump.includes('token'), false)
  assert.equal(dump.includes('Юридическая'), false)
})

test('partial: событие audit_partial', async () => {
  const { controller, names } = setup()
  await controller.submit('partial.example.ru')
  assert.equal(controller.getState().response.status, 'partial')
  assert.equal(names().at(-1), 'audit_partial')
})

test('повторная отправка во время загрузки игнорируется', async () => {
  let calls = 0
  const client = { runAudit: async () => { calls += 1; await new Promise((r) => setTimeout(r, 10)); return { status: 'completed', audit: { summary: 's' } } } }
  const { controller } = setup({ client })
  const first = controller.submit('example.ru')
  for (let i = 0; i < 5; i += 1) controller.submit('example.ru')
  await first
  assert.equal(calls, 1)
})

test('ошибки: временная, лимит, занято, сеть', async () => {
  for (const [host, code] of [
    ['error.example.ru', 'AUDIT_TEMPORARILY_UNAVAILABLE'],
    ['limit.example.ru', 'RATE_LIMITED'],
    ['busy.example.ru', 'AUDIT_BUSY'],
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
  const client = { runAudit: async () => { throw Object.assign(new Error('x'), { name: 'AuditError', code: 'INVALID_URL' }) } }
  const { controller } = setup({ client })
  await controller.submit('example.ru')
  // не AuditError по instanceof: считается сетевой ошибкой
  assert.equal(controller.getState().phase, 'error')
})

test('retry использует тот же URL и сохраняет поле ввода', async () => {
  let attempt = 0
  const client = {
    runAudit: async (url) => {
      attempt += 1
      assert.equal(url, 'https://example.ru/')
      if (attempt === 1) {
        const { AuditError } = await import('../model/types.js')
        throw new AuditError('AUDIT_TEMPORARILY_UNAVAILABLE')
      }
      return { status: 'completed', audit: { summary: 's' } }
    },
  }
  const { controller, names } = setup({ client })
  await controller.submit('example.ru')
  assert.equal(controller.getState().phase, 'error')
  assert.equal(controller.getState().input, 'example.ru')
  await controller.retry()
  assert.equal(controller.getState().phase, 'result')
  assert.equal(attempt, 2)
  assert.ok(names().includes('audit_retry_click'))
})

test('INVALID_URL из API возвращает форму с подсказкой', async () => {
  const { AuditError } = await import('../model/types.js')
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
