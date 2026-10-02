// Постоянная ссылка на отчет: парсинг, клиент, состояние, интерфейс (без браузера), SEO и приватность.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import { createHttpAuditClient } from '../api/httpAuditClient.js'
import {
  createMockAuditClient,
  MOCK_REPORT_ERROR_ID,
  MOCK_REPORT_ID,
  MOCK_REPORT_PARTIAL_ID,
  MOCK_REPORT_PDF_FAIL_ID,
} from '../api/mockAuditClient.js'
import { parseAuditResponse, parseReportResponse } from '../api/parseResponse.js'
import { buildReportUrl, copyText, formatReportDate, reportPath } from '../lib/reportLink.js'
import { PARTIAL_NOTICE } from '../lib/messages.js'
import { createReportController, createReportTrack } from '../model/reportController.js'
import { AuditError } from '../model/types.js'
import { sanitizeParams } from '../../../shared/lib/analytics/track.js'
import { robotsContent } from '../../../shared/lib/seo/robots.js'

const read = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8')
const code = (path) => read(path).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
const API = 'https://api.test'
const REPORT_ID = 'm7GqM9mMks0rG8QjFN2ak4Bp'
const noop = () => {}
const savedReport = (over = {}) => ({
  status: 'completed',
  report: {
    createdAt: '2026-10-02T09:00:00.000Z',
    hostname: 'example.ru',
    pathname: '/',
    audit: { summary: 'Итог', priorityActions: [{ area: 'Первый экран', action: 'Сделать выгоду конкретнее' }], problems: [], secondaryNotes: ['Заметка'], mobileNotes: [], strengths: ['Сильная сторона'] },
  },
  ...over,
})
const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

let server
let ReportView
let HelmetProvider
let Seo
before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  ;({ ReportView } = await server.ssrLoadModule('/src/features/audit/ui/ReportView.jsx'))
  ;({ HelmetProvider } = await server.ssrLoadModule('react-helmet-async'))
  ;({ Seo } = await server.ssrLoadModule('/src/shared/lib/seo/Seo.jsx'))
})
after(async () => {
  await server.close()
})

const view = (state, extra = {}) =>
  renderToStaticMarkup(
    createElement(MemoryRouter, null, createElement(ReportView, { state, track: noop, pdf: { status: 'idle', onClick: noop }, copied: false, onCopy: noop, onRetry: noop, ...extra })),
  )
const resultState = (response = savedReport()) => ({ phase: 'result', report: parseReportResponse(response), errorCode: '' })

// ---------- парсинг ----------

test('ответ аудита: reportId принимается только в формате base64url, иначе аудит остается успешным без ссылки', () => {
  const body = { status: 'completed', auditId: '11111111-1111-4111-8111-111111111111', audit: savedReport().report.audit }
  assert.equal(parseAuditResponse({ ...body, reportId: REPORT_ID }).reportId, REPORT_ID)
  assert.equal(parseAuditResponse(body).reportId, undefined)
  for (const bad of ['', 'short', 'a'.repeat(40), 'не-латиница-не-латиница!!', 12345, null]) {
    assert.equal(parseAuditResponse({ ...body, reportId: bad }).reportId, undefined)
  }
  assert.equal(parseAuditResponse({ ...body, reportId: REPORT_ID }).status, 'completed')
})

test('parseReportResponse: completed и partial читаются, мусор отклоняется', () => {
  const ok = parseReportResponse(savedReport())
  assert.equal(ok.status, 'completed')
  assert.equal(ok.hostname, 'example.ru')
  assert.equal(ok.audit.summary, 'Итог')
  assert.equal(parseReportResponse(savedReport({ status: 'partial', message: 'x' })).status, 'partial')
  for (const bad of [null, [], {}, { status: 'failed', report: {} }, savedReport({ report: { hostname: 'x', createdAt: 'не дата', audit: {} } }), { status: 'completed', report: { hostname: 'x', createdAt: '2026-10-02T09:00:00Z', audit: { summary: '' } } }]) {
    assert.throws(() => parseReportResponse(bad), (e) => e instanceof AuditError && e.code === 'INVALID_RESPONSE')
  }
})

// ---------- HTTP-клиент ----------

test('getReport: GET без тела и без Content-Type на /api/reports/<id>; аудит (POST /api/audit) не вызывается', async () => {
  const calls = []
  const client = createHttpAuditClient({ baseUrl: API, fetchImpl: async (url, init) => (calls.push({ url, init }), jsonResponse(savedReport())) })
  const report = await client.getReport(REPORT_ID)
  assert.equal(report.hostname, 'example.ru')
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, `${API}/api/reports/${REPORT_ID}`)
  assert.equal(calls[0].init.method, 'GET')
  assert.equal(calls[0].init.body, undefined)
  assert.equal(calls[0].init.headers, undefined)
  assert.equal(calls.some((c) => String(c.url).endsWith('/api/audit')), false)
})

test('getReport: 404 остается REPORT_NOT_FOUND, неверный id не доходит до сети, 429 и сбои различаются', async () => {
  let calls = 0
  const make = (status, body) => createHttpAuditClient({ baseUrl: API, fetchImpl: async () => (calls++, jsonResponse(body, status)) })
  await assert.rejects(make(404, { error: { code: 'REPORT_NOT_FOUND' } }).getReport(REPORT_ID), { code: 'REPORT_NOT_FOUND' })
  await assert.rejects(make(404, {}).getReport(REPORT_ID), { code: 'REPORT_NOT_FOUND' })
  await assert.rejects(make(429, {}).getReport(REPORT_ID), { code: 'RATE_LIMITED' })
  await assert.rejects(make(500, {}).getReport(REPORT_ID), { code: 'REPORT_UNAVAILABLE' })
  const before = calls
  await assert.rejects(make(200, {}).getReport("1'; DROP TABLE"), { code: 'REPORT_NOT_FOUND' })
  assert.equal(calls, before)
  const offline = createHttpAuditClient({ baseUrl: API, fetchImpl: async () => { throw new TypeError('offline') } })
  await assert.rejects(offline.getReport(REPORT_ID), { code: 'NETWORK_ERROR' })
})

test('getReportPdfLink: POST без тела и Content-Type на /api/reports/<id>/pdf-token, auditId нигде не нужен', async () => {
  const calls = []
  const client = createHttpAuditClient({
    baseUrl: API,
    fetchImpl: async (url, init) => (calls.push({ url, init }), jsonResponse({ downloadUrl: `${API}/api/reports/${REPORT_ID}/pdf?token=t`, expiresAt: '2099-01-01T00:00:00Z' })),
  })
  const link = await client.getReportPdfLink(REPORT_ID)
  assert.equal(link.downloadUrl, `${API}/api/reports/${REPORT_ID}/pdf?token=t`)
  assert.equal(calls[0].url, `${API}/api/reports/${REPORT_ID}/pdf-token`)
  assert.equal(calls[0].init.method, 'POST')
  assert.equal(calls[0].init.body, undefined)
  assert.equal(calls[0].init.headers, undefined)
  const failing = createHttpAuditClient({ baseUrl: API, fetchImpl: async () => jsonResponse({}, 500) })
  await assert.rejects(failing.getReportPdfLink(REPORT_ID), { code: 'PDF_FAILED' })
})

test('mock-клиент: известные id открывают примеры, остальные дают "не найдено"; в ответ аудита добавлен reportId', async () => {
  const client = createMockAuditClient({ delayMs: 0 })
  assert.equal((await client.getReport(MOCK_REPORT_ID)).status, 'completed')
  assert.equal((await client.getReport(MOCK_REPORT_PARTIAL_ID)).status, 'partial')
  await assert.rejects(client.getReport('mockreport_unknown_____0000'), { code: 'REPORT_NOT_FOUND' })
  await assert.rejects(client.getReport(MOCK_REPORT_ERROR_ID), { code: 'REPORT_UNAVAILABLE' })
  await assert.rejects(client.getReportPdfLink(MOCK_REPORT_PDF_FAIL_ID), { code: 'PDF_FAILED' })
  assert.equal((await client.getReportPdfLink(MOCK_REPORT_ID)).downloadUrl.startsWith('https://'), true)
  assert.equal((await client.runAudit({ url: 'https://example.ru/' })).reportId, MOCK_REPORT_ID)
  assert.equal((await client.runAudit({ url: 'https://noreport.example.ru/' })).reportId, undefined)
})

// ---------- состояние страницы ----------

test('контроллер: loading -> result; в аналитику идут только хост и статус; аудит не запускается', async () => {
  const events = []
  let auditRuns = 0
  const client = { getReport: async () => parseReportResponse(savedReport()), runAudit: async () => { auditRuns++ } }
  const controller = createReportController({ client, track: (name, params) => events.push([name, params]) })
  assert.equal(controller.getState().phase, 'loading')
  await controller.load(REPORT_ID)
  assert.equal(controller.getState().phase, 'result')
  assert.deepEqual(events, [['audit_report_view', { hostname: 'example.ru', status: 'completed' }]])
  assert.equal(JSON.stringify(events).includes(REPORT_ID), false)
  await controller.load(REPORT_ID) // повторная загрузка того же открытия игнорируется
  assert.equal(events.length, 1)
  assert.equal(auditRuns, 0)
})

test('контроллер: 404 остается 404 и НЕ запускает аудит; сетевой сбой можно повторить (тоже только чтение)', async () => {
  let reads = 0
  let auditRuns = 0
  const notFound = { getReport: async () => { throw new AuditError('REPORT_NOT_FOUND') }, runAudit: async () => { auditRuns++ } }
  const c1 = createReportController({ client: notFound, track: noop })
  await c1.load(REPORT_ID)
  assert.equal(c1.getState().phase, 'notfound')
  await c1.retry(REPORT_ID)
  assert.equal(c1.getState().phase, 'notfound')
  assert.equal(auditRuns, 0)

  const flaky = { getReport: async () => { if (reads++ === 0) throw new AuditError('NETWORK_ERROR'); return parseReportResponse(savedReport()) }, runAudit: async () => { auditRuns++ } }
  const c2 = createReportController({ client: flaky, track: noop })
  await c2.load(REPORT_ID)
  assert.equal(c2.getState().phase, 'error')
  await c2.retry(REPORT_ID)
  assert.equal(c2.getState().phase, 'result')
  assert.equal(auditRuns, 0)
})

test('события страницы отчета: переименованы, очищены, без id отчета и аудита', () => {
  const sent = []
  const track = createReportTrack((name, params) => sent.push([name, sanitizeParams(params)]), { hostname: 'example.ru', status: 'partial' })
  track('audit_telegram_click', { auditId: '11111111-1111-4111-8111-111111111111', intent: 'deeper' })
  track('audit_pdf_click', { auditId: REPORT_ID })
  track('audit_report_link_copy')
  track('audit_result_view', { hostname: 'x' })
  track('audit_copy_message')
  assert.deepEqual(sent, [
    ['audit_report_telegram_click', { hostname: 'example.ru', status: 'partial' }],
    ['audit_report_pdf_click', { hostname: 'example.ru', status: 'partial' }],
    ['audit_report_link_copy', { hostname: 'example.ru', status: 'partial' }],
  ])
  assert.equal(JSON.stringify(sent).includes(REPORT_ID), false)
  assert.deepEqual(sanitizeParams({ reportId: REPORT_ID, hostname: 'example.ru' }), { hostname: 'example.ru' })
})

// ---------- интерфейс ----------

test('загрузка: "Загружаю отчет" с aria-live, без старых этапов проверки', () => {
  const html = view({ phase: 'loading', report: null, errorCode: '' })
  assert.match(html, /role="status" aria-live="polite">Загружаю отчет</)
  for (const stage of ['Открываю страницу', 'Проверяю кнопки', 'Смотрю первый экран', 'Собираю разбор']) assert.equal(html.includes(stage), false)
})

test('404: "Отчет не найден", подсказка и кнопка "Проверить сайт" на /audit; аудит не запускается', () => {
  const html = view({ phase: 'notfound', report: null, errorCode: 'REPORT_NOT_FOUND' })
  assert.match(html, /<h1[^>]*>Отчет не найден<\/h1>/)
  assert.match(html, /Возможно, ссылка указана неверно\./)
  assert.match(html, /<a[^>]*href="\/audit"[^>]*>Проверить сайт<\/a>/)
  assert.match(html, /role="alert"/)
  assert.equal(/Перезапустить|Запустить аудит|Проверяю/.test(html), false)
})

test('completed: шапка, дата, тот же результат, Telegram главный, PDF и копирование вторичны', () => {
  const html = view(resultState())
  assert.match(html, /Аудит сайта/)
  assert.match(html, /<h1[^>]*>example\.ru<\/h1>/)
  assert.match(html, /Проверено 2 октября 2026/)
  assert.equal((html.match(/<h1/g) ?? []).length, 1)
  assert.match(html, /Краткий итог/)
  assert.match(html, /Что исправить в первую очередь/)
  assert.match(html, /Скопировать ссылку</)
  assert.match(html, /Скачать отчет в PDF/)
  assert.match(html, /Написать в Telegram/)
  assert.ok(html.indexOf('Написать в Telegram') < html.indexOf('Скачать отчет в PDF'))
  assert.equal(html.includes(PARTIAL_NOTICE), false)
})

test('Telegram: ссылка на t.me/tigran_front без referrer (rel noreferrer)', () => {
  const html = view(resultState())
  const link = html.match(/<a[^>]*ad-final__btn[^>]*>/)[0]
  assert.match(link, /href="https:\/\/t\.me\/tigran_front\?text=/)
  assert.match(link, /rel="noopener noreferrer"/)
  for (const tag of html.match(/<a [^>]*t\.me[^>]*>/g) ?? []) assert.match(tag, /noreferrer/)
})

test('partial: отчет показан с компактным сообщением, без предложения перезапустить аудит', () => {
  const html = view(resultState(savedReport({ status: 'partial' })))
  assert.ok(html.includes(PARTIAL_NOTICE))
  assert.match(html, /Краткий итог/)
  assert.equal(/перезапус|запустить аудит заново|повторить аудит/i.test(html), false)
})

test('копирование: подтверждение "Ссылка скопирована" в aria-live; кнопка доступна', () => {
  const idle = view(resultState())
  const done = view(resultState(), { copied: true })
  assert.match(idle, /role="status" aria-live="polite"><\/span>/)
  assert.match(done, /role="status" aria-live="polite">Ссылка скопирована</)
  assert.match(done, /<button[^>]*>Скопировать ссылку<\/button>/)
})

test('PDF: состояние загрузки блокирует кнопку; ошибка PDF не трогает отчет', () => {
  const loading = view(resultState(), { pdf: { status: 'loading', onClick: noop } })
  assert.match(loading, /<button[^>]*disabled[^>]*>Готовлю PDF/)
  const failed = view(resultState(), { pdf: { status: 'error', onClick: noop } })
  assert.match(failed, /role="alert"/)
  assert.match(failed, /Краткий итог/)
})

test('ошибка загрузки: можно повторить, отчет не потерян; лимит чтения объясняется', () => {
  const html = view({ phase: 'error', report: null, errorCode: 'NETWORK_ERROR' })
  assert.match(html, /Не удалось загрузить отчет/)
  assert.match(html, /Загрузить еще раз/)
  assert.match(view({ phase: 'error', report: null, errorCode: 'RATE_LIMITED' }), /Слишком много запросов/)
})

// ---------- ссылка и копирование ----------

test('ссылка строится из origin frontend, а не из backend; формат /audit/report/<reportId>', () => {
  assert.equal(reportPath(REPORT_ID), `/audit/report/${REPORT_ID}`)
  assert.equal(buildReportUrl(REPORT_ID, 'https://gabulyan-tigran.ru'), `https://gabulyan-tigran.ru/audit/report/${REPORT_ID}`)
  assert.equal(buildReportUrl(REPORT_ID, 'https://gabulyan-tigran.ru').includes('api.'), false)
})

test('copyText: Clipboard API, запасной вариант и честный false', async () => {
  const written = []
  assert.equal(await copyText('x', { clipboard: { writeText: async (t) => written.push(t) } }), true)
  assert.deepEqual(written, ['x'])
  assert.equal(await copyText('x', { clipboard: { writeText: async () => { throw new Error('denied') } }, doc: undefined }), false)
  const doc = {
    body: { appendChild() {}, removeChild() {} },
    createElement: () => ({ setAttribute() {}, select() {}, style: {} }),
    execCommand: () => true,
  }
  assert.equal(await copyText('x', { clipboard: undefined, doc }), true)
})

test('дата отчета по Москве, по-русски', () => {
  assert.equal(formatReportDate('2026-10-02T09:00:00.000Z'), '2 октября 2026')
  assert.equal(formatReportDate('мусор'), '')
})

// ---------- SEO, приватность, маршрут, mobile ----------

test('noindex, nofollow, noarchive и no-referrer в разметке страницы отчета', () => {
  assert.equal(robotsContent({ noArchive: true }), 'noindex, nofollow, noarchive')
  assert.equal(robotsContent(), 'noindex, nofollow')
  // react-helmet-async v3 на React 19 отдает теги прямо в разметку
  const html = renderToString(createElement(HelmetProvider, {}, createElement(Seo, { title: 'Аудит сайта', path: '/audit', noIndex: true, noArchive: true, noReferrer: true })))
  assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive"\/>/)
  assert.match(html, /<meta name="referrer" content="no-referrer"\/>/)
  assert.match(html, /<link rel="canonical" href="https:\/\/gabulyan-tigran\.ru\/audit"\/>/)
  const page = read('src/pages/report/ui/ReportPage.jsx')
  assert.match(page, /noIndex\s+noArchive\s+noReferrer/)
  assert.match(page, /path="\/audit"/) // в canonical и og:url нет id отчета
})

test('сервер: X-Robots-Tag и Referrer-Policy для /audit/report/*, robots.txt закрывает, sitemap без отчетов', () => {
  const htaccess = read('public/.htaccess')
  assert.match(htaccess, /SetEnvIf Request_URI "\^\/audit\/report\/" REPORT_PAGE/)
  assert.match(htaccess, /X-Robots-Tag "noindex, nofollow, noarchive" env=REPORT_PAGE/)
  assert.match(htaccess, /Referrer-Policy "no-referrer" env=REPORT_PAGE/)
  assert.match(htaccess, /RewriteRule \^ \/index\.html \[L\]/) // SPA fallback остался
  assert.match(read('public/robots.txt'), /Disallow: \/audit\/report\//)
  assert.equal(read('public/sitemap.xml').includes('/audit/report'), false)
})

test('маршрут /audit/report/:reportId подключен; страница отчета не содержит запуска аудита', () => {
  assert.match(read('src/app/App.jsx'), /path="\/audit\/report\/:reportId" element=\{<ReportPage \/>\}/)
  for (const file of ['src/pages/report/ui/ReportPage.jsx', 'src/features/audit/ui/ReportView.jsx', 'src/features/audit/model/useReport.js', 'src/features/audit/model/reportController.js']) {
    const source = code(file)
    assert.equal(/runAudit|\/api\/audit['`"]|createAuditController|useAudit/.test(source), false, file)
  }
})

test('живой результат: кнопка "Скопировать ссылку на отчет" только при наличии reportId, событие без id', () => {
  const page = read('src/pages/audit/ui/AuditPage.jsx')
  assert.match(page, /reportId && <CopyLinkButton label="Скопировать ссылку на отчет"/)
  assert.match(page, /track\('audit_report_link_copy', \{ hostname: state\.hostname, status: state\.response\?\.status \}\)/)
  assert.equal(/audit_report_link_copy[^)]*reportId/.test(page), false)
})

test('mobile 390 px: действия отчета складываются в колонку, кнопки на всю ширину', () => {
  const css = read('src/app/styles/audit.css')
  assert.match(css, /@media \(max-width: 480px\)[\s\S]*\.ad-result__actions \{ flex-direction: column/)
  assert.match(css, /\.ad-skeleton__line/)
  assert.match(css, /prefers-reduced-motion: reduce\) \{ \.ad-skeleton__line \{ animation: none/)
})
