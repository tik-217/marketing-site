// Главная и /bankrotstvo после перехода на разбор конкурентов: кнопки, строка доверия, карточки кейсов, старые тексты.
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let render

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  ;({ render } = await server.ssrLoadModule('/src/entry-server.jsx'))
})

after(async () => {
  await server.close()
})

// Текст без тегов, неразрывные пробелы как обычные.
const text = (url) =>
  render(url)
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;| /g, ' ')
    .replace(/\s+/g, ' ')

const count = (haystack, needle) => haystack.split(needle).length - 1

test('главная: кнопка "Получить разбор конкурентов" на первом экране и после кейсов, плюс панель на телефоне', () => {
  const html = render('/')
  const page = text('/')
  assert.ok(page.includes('Приведу вашей юридической фирме клиентов, которые уже ищут юриста в Яндексе'))
  assert.ok(page.includes('Бесплатно. Выберите практику и город, разбор пришлю в Telegram в тот же день'))
  // первый экран, после кейсов, нижняя панель, кнопка формы
  assert.equal(count(page, 'Получить разбор конкурентов'), 4)
  assert.equal(count(html, 'class="btn site-footer__cta'), 0)
  assert.ok(html.includes('id="razbor"'))
  assert.ok(html.includes('href="https://t.me/tigran_front?text=Здравствуйте%2C%20хочу%20разбор%20конкурентов"'))
})

test('строка доверия: оценка ведет на отзывы на этой же странице', () => {
  for (const url of ['/', '/bankrotstvo']) {
    const html = render(url)
    assert.match(html, /<a href="#reviews" class="hero-trust__caption hero-trust__link">/, url)
    assert.ok(html.includes('id="reviews"'), url)
    const page = text(url)
    for (const part of ['5,0', 'оценка на Профи.ру', 'Юрист', 'по образованию', 'Сбер', 'в прошлом разработчик']) {
      assert.ok(page.includes(part), `${url}: ${part}`)
    }
  }
})

test('карточки кейсов: превью, ниша, заголовок и "Читать подробнее", без статусов и тегов', () => {
  const page = text('/')
  assert.ok(page.includes('Реклама новой услуги окупилась минимум в 11 раз и продолжает приносить заявки'))
  assert.ok(page.includes('5 поводов, с которыми к юристу по банкротству приходят клиенты'))
  assert.equal(count(page, 'Читать подробнее'), 2)
  for (const old of ['В работе', 'Завершен', 'Анализ и Директ', 'Маркетинговый анализ']) {
    assert.equal(page.includes(old), false, old)
  }
  assert.ok(text('/bankrotstvo').includes('Другая ниша, тот же метод. Реклама окупилась минимум в 11 раз и продолжает приносить заявки'))
})

test('на главной и /bankrotstvo нет старых текстов и ссылок на автоматический аудит', () => {
  const forbidden = [
    'первые заявки',
    'Первая заявка',
    'первая заявка',
    'первой заявки',
    'Не обещаю',
    'Не гарантирую',
    'Не возьмусь',
    'Получить разбор сайта',
    'Telegram-боте',
    'Разбор точек роста',
    'Ежедневные отчеты',
    'после доступов',
    'Полгода практики',
    'Четыре года юридического',
    'из пяти',
    'Аудит сайта',
    'за 30 секунд',
    'Автоматический разбор',
    'Настройка Яндекс.Директ',
    'две недели через подрядчика',
    '89 000',
    '120 000',
    '159 000',
    '50 000',
  ]
  for (const url of ['/', '/bankrotstvo']) {
    const page = text(url)
    for (const old of forbidden) assert.equal(page.includes(old), false, `${url}: ${old}`)
    assert.equal(render(url).includes('href="/audit"'), false, `${url}: ссылка на /audit`)
  }
  const home = text('/')
  for (const old of ['План рекламы', 'план рекламы', 'посчитаю сам', 'План пришлю', 'Сколько это стоит']) {
    assert.equal(home.includes(old), false, `/: ${old}`)
  }
})

test('/bankrotstvo: разбор конкурентов вместо плана рекламы, два тарифа', () => {
  const html = render('/bankrotstvo')
  const page = text('/bankrotstvo')
  // первый экран, ситуации, тарифы, шаги, кнопка формы
  assert.equal(count(page, 'Получить разбор конкурентов'), 5)
  assert.equal(count(html, 'class="btn site-footer__cta'), 0)
  assert.ok(html.includes('href="https://t.me/tigran_front?text=Здравствуйте%2C%20хочу%20разбор%20конкурентов%20по%20банкротству.%20Мой%20город%20"'))
  assert.ok(page.includes('Бесплатно. Напишите свой город, разбор пришлю в Telegram в тот же день'))
  assert.ok(page.includes('Покажу, что обещают ваши конкуренты по банкротству в Яндексе'))
  for (const old of ['План рекламы', 'план рекламы', 'посчитаю сам', 'План пришлю', 'План бесплатный', 'Или позвоните']) {
    assert.equal(page.includes(old), false, old)
  }
  assert.equal(count(html, 'class="tariff__name"'), 2)
  assert.ok(page.includes('Реклама Рекомендую 39 000 ₽ в месяц'))
  assert.ok(page.includes('Лендинг и реклама 109 000 ₽ первый месяц рекламы включен, дальше 39 000 ₽ в месяц'))
  assert.ok(page.includes('Как строится ваш канал заявок по банкротству'))
})

test('логотип в шапке и подвале ведет на главную своей страницы', () => {
  const brands = (url) => render(url).match(/<a[^>]*site-(header|footer)__brand[^>]*>/g).map((a) => a.match(/href="([^"]*)"/)[1])
  assert.deepEqual(brands('/'), ['/', '/'])
  assert.deepEqual(brands('/bankrotstvo'), ['/bankrotstvo', '/bankrotstvo'])
  assert.deepEqual(brands('/cases'), ['/#cases', '/'])
})

test('в нижнем блоке нет предложения про 5 разборов в неделю', () => {
  for (const url of ['/', '/bankrotstvo']) assert.equal(text(url).includes('5 разборов'), false, url)
})
