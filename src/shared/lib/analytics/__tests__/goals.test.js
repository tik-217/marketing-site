import assert from 'node:assert/strict'
import { test } from 'node:test'
import { goalsForLink, reachGoal } from '../goals.js'

const link = (attrs) => ({ getAttribute: (name) => attrs[name] ?? null })

test('ссылка на форму не считается кликом в Telegram: событие отправляется после открытия окна', () => {
  assert.deepEqual(goalsForLink(link({ href: '/#razbor', 'data-cta': 'hero' })), [])
})

test('ссылка tel: phone_click без параметров', () => {
  assert.deepEqual(goalsForLink(link({ href: 'tel:+79180220901' })), [{ name: 'phone_click' }])
})

test('обычные ссылки и ссылка Telegram без data-cta целей не дают', () => {
  assert.deepEqual(goalsForLink(link({ href: '/cases' })), [])
  assert.deepEqual(goalsForLink(link({ href: 'https://t.me/tigran_front' })), [])
  assert.deepEqual(goalsForLink(null), [])
})

test('reachGoal: ym(112916010, "reachGoal", имя, параметры) и без параметров, не падает без ym', () => {
  const calls = []
  globalThis.ym = (...args) => calls.push(args)
  reachGoal('form_open', { block: 'faq' })
  reachGoal('phone_click')
  reachGoal('form_submit')
  assert.deepEqual(calls, [
    [112916010, 'reachGoal', 'form_open', { block: 'faq' }],
    [112916010, 'reachGoal', 'phone_click'],
    [112916010, 'reachGoal', 'form_submit'],
  ])
  delete globalThis.ym
  assert.doesNotThrow(() => reachGoal('form_submit'))
})
