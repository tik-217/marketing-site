// Адрес страницы после аудита: /audit → /audit/report/:reportId без перезагрузки, второго POST и GET отчета.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { createMockAuditClient, MOCK_REPORT_ID, MOCK_REPORT_PARTIAL_ID } from '../api/mockAuditClient.js'
import { buildReportUrl, reportPath } from '../lib/reportLink.js'
import { assignReportUrl, createReportUrlSync, restoreAuditUrl } from '../lib/reportUrl.js'
import { createAuditController } from '../model/controller.js'
import { createReportController } from '../model/reportController.js'
import { sanitizeParams } from '../../../shared/lib/analytics/track.js'

const ORIGIN = 'https://gabulyan-tigran.ru'

/** Минимальная замена window.history/location: фиксирует replaceState и ловит pushState. */
function fakeBrowser(path = '/audit') {
  const url = new URL(path, ORIGIN)
  const location = { origin: ORIGIN, pathname: url.pathname, search: url.search }
  const log = { replace: [], push: 0 }
  const routerState = { usr: null, key: 'default', idx: 3 }
  const history = {
    state: routerState,
    replaceState(state, _title, target) {
      log.replace.push([state, target])
      const next = new URL(target, ORIGIN)
      location.pathname = next.pathname
      location.search = next.search
    },
    pushState() {
      log.push += 1
    },
  }
  return { history, location, log, routerState }
}

function setup(path) {
  const browser = fakeBrowser(path)
  const events = []
  const track = (name, params) => events.push([name, params])
  const calls = { runAudit: 0, getReport: 0 }
  const mock = createMockAuditClient({ delayMs: 0 })
  const client = {
    ...mock,
    runAudit: (input) => {
      calls.runAudit += 1
      return mock.runAudit(input)
    },
    getReport: (id) => {
      calls.getReport += 1
      return mock.getReport(id)
    },
  }
  const controller = createAuditController({ client, track, attribution: {} })
  const urlSync = createReportUrlSync({ track, history: browser.history, location: browser.location })
  const sync = () => urlSync.sync(controller.getState())
  return { ...browser, events, calls, controller, urlSync, sync }
}

test('completed + reportId: адрес заменен на /audit/report/:reportId через replaceState, без push и без перезагрузки', async () => {
  const t = setup('/audit?utm_source=threads')
  await t.controller.submit('example.ru')
  const { reportId, status } = t.controller.getState().response
  assert.equal(reportId, MOCK_REPORT_ID)
  assert.equal(status, 'completed')

  assert.equal(t.sync(), true)
  assert.equal(t.location.pathname, `/audit/report/${MOCK_REPORT_ID}`)
  assert.equal(t.location.search, '')
  assert.equal(t.log.replace.length, 1)
  assert.equal(t.log.push, 0)
  // внутреннее состояние роутера сохраняется, иначе "Вперед" и обновление ломаются
  assert.equal(t.log.replace[0][0], t.routerState)
})

test('partial + reportId: адрес тоже заменен', async () => {
  const t = setup()
  await t.controller.submit('partial.example.ru')
  assert.equal(t.controller.getState().response.status, 'partial')
  assert.equal(t.controller.getState().response.reportId, MOCK_REPORT_PARTIAL_ID)
  assert.equal(t.sync(), true)
  assert.equal(t.location.pathname, `/audit/report/${MOCK_REPORT_PARTIAL_ID}`)
  assert.deepEqual(t.events.at(-1), ['audit_report_url_assigned', { hostname: 'partial.example.ru', status: 'partial' }])
})

test('completed без reportId: адрес остается /audit, событий нет', async () => {
  const t = setup('/audit')
  await t.controller.submit('noreport.example.ru')
  assert.equal(t.controller.getState().phase, 'result')
  assert.equal(t.controller.getState().response.reportId, undefined)
  assert.equal(t.sync(), false)
  assert.equal(t.location.pathname, '/audit')
  assert.equal(t.log.replace.length, 0)
  assert.equal(t.events.some(([name]) => name === 'audit_report_url_assigned'), false)
})

test('замена адреса не запускает второй POST /api/audit и не делает GET отчета', async () => {
  const t = setup()
  await t.controller.submit('example.ru')
  assert.equal(t.calls.runAudit, 1)
  t.sync()
  t.sync()
  t.sync()
  assert.equal(t.calls.runAudit, 1)
  assert.equal(t.calls.getReport, 0)
})

test('повторная синхронизация того же результата не дублирует replaceState и событие', async () => {
  const t = setup()
  await t.controller.submit('example.ru')
  t.sync()
  t.sync()
  assert.equal(t.log.replace.length, 1)
  assert.equal(t.events.filter(([name]) => name === 'audit_report_url_assigned').length, 1)
  assert.equal(t.urlSync.getAssigned(), true)
})

test('"Скопировать ссылку" копирует именно текущий постоянный адрес', async () => {
  const t = setup()
  await t.controller.submit('example.ru')
  t.sync()
  const { reportId } = t.controller.getState().response
  assert.equal(buildReportUrl(reportId, t.location.origin), `${t.location.origin}${t.location.pathname}`)
  assert.equal(buildReportUrl(reportId, t.location.origin), `${ORIGIN}${reportPath(MOCK_REPORT_ID)}`)
})

test('reportId не попадает в аналитику', async () => {
  const t = setup()
  await t.controller.submit('example.ru')
  t.sync()
  assert.ok(t.events.length > 0)
  const dump = JSON.stringify(t.events)
  assert.equal(dump.includes(MOCK_REPORT_ID), false)
  for (const [, params] of t.events) {
    assert.equal(JSON.stringify(sanitizeParams(params)).includes(MOCK_REPORT_ID), false)
    assert.equal('reportId' in params, false)
  }
  const assigned = t.events.find(([name]) => name === 'audit_report_url_assigned')
  assert.deepEqual(Object.keys(assigned[1]).sort(), ['hostname', 'status'])
})

test('"Проверить другую страницу" возвращает адрес /audit, а на обычном /audit ничего не трогает', async () => {
  const t = setup()
  await t.controller.submit('example.ru')
  t.sync()
  t.urlSync.reset()
  assert.equal(t.location.pathname, '/audit')
  assert.equal(t.urlSync.getAssigned(), false)
  assert.equal(t.log.replace.length, 2)

  const plain = fakeBrowser('/audit')
  restoreAuditUrl({ history: plain.history, location: plain.location })
  assert.equal(plain.log.replace.length, 0)
})

test('новый результат после возврата получает новый адрес', async () => {
  const t = setup()
  await t.controller.submit('example.ru')
  t.sync()
  t.urlSync.reset()
  t.controller.newSite()
  await t.controller.submit('partial.example.ru')
  assert.equal(t.sync(), true)
  assert.equal(t.location.pathname, `/audit/report/${MOCK_REPORT_PARTIAL_ID}`)
  assert.equal(t.calls.runAudit, 2)
})

test('если history недоступна, страница остается на /audit и показывает запасную ссылку', async () => {
  const location = { origin: ORIGIN, pathname: '/audit', search: '' }
  const broken = { state: null, replaceState() { throw new Error('SecurityError') } }
  assert.equal(assignReportUrl(MOCK_REPORT_ID, { history: broken, location }), false)

  const events = []
  const urlSync = createReportUrlSync({ track: (name, params) => events.push([name, params]), history: broken, location })
  const controller = createAuditController({ client: createMockAuditClient({ delayMs: 0 }), track: () => {}, attribution: {} })
  await controller.submit('example.ru')
  assert.equal(urlSync.sync(controller.getState()), false)
  assert.equal(urlSync.getAssigned(), false)
  assert.equal(events.length, 0)

  const page = readFileSync(new URL('../../../pages/audit/ui/AuditPage.jsx', import.meta.url), 'utf8')
  assert.match(page, /reportId && !urlAssigned/)
  assert.match(page, /Открыть постоянный отчет/)
})

test('адрес /audit/report/:id после замены не содержит ?url=, поэтому обновление и "Назад" не запускают аудит', async () => {
  const t = setup('/audit?url=example.ru&utm_source=x')
  await t.controller.submit('example.ru')
  t.sync()
  assert.equal(new URLSearchParams(t.location.search).has('url'), false)
  assert.equal(t.calls.runAudit, 1)
})

test('обновление на /audit/report/:id загружает сохраненный отчет существующим GET и не запускает аудит', async () => {
  const getCalls = []
  const client = {
    getReport: (id) => {
      getCalls.push(id)
      return createMockAuditClient({ delayMs: 0 }).getReport(id)
    },
    runAudit: () => assert.fail('страница отчета не должна запускать аудит'),
  }
  const controller = createReportController({ client, track: () => {} })
  await controller.load(MOCK_REPORT_ID)
  assert.equal(controller.getState().phase, 'result')
  assert.deepEqual(getCalls, [MOCK_REPORT_ID])
})
