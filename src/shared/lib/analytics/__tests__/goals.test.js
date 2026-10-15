import assert from 'node:assert/strict'
import { test } from 'node:test'
import { goalsForLink, reachGoal } from '../goals.js'

const link = (attrs) => ({ getAttribute: (name) => attrs[name] ?? null })

test('ссылка на бота: bot_click', () => {
  assert.deepEqual(goalsForLink(link({ href: 'https://t.me/tigran_audit_bot?start=s-hero' })), ['bot_click'])
})

test('ссылка tel: phone_click', () => {
  assert.deepEqual(goalsForLink(link({ href: 'tel:+79180220901' })), ['phone_click'])
})

test('кнопка нижней панели: bot_click и sticky_click отдельно', () => {
  assert.deepEqual(
    goalsForLink(link({ href: 'https://t.me/tigran_audit_bot?start=s-sticky', 'data-goal': 'sticky_click' })),
    ['bot_click', 'sticky_click'],
  )
})

test('обычные ссылки целей не дают', () => {
  assert.deepEqual(goalsForLink(link({ href: '/cases' })), [])
  assert.deepEqual(goalsForLink(null), [])
})

test('reachGoal вызывает ym с номером счетчика и не падает без ym', () => {
  const calls = []
  globalThis.ym = (...args) => calls.push(args)
  reachGoal('form_submit')
  assert.deepEqual(calls, [[112916010, 'reachGoal', 'form_submit']])
  delete globalThis.ym
  assert.doesNotThrow(() => reachGoal('form_submit'))
})
