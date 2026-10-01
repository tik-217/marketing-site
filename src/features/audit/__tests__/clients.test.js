import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createAuditClient, getAuditMode } from '../api/config.js'
import { createHttpAuditClient } from '../api/httpAuditClient.js'
import { createMockAuditClient } from '../api/mockAuditClient.js'

const noFetch = () => {
  throw new Error('сетевой запрос в режиме mock')
}

test('по умолчанию режим mock, live только по явному флагу', () => {
  assert.equal(getAuditMode({}), 'mock')
  assert.equal(getAuditMode(undefined), 'mock')
  assert.equal(getAuditMode({ VITE_AUDIT_MODE: 'true' }), 'mock')
  assert.equal(getAuditMode({ VITE_AUDIT_MODE: 'live' }), 'live')
})

test('mock-режим не обращается к сети и не трогает api.gabulyan-tigran.ru', async () => {
  const original = globalThis.fetch
  const calls = []
  globalThis.fetch = (...args) => {
    calls.push(args)
    return noFetch()
  }
  try {
    const client = createAuditClient({ mode: getAuditMode({}), delayMs: 0 })
    for (const host of ['example.ru', 'partial.example.ru', 'empty.example.ru']) {
      await client.runAudit(`https://${host}/`)
    }
    for (const host of ['error', 'limit', 'busy', 'down', 'offline']) {
      await assert.rejects(client.runAudit(`https://${host}.example.ru/`))
    }
    assert.equal(calls.length, 0)
  } finally {
    globalThis.fetch = original
  }
})

test('mock-сценарии по поддомену', async () => {
  const client = createMockAuditClient({ delayMs: 0 })
  assert.equal((await client.runAudit('https://example.ru/')).status, 'completed')
  assert.equal((await client.runAudit('https://partial.example.ru/')).status, 'partial')
  assert.deepEqual((await client.runAudit('https://empty.example.ru/')).audit.problems, [])
  const codes = { error: 'AUDIT_TEMPORARILY_UNAVAILABLE', limit: 'RATE_LIMITED', busy: 'AUDIT_BUSY', down: 'AUDIT_NOT_AVAILABLE', offline: 'NETWORK_ERROR' }
  for (const [host, code] of Object.entries(codes)) {
    await assert.rejects(client.runAudit(`https://${host}.example.ru/`), { code })
  }
})

test('mock отдает копию, фикстура не мутирует', async () => {
  const client = createMockAuditClient({ delayMs: 0 })
  const first = await client.runAudit('https://example.ru/')
  first.audit.summary = 'changed'
  assert.notEqual((await client.runAudit('https://example.ru/')).audit.summary, 'changed')
})

test('http-клиент: успешный ответ, ошибка API, сеть, мусор', async () => {
  const json = (status, body) => async () => ({ ok: status < 400, status, json: async () => body })
  const url = 'https://example.ru/'

  const ok = createHttpAuditClient({
    baseUrl: 'https://api.test',
    fetchImpl: async (endpoint, init) => {
      assert.equal(endpoint, 'https://api.test/api/audit')
      assert.equal(init.method, 'POST')
      assert.deepEqual(JSON.parse(init.body), { url })
      return { ok: true, status: 200, json: async () => ({ status: 'completed', audit: { summary: 's' } }) }
    },
  })
  assert.equal((await ok.runAudit(url)).audit.summary, 's')

  const limited = createHttpAuditClient({ baseUrl: 'x', fetchImpl: json(429, { error: { code: 'RATE_LIMITED', message: 'm' } }) })
  await assert.rejects(limited.runAudit(url), { code: 'RATE_LIMITED' })

  const offline = createHttpAuditClient({ baseUrl: 'x', fetchImpl: async () => { throw new TypeError('fail') } })
  await assert.rejects(offline.runAudit(url), { code: 'NETWORK_ERROR' })

  const garbage = createHttpAuditClient({ baseUrl: 'x', fetchImpl: json(200, { hello: 1 }) })
  await assert.rejects(garbage.runAudit(url), { code: 'INVALID_RESPONSE' })

  const notJson = createHttpAuditClient({ baseUrl: 'x', fetchImpl: async () => ({ ok: true, status: 200, json: async () => { throw new Error('bad') } }) })
  await assert.rejects(notJson.runAudit(url), { code: 'INVALID_RESPONSE' })
})
