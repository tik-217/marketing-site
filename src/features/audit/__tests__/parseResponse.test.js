import assert from 'node:assert/strict'
import { test } from 'node:test'
import { errorFromResponse, parseAuditResponse } from '../api/parseResponse.js'
import { completedAudit, partialAudit } from '../api/fixtures.js'

test('корректный ответ проходит как есть', () => {
  const parsed = parseAuditResponse(completedAudit)
  assert.equal(parsed.status, 'completed')
  assert.equal(parsed.audit.problems.length, 3)
  assert.equal(parsed.audit.problems[0].suggestedText !== undefined, true)
  assert.equal('currentText' in parsed.audit.problems[2], false)
})

test('partial сохраняет статус', () => {
  assert.equal(parseAuditResponse(partialAudit).status, 'partial')
})

test('неожиданная структура превращается в безопасную ошибку', () => {
  for (const bad of [null, 'text', [], {}, { status: 'completed' }, { status: 'weird', audit: {} }, { status: 'completed', audit: { summary: '' } }]) {
    assert.throws(() => parseAuditResponse(bad), { code: 'INVALID_RESPONSE' })
  }
})

test('мусор в массивах отбрасывается, отсутствующие массивы становятся пустыми', () => {
  const parsed = parseAuditResponse({
    status: 'completed',
    audit: {
      summary: 'ok',
      priorityActions: [{ area: 'a' }, { area: 'b', action: 'c' }, 5],
      problems: [{ title: 't' }, null],
      secondaryNotes: ['x', 3, ''],
    },
  })
  assert.deepEqual(parsed.audit.priorityActions, [{ area: 'b', action: 'c' }])
  assert.deepEqual(parsed.audit.problems, [])
  assert.deepEqual(parsed.audit.secondaryNotes, ['x'])
  assert.deepEqual(parsed.audit.mobileNotes, [])
  assert.deepEqual(parsed.audit.strengths, [])
})

test('коды ошибок: из тела и по HTTP-статусу', () => {
  assert.equal(errorFromResponse(500, { error: { code: 'RATE_LIMITED', message: 'x' } }).code, 'RATE_LIMITED')
  assert.equal(errorFromResponse(429, undefined).code, 'RATE_LIMITED')
  assert.equal(errorFromResponse(400, {}).code, 'INVALID_URL')
  assert.equal(errorFromResponse(503, null).code, 'AUDIT_BUSY')
  assert.equal(errorFromResponse(500, { error: { code: 'SOMETHING_ELSE' } }).code, 'AUDIT_TEMPORARILY_UNAVAILABLE')
})
