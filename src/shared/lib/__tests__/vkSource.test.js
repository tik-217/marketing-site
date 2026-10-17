import assert from 'node:assert/strict'
import { test } from 'node:test'
import { withVkSuffix } from '../vkSource.js'

test('к тексту сообщения в ссылке t.me дописывается приписка про ВКонтакте один раз', () => {
  const href = 'https://t.me/tigran_front?text=Здравствуйте%2C%20хочу%20разбор%20рекламы%20по%20банкротству'
  const once = withVkSuffix(href)
  assert.equal(
    new URL(once).searchParams.get('text'),
    'Здравствуйте, хочу разбор рекламы по банкротству, увидел рекламу во ВКонтакте',
  )
  assert.equal(withVkSuffix(once), once)
})

test('ссылки без текста и не на t.me не меняются', () => {
  assert.equal(withVkSuffix('https://t.me/tigran_front'), 'https://t.me/tigran_front')
  assert.equal(withVkSuffix('https://example.com/?text=a'), 'https://example.com/?text=a')
})
