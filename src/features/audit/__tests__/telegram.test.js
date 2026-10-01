import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cleanReferrer, cleanTag, internalPath, resolveAttribution } from '../lib/context.js'
import { canRetry, hasTelegramFallback, messageForError, PDF_ERROR, PDF_LOADING } from '../lib/messages.js'
import { buildLimitMessage, buildTelegramMessage, buildTelegramUrl, intents, makeResultCode } from '../lib/telegramLink.js'
import { createTracker, sanitizeParams } from '../../../shared/lib/analytics/track.js'
import { createAuditTracker } from '../lib/track.js'

const memoryStorage = () => {
  const store = new Map()
  return { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) }
}

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
  assert.equal(messageForError('AUDIT_LIMIT_REACHED'), 'На сегодня лимит бесплатных аудитов исчерпан.')
  assert.equal(messageForError('INVALID_URL'), 'Проверьте ссылку на сайт.')
  assert.equal(messageForError('AUDIT_BUSY'), 'Сейчас много запросов. Попробуйте чуть позже.')
  assert.equal(messageForError('AUDIT_NOT_AVAILABLE'), 'Сервис временно недоступен.')
  assert.equal(canRetry('AUDIT_TEMPORARILY_UNAVAILABLE'), true)
  assert.equal(canRetry('RATE_LIMITED'), false)
  assert.equal(canRetry('AUDIT_LIMIT_REACHED'), false)
  assert.equal(hasTelegramFallback('AUDIT_LIMIT_REACHED'), true)
  assert.equal(hasTelegramFallback('AUDIT_TEMPORARILY_UNAVAILABLE'), false)
  for (const code of ['RATE_LIMITED', 'AUDIT_BUSY', 'AUDIT_LIMIT_REACHED', 'NETWORK_ERROR']) {
    assert.doesNotMatch(messageForError(code), /429|503|Yandex|Alice|Flash|provider|budget|token/i)
  }
  assert.equal(PDF_LOADING, 'Готовлю PDF...')
  assert.equal(PDF_ERROR, 'Не получилось подготовить PDF. Попробуйте еще раз.')
})

test('аналитика пропускает только разрешенные безопасные параметры', () => {
  assert.deepEqual(
    sanitizeParams({
      hostname: 'example.ru',
      url: 'https://example.ru/x?a=1',
      summary: 'text',
      utmSource: 'threads',
      utmMedium: 'a/b',
      fromPage: '/cases',
      referrerHost: 't.co',
      auditId: '2f5c8d0e-1111-4222-8333-444455556666',
      code: 'A7K3',
      seconds: 22,
      downloadUrl: 'https://api.test/pdf?token=1',
      token: 'abc',
    }),
    {
      hostname: 'example.ru',
      utmSource: 'threads',
      fromPage: '/cases',
      referrerHost: 't.co',
      auditId: '2f5c8d0e-1111-4222-8333-444455556666',
      code: 'A7K3',
      seconds: '22',
    },
  )
  assert.deepEqual(sanitizeParams({ hostname: 'https://example.ru/page?x=1', auditId: 'not an id!' }), {})
})

test('трекер не падает, если отправка бросает ошибку', () => {
  const track = createTracker({ send: () => { throw new Error('boom') } })
  assert.doesNotThrow(() => track('audit_page_view', {}))
})

test('live-трекер добавляет mode, mock не шлет в Метрику', () => {
  const sent = []
  createAuditTracker('live', (name, params) => sent.push([name, params]))('audit_submit', { hostname: 'example.ru' })
  assert.deepEqual(sent, [['audit_submit', { hostname: 'example.ru', mode: 'live' }]])

  globalThis.ym = () => assert.fail('mock не должен слать цели в Метрику')
  try {
    createAuditTracker('mock')('audit_submit', { hostname: 'example.ru' })
  } finally {
    delete globalThis.ym
  }
})

test('события воронки уходят в Метрику через reachGoal без лишних данных', () => {
  const calls = []
  globalThis.ym = (...args) => calls.push(args)
  try {
    createAuditTracker('live')('audit_telegram_click', {
      hostname: 'example.ru',
      auditId: '2f5c8d0e-1111-4222-8333-444455556666',
      text: 'secret summary',
    })
  } finally {
    delete globalThis.ym
  }
  assert.equal(calls.length, 1)
  assert.deepEqual(calls[0].slice(1, 3), ['reachGoal', 'audit_telegram_click'])
  assert.deepEqual(calls[0][3], { hostname: 'example.ru', auditId: '2f5c8d0e-1111-4222-8333-444455556666', mode: 'live' })
})

test('UTM: читаются при первом заходе и живут всю сессию', () => {
  const storage = memoryStorage()
  const first = resolveAttribution('?utm_source=Threads&utm_medium=social&utm_campaign=audit&foo=bar&url=x', { storage, referrer: '', origin: 'https://gabulyan-tigran.ru' })
  assert.deepEqual([first.utmSource, first.utmMedium, first.utmCampaign], ['threads', 'social', 'audit'])
  const later = resolveAttribution('', { storage, referrer: '', origin: 'https://gabulyan-tigran.ru' })
  assert.deepEqual([later.utmSource, later.utmMedium, later.utmCampaign], ['threads', 'social', 'audit'])
  assert.equal(JSON.stringify(first).includes('foo'), false)
})

test('UTM: без меток поля пустые, мусор отбрасывается', () => {
  const none = resolveAttribution('', { storage: memoryStorage(), referrer: '', origin: 'https://a.ru' })
  assert.deepEqual([none.utmSource, none.utmMedium, none.utmCampaign], ['', '', ''])
  const junk = resolveAttribution('?utm_source=<script>&utm_medium=a b&utm_campaign=' + 'x'.repeat(100), { storage: memoryStorage(), referrer: '', origin: 'https://a.ru' })
  assert.deepEqual([junk.utmSource, junk.utmMedium, junk.utmCampaign], ['', '', ''])
  assert.equal(cleanTag('yandex-direct_1'), 'yandex-direct_1')
})

test('referrer: без query и hash, хост отдельно, внутренняя страница как fromPage', () => {
  assert.deepEqual(cleanReferrer('https://t.co/abc?x=1#h'), { referrer: 'https://t.co/abc', referrerHost: 't.co' })
  assert.deepEqual(cleanReferrer('https://google.com/'), { referrer: 'https://google.com', referrerHost: 'google.com' })
  assert.deepEqual(cleanReferrer(''), { referrer: '', referrerHost: '' })
  assert.deepEqual(cleanReferrer('javascript:alert(1)'), { referrer: '', referrerHost: '' })
  assert.deepEqual(cleanReferrer('not a url'), { referrer: '', referrerHost: '' })
  assert.equal(internalPath('https://gabulyan-tigran.ru/cases?x=1', 'https://gabulyan-tigran.ru'), '/cases')
  assert.equal(internalPath('https://t.co/cases', 'https://gabulyan-tigran.ru'), '')

  const attr = resolveAttribution('', { storage: memoryStorage(), referrer: 'https://gabulyan-tigran.ru/cases/legal?x=1', origin: 'https://gabulyan-tigran.ru' })
  assert.equal(attr.fromPage, '/cases/legal')
  assert.equal(attr.referrer, 'https://gabulyan-tigran.ru/cases/legal')
  assert.equal(attr.referrerHost, 'gabulyan-tigran.ru')
})
