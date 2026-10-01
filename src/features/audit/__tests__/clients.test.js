import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createAuditClient, getApiUrl, getAuditMode } from '../api/config.js'
import { buildAuditBody, createHttpAuditClient } from '../api/httpAuditClient.js'
import { createMockAuditClient } from '../api/mockAuditClient.js'

const url = 'https://example.ru/'
const input = (host) => ({ url: `https://${host}/` })

test('по умолчанию режим mock, live только по явному флагу', () => {
  assert.equal(getAuditMode({}), 'mock')
  assert.equal(getAuditMode(undefined), 'mock')
  assert.equal(getAuditMode({ VITE_AUDIT_MODE: 'true' }), 'mock')
  assert.equal(getAuditMode({ VITE_AUDIT_MODE: 'live' }), 'live')
})

test('адрес API: по умолчанию боевой, свой только по https', () => {
  assert.equal(getApiUrl({}), 'https://api.gabulyan-tigran.ru')
  assert.equal(getApiUrl({ VITE_AUDIT_API_URL: 'https://x.test/' }), 'https://x.test')
  assert.equal(getApiUrl({ VITE_AUDIT_API_URL: 'http://x.test' }), 'https://api.gabulyan-tigran.ru')
})

test('mock-режим не обращается к сети и не трогает api.gabulyan-tigran.ru', async () => {
  const original = globalThis.fetch
  const calls = []
  globalThis.fetch = (...args) => {
    calls.push(args)
    throw new Error('сетевой запрос в режиме mock')
  }
  try {
    const client = createAuditClient({ mode: getAuditMode({}), delayMs: 0 })
    for (const host of ['example.ru', 'partial.example.ru', 'empty.example.ru', 'noid.example.ru']) {
      await client.runAudit(input(host))
    }
    for (const host of ['error', 'limit', 'budget', 'busy', 'down', 'offline']) {
      await assert.rejects(client.runAudit(input(`${host}.example.ru`)))
    }
    const ok = await client.runAudit(input('example.ru'))
    await client.getPdfLink(ok.auditId)
    await assert.rejects(client.getPdfLink((await client.runAudit(input('pdferr.example.ru'))).auditId))
    assert.equal(calls.length, 0)
  } finally {
    globalThis.fetch = original
  }
})

test('mock-сценарии по поддомену', async () => {
  const client = createMockAuditClient({ delayMs: 0 })
  assert.equal((await client.runAudit(input('example.ru'))).status, 'completed')
  assert.equal((await client.runAudit(input('partial.example.ru'))).status, 'partial')
  assert.deepEqual((await client.runAudit(input('empty.example.ru'))).audit.problems, [])
  const codes = {
    error: 'AUDIT_TEMPORARILY_UNAVAILABLE',
    limit: 'RATE_LIMITED',
    budget: 'AUDIT_LIMIT_REACHED',
    busy: 'AUDIT_BUSY',
    down: 'AUDIT_NOT_AVAILABLE',
    offline: 'NETWORK_ERROR',
  }
  for (const [host, code] of Object.entries(codes)) {
    await assert.rejects(client.runAudit(input(`${host}.example.ru`)), { code })
  }
})

test('mock: auditId есть у обычного разбора и отсутствует в сценарии noid', async () => {
  const client = createMockAuditClient({ delayMs: 0 })
  assert.match((await client.runAudit(input('example.ru'))).auditId, /^[0-9a-f-]{36}$/)
  assert.equal('auditId' in (await client.runAudit(input('noid.example.ru'))), false)
})

test('mock отдает копию, фикстура не мутирует', async () => {
  const client = createMockAuditClient({ delayMs: 0 })
  const first = await client.runAudit(input('example.ru'))
  first.audit.summary = 'changed'
  assert.notEqual((await client.runAudit(input('example.ru'))).audit.summary, 'changed')
})

test('тело запроса: UTM и referrer только если есть, лишних полей нет', () => {
  assert.deepEqual(buildAuditBody({ url }), { url })
  assert.deepEqual(buildAuditBody({ url, utmSource: '', utmMedium: undefined, referrer: '  ' }), { url })
  assert.deepEqual(
    buildAuditBody({ url, utmSource: 'threads', utmMedium: 'social', utmCampaign: 'audit', referrer: 'https://t.co', extra: 'x', hostname: 'a' }),
    { url, utmSource: 'threads', utmMedium: 'social', utmCampaign: 'audit', referrer: 'https://t.co' },
  )
})

test('http-клиент POST /api/audit: тело, успешный ответ с auditId и без', async () => {
  const requests = []
  const fetchImpl = (body) => async (endpoint, init) => {
    requests.push({ endpoint, init })
    return { ok: true, status: 200, json: async () => body }
  }

  const withId = createHttpAuditClient({
    baseUrl: 'https://api.test',
    fetchImpl: fetchImpl({ status: 'completed', auditId: '2f5c8d0e-1111-4222-8333-444455556666', audit: { summary: 's' } }),
  })
  const res = await withId.runAudit({ url, utmSource: 'threads', referrer: 'https://t.co' })
  assert.equal(res.auditId, '2f5c8d0e-1111-4222-8333-444455556666')
  assert.equal(requests[0].endpoint, 'https://api.test/api/audit')
  assert.equal(requests[0].init.method, 'POST')
  assert.equal(requests[0].init.headers['Content-Type'], 'application/json')
  assert.deepEqual(JSON.parse(requests[0].init.body), { url, utmSource: 'threads', referrer: 'https://t.co' })

  const noId = createHttpAuditClient({ baseUrl: 'https://api.test', fetchImpl: fetchImpl({ status: 'completed', audit: { summary: 's' } }) })
  assert.equal('auditId' in (await noId.runAudit({ url })), false)

  const badId = createHttpAuditClient({ baseUrl: 'https://api.test', fetchImpl: fetchImpl({ status: 'partial', auditId: '<script>', audit: { summary: 's' } }) })
  const partial = await badId.runAudit({ url })
  assert.equal(partial.status, 'partial')
  assert.equal('auditId' in partial, false)
})

test('http-клиент: ошибки API, сеть, мусор', async () => {
  const json = (status, body) => async () => ({ ok: status < 400, status, json: async () => body })

  for (const [status, code, expected] of [
    [429, 'RATE_LIMITED', 'RATE_LIMITED'],
    [429, 'AUDIT_LIMIT_REACHED', 'AUDIT_LIMIT_REACHED'],
    [503, 'AUDIT_BUSY', 'AUDIT_BUSY'],
    [503, 'AUDIT_TEMPORARILY_UNAVAILABLE', 'AUDIT_TEMPORARILY_UNAVAILABLE'],
    [503, 'AUDIT_NOT_AVAILABLE', 'AUDIT_NOT_AVAILABLE'],
    [400, 'INVALID_URL', 'INVALID_URL'],
  ]) {
    const client = createHttpAuditClient({ baseUrl: 'x', fetchImpl: json(status, { error: { code, message: 'internal' } }) })
    await assert.rejects(client.runAudit({ url }), { code: expected })
  }

  const offline = createHttpAuditClient({ baseUrl: 'x', fetchImpl: async () => { throw new TypeError('fail') } })
  await assert.rejects(offline.runAudit({ url }), { code: 'NETWORK_ERROR' })
  const garbage = createHttpAuditClient({ baseUrl: 'x', fetchImpl: json(200, { hello: 1 }) })
  await assert.rejects(garbage.runAudit({ url }), { code: 'INVALID_RESPONSE' })
  const notJson = createHttpAuditClient({ baseUrl: 'x', fetchImpl: async () => ({ ok: true, status: 200, json: async () => { throw new Error('bad') } }) })
  await assert.rejects(notJson.runAudit({ url }), { code: 'INVALID_RESPONSE' })
})

test('http-клиент POST /api/audits/{id}/pdf-token: успех и ошибки', async () => {
  const calls = []
  const ok = createHttpAuditClient({
    baseUrl: 'https://api.test',
    fetchImpl: async (endpoint, init) => {
      calls.push({ endpoint, init })
      return { ok: true, status: 200, json: async () => ({ downloadUrl: 'https://api.test/pdf/abc', expiresAt: '2030-01-01T00:00:00Z' }) }
    },
  })
  const link = await ok.getPdfLink('2f5c8d0e-1111-4222-8333-444455556666')
  assert.equal(calls[0].endpoint, 'https://api.test/api/audits/2f5c8d0e-1111-4222-8333-444455556666/pdf-token')
  assert.equal(calls[0].init.method, 'POST')
  assert.equal(calls[0].init.body, undefined)
  // пустой POST без Content-Type: с этим заголовком бэкенд отвечает 400 BAD_REQUEST
  assert.equal(calls[0].init.headers, undefined)
  assert.deepEqual(link, { downloadUrl: 'https://api.test/pdf/abc', expiresAt: '2030-01-01T00:00:00Z' })

  const failing = (fetchImpl) => createHttpAuditClient({ baseUrl: 'x', fetchImpl }).getPdfLink('id-12345678')
  await assert.rejects(failing(async () => ({ ok: false, status: 404, json: async () => ({}) })), { code: 'PDF_FAILED' })
  await assert.rejects(failing(async () => { throw new TypeError('x') }), { code: 'PDF_FAILED' })
  await assert.rejects(failing(async () => ({ ok: true, status: 200, json: async () => ({}) })), { code: 'PDF_FAILED' })
  await assert.rejects(failing(async () => ({ ok: true, status: 200, json: async () => ({ downloadUrl: 'javascript:alert(1)' }) })), { code: 'PDF_FAILED' })
  await assert.rejects(failing(async () => ({ ok: true, status: 200, json: async () => ({ downloadUrl: 'http://insecure.test/a.pdf' }) })), { code: 'PDF_FAILED' })
})
