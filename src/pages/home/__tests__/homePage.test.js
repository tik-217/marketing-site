// Проверки основных страниц, ссылок и актуальных предложений.
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import { homeTariffs } from '../../../entities/pricing/model/tariffs.js'

let server
let render

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  ;({ render } = await server.ssrLoadModule('/src/entry-server.jsx'))
})

after(async () => { await server.close() })

const text = (url) => render(url)
  .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;| /g, ' ')
  .replace(/\s+/g, ' ')

const count = (haystack, needle) => haystack.split(needle).length - 1

test('главная: предложение и кнопка плана рекламы на первом экране', () => {
  const html = render('/')
  const page = text('/')
  assert.ok(page.includes('Приведу вашей юридической фирме клиентов, которые уже ищут юриста в Яндексе'))
  assert.ok(page.includes('Получить бесплатный разбор'))
  assert.ok(page.includes('Бесплатно. Оставьте номер телефона'))
  assert.ok(html.includes('data-cta="hero"'))
  assert.ok(html.includes('href="/#razbor"'))
})

test('строка доверия соответствует странице', () => {
  for (const url of ['/', '/bankrotstvo']) {
    const page = render(url)
    for (const part of ['hero-trust', '5,0', 'Юрист', 'Сбер', 'href="#reviews"']) {
      assert.ok(page.includes(part), `${url}: ${part}`)
    }
  }
  assert.ok(text('/bankrotstvo').includes('Получить бесплатный разбор'))
})

test('карточки кейсов показывают результаты и ведут на страницы', () => {
  const html = render('/')
  const page = text('/')
  assert.ok(page.includes('3 клиента с общей выручкой более 3 млн ₽'))
  assert.ok(page.includes('5 типов клиентских запросов для будущей рекламы'))
  assert.equal(count(page, 'Читать подробнее'), 2)
  for (const slug of ['legalizaciya-kommercheskih-obektov', 'bankrotstvo-fizicheskih-lic']) {
    assert.ok(html.includes(`href="/cases/${slug}"`), slug)
  }
  assert.ok(page.includes('Анализ аудитории, конкурентов и торгового предложения за 14 рабочих дней'))
  assert.ok(text('/bankrotstvo').includes('5 типов клиентских запросов для будущей рекламы'))
})

test('на главной и /bankrotstvo нет ссылок на автоматический аудит', () => {
  for (const url of ['/', '/bankrotstvo']) {
    assert.equal(render(url).includes('href="/audit"'), false, url)
    assert.equal(text(url).includes('Автоматический разбор'), false, url)
  }
})

test.skip('тарифы на главной и /bankrotstvo соответствуют общим данным', () => {
  const home = text('/')
  for (const tariff of homeTariffs) {
    assert.ok(home.includes(tariff.name), tariff.name)
    assert.ok(home.includes(tariff.price), tariff.price)
  }
  const html = render('/bankrotstvo')
  const page = text('/bankrotstvo')
  assert.equal(count(html, 'class="tariff__name"'), 3)
  for (const tariff of homeTariffs) {
    for (const value of [tariff.name, tariff.price, tariff.term, ...tariff.items]) {
      assert.ok(page.includes(value), value)
    }
  }
  assert.ok(page.includes('Получить бесплатный разбор\n'))
})

test('логотипы ведут на главную, а из каталога шапка ведет к банкротствам', () => {
  const brands = (url) => render(url).match(/<a[^>]*site-(header|footer)__brand[^>]*>/g).map((a) => a.match(/href="([^"]*)"/)[1])
  assert.deepEqual(brands('/'), ['/', '/'])
  assert.deepEqual(brands('/bankrotstvo'), ['/bankrotstvo', '/'])
})

test('в нижнем блоке нет предложения про 5 разборов в неделю', () => {
  for (const url of ['/', '/bankrotstvo']) assert.equal(text(url).includes('5 разборов'), false, url)
})

test('на публичных страницах нет ссылок на Telegram и Instagram', () => {
  for (const url of ['/', '/bankrotstvo', '/cases', '/privacy', '/audit']) {
    assert.doesNotMatch(render(url), /href="https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|instagram\.com)/i, url)
  }
})

test('в кейсе о легализации нет изображений, а в кейсе о банкротстве они сохранены', () => {
  const legal = render('/cases/legalizaciya-kommercheskih-obektov')
  const bankruptcy = render('/cases/bankrotstvo-fizicheskih-lic')
  assert.doesNotMatch(legal, /<img\b/)
  assert.match(legal, /Реклама видна только тем, кто ищет услугу/)
  assert.match(bankruptcy, /<img\b/)
})

test('возврат из кейса учитывает страницу банкротства', () => {
  const bank = render('/bankrotstvo')
  const slug = 'legalizaciya-kommercheskih-obektov'
  assert.ok(bank.includes(`href="/cases/${slug}?from=bankrotstvo"`))
  assert.match(render(`/cases/${slug}`), /href="\/cases"[^>]*>.*?Все кейсы/)
})
