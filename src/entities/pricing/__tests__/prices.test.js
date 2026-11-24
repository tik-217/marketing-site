import assert from 'node:assert/strict'
import { test } from 'node:test'
import { homeTariffs } from '../model/tariffs.js'

test('тарифы: названия, цены и сроки для обеих страниц', () => {
  assert.deepEqual(homeTariffs.map(({ id, name, price, term }) => ({ id, name, price, term })), [
    { id: 'ads', name: 'Реклама в Яндекс Директе', price: '30 000 ₽/мес', term: 'Запуск примерно через 20 рабочих дней' },
    { id: 'site', name: 'Сайт', price: '70 000 ₽', term: 'Готовность примерно через 38 рабочих дней' },
    { id: 'site-ads', name: 'Сайт и реклама', price: '100 000 ₽', term: 'Запуск примерно через 38 рабочих дней' },
  ])
})

test('у каждого тарифа есть состав без пустых пунктов', () => {
  for (const tariff of homeTariffs) {
    assert.ok(tariff.items.length > 0, tariff.name)
    assert.ok(tariff.items.every((item) => item.trim().length > 0), tariff.name)
  }
})
