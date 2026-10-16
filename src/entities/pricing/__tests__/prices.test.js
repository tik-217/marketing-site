// Цены на сайте: одни данные для главной и страницы /bankrotstvo, без скидок.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { adsLaunchDays, adsMonthly, packageModules, packages } from '../model/packages.js'

const read = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8')

test('реклама 39 000 ₽ в месяц одним значением для модуля и пакетов', () => {
  assert.equal(adsMonthly, '39 000 ₽')
  assert.equal(packageModules.find((m) => m.id === 'ads').price, '39 000 ₽/мес')
  assert.ok(read('src/entities/pricing/model/modules.js').includes('price: `${adsMonthly} в месяц`'))
})

test('пакеты: цена равна сумме модулей, дальше в месяц по новому списку', () => {
  const expected = {
    direct: ['89 000 ₽', '39 000 ₽'],
    traffic: ['159 000 ₽', '39 000 ₽'],
    system: ['229 000 ₽', '109 000 ₽'],
    launch: ['269 000 ₽', '109 000 ₽'],
  }
  for (const pkg of packages) {
    assert.deepEqual([pkg.price, pkg.monthly], expected[pkg.id], pkg.id)
    assert.equal(pkg.modulesTotal, pkg.price, `${pkg.id}: без скидки`)
  }
})

test('порог бюджета с готовым анализом 39 000 ₽ на главной и на /bankrotstvo, порог без анализа 50 000 ₽', () => {
  for (const file of ['src/widgets/terms/ui/Terms.jsx', 'src/pages/bankrotstvo/ui/BankrotstvoPage.jsx']) {
    const source = read(file)
    assert.ok(source.includes('меньше 50 000 ₽. Если маркетинговый анализ у вас уже есть, порог 39 000 ₽'), file)
  }
})

test('старых цен и слова про скидку нет в данных и страницах', () => {
  const files = [
    'src/entities/pricing/model/packages.js',
    'src/entities/pricing/model/modules.js',
    'src/widgets/terms/ui/Terms.jsx',
    'src/pages/bankrotstvo/ui/BankrotstvoPage.jsx',
    'src/widgets/pricing/ui/Pricing.jsx',
  ]
  for (const file of files) {
    const source = read(file)
    for (const old of ['82 800', '147 200', '211 600', '248 400', '110 000', '8%']) {
      assert.equal(source.includes(old), false, `${file}: ${old}`)
    }
    assert.equal(/скидк/i.test(source), false, `${file}: скидка`)
  }
})

test('сроки пакетов: Директ 20, Трафик 35, Система и Запуск с нуля не менялись, реклама 14', () => {
  const days = Object.fromEntries(packages.map((pkg) => [pkg.id, pkg.duration]))
  assert.deepEqual(days, { direct: 'около 20', traffic: 'около 35', system: 'около 42', launch: 'около 55' })
  assert.equal(adsLaunchDays, 14)
  assert.ok(read('src/entities/pricing/model/modules.js').includes('Срок запуска ${adsLaunchDays} рабочих дней'))
})
