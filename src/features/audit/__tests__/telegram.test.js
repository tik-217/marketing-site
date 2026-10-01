import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cleanTag, resolveSource } from '../lib/context.js'
import { loadLastResult, saveLastResult } from '../lib/lastResult.js'
import { canRetry, hasTelegramFallback, messageForError } from '../lib/messages.js'
import { buildLimitMessage, buildTelegramMessage, buildTelegramUrl, intents, makeResultCode } from '../lib/telegramLink.js'
import { createTracker, sanitizeParams } from '../../../shared/lib/analytics/track.js'
import { createAuditTracker } from '../lib/track.js'

test('сообщение в Telegram содержит сайт, намерение и код', () => {
  const text = buildTelegramMessage({ intent: 'ads', hostname: 'example.ru', code: 'A7K3' })
  assert.match(text, /example\.ru/)
  assert.match(text, new RegExp(intents.ads.text))
  assert.match(text, /Код: A7K3/)
  const url = buildTelegramUrl('https://t.me/tigran_front', text)
  assert.ok(url.startsWith('https://t.me/tigran_front?text='))
  assert.equal(new URL(url).searchParams.get('text'), text)
  assert.match(buildLimitMessage({ hostname: 'example.ru' }), /example\.ru/)
})

test('код результата: 4 символа без похожих знаков', () => {
  for (let i = 0; i < 50; i += 1) assert.match(makeResultCode(), /^[A-HJ-NP-Z2-9]{4}$/)
})

test('тексты ошибок и доступные действия', () => {
  assert.equal(messageForError('RATE_LIMITED'), 'На сегодня лимит бесплатных аудитов исчерпан.')
  assert.equal(messageForError('INVALID_URL'), 'Проверьте ссылку на сайт.')
  assert.equal(canRetry('AUDIT_TEMPORARILY_UNAVAILABLE'), true)
  assert.equal(canRetry('RATE_LIMITED'), false)
  assert.equal(hasTelegramFallback('RATE_LIMITED'), true)
  assert.equal(hasTelegramFallback('AUDIT_TEMPORARILY_UNAVAILABLE'), false)
})

test('аналитика пропускает только разрешенные короткие параметры без ссылок', () => {
  assert.deepEqual(
    sanitizeParams({ host: 'example.ru', url: 'https://example.ru/x', summary: 'text', src: 'a/b', code: 'A7K3', seconds: 22 }),
    { host: 'example.ru', code: 'A7K3', seconds: '22' },
  )
})

test('трекер не падает, если отправка бросает ошибку', () => {
  const track = createTracker({ send: () => { throw new Error('boom') } })
  assert.doesNotThrow(() => track('audit_page_view', {}))
})

test('live-трекер добавляет mode, mock не шлет в Метрику', () => {
  const sent = []
  createAuditTracker('live', (name, params) => sent.push([name, params]))('audit_submit', { host: 'example.ru' })
  assert.deepEqual(sent, [['audit_submit', { host: 'example.ru', mode: 'live' }]])

  globalThis.ym = () => assert.fail('mock не должен слать цели в Метрику')
  try {
    createAuditTracker('mock')('audit_submit', { host: 'example.ru' })
  } finally {
    delete globalThis.ym
  }
})

test('источник трафика: из query, из сессии, по умолчанию direct', () => {
  const store = new Map()
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) }
  assert.equal(resolveSource('', storage), 'direct')
  assert.equal(resolveSource('?src=Threads', storage), 'threads')
  assert.equal(resolveSource('', storage), 'threads')
  assert.equal(cleanTag('<script>'), '')
})

test('последний результат хранится 7 дней', () => {
  const store = new Map()
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) }
  saveLastResult('mock', { hostname: 'example.ru', response: { status: 'completed' } }, storage, 1000)
  assert.equal(loadLastResult('mock', storage, 2000).hostname, 'example.ru')
  assert.equal(loadLastResult('live', storage, 2000), null)
  assert.equal(loadLastResult('mock', storage, 1000 + 8 * 24 * 3600 * 1000), null)
})
