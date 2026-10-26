// Цены на сайте: одни данные для главной и страницы /bankrotstvo, без скидок.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { adsLaunchDays, adsMonthly, bankruptcyTariffs, homeTariffs } from '../model/tariffs.js'

const read = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8')
const plain = (text) => String(text).replace(/ /g, ' ')
const byId = (list) => Object.fromEntries(list.map((item) => [item.id, item]))

test('реклама 39 000 ₽ в месяц одним значением на главной и на /bankrotstvo', () => {
  assert.equal(plain(adsMonthly), '39 000 ₽')
  assert.equal(homeTariffs[0].price, adsMonthly)
  assert.equal(bankruptcyTariffs[0].price, adsMonthly)
  assert.equal(plain(homeTariffs[0].note), 'в месяц')
  assert.equal(plain(bankruptcyTariffs[0].note), 'в месяц')
})

test('главная: три тарифа, цены и сроки', () => {
  const home = byId(homeTariffs)
  assert.deepEqual(Object.keys(home), ['direct', 'site', 'site-ads'])
  assert.deepEqual(
    homeTariffs.map((t) => [plain(t.name), plain(t.price), plain(t.term)]),
    [
      ['Реклама в Яндекс Директе', '39 000 ₽', `Запуск примерно через ${adsLaunchDays} рабочих дней`],
      ['Сайт', '70 000 ₽', 'Готовность примерно через 38 рабочих дней'],
      ['Сайт и реклама', '109 000 ₽', 'Запуск примерно через 38 рабочих дней'],
    ],
  )
  assert.equal(home.site.note, undefined)
  assert.equal(plain(home['site-ads'].note), 'первый месяц рекламы включен, дальше 39 000 ₽ в месяц')
  assert.equal(homeTariffs.some((t) => t.recommended), false)
})

test('/bankrotstvo: два тарифа, рекомендуемый первый', () => {
  assert.deepEqual(
    bankruptcyTariffs.map((t) => [plain(t.name), plain(t.price), plain(t.term), Boolean(t.recommended)]),
    [
      ['Реклама', '39 000 ₽', 'Запуск примерно через 20 рабочих дней', true],
      ['Лендинг и реклама', '109 000 ₽', 'Запуск примерно через 35 рабочих дней', false],
    ],
  )
  assert.ok(bankruptcyTariffs[0].items.map(plain).includes('Отчеты каждую неделю'))
})

test('старых цен, порогов бюджета и слова про скидку нет в данных и страницах', () => {
  const files = [
    'src/entities/pricing/model/tariffs.js',
    'src/pages/bankrotstvo/ui/BankrotstvoPage.jsx',
    'src/widgets/pricing/ui/Pricing.jsx',
  ]
  for (const file of files) {
    const source = plain(read(file))
    for (const old of ['89 000', '120 000', '159 000', '229 000', '269 000', '50 000', 'Ежедневные отчеты']) {
      assert.equal(source.includes(old), false, `${file}: ${old}`)
    }
    assert.equal(/скидк/i.test(source), false, `${file}: скидка`)
  }
})
