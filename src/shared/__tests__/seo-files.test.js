// Проверки файлов для поисковиков: sitemap, описание, JSON-LD и подключение пререндера к сборке.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (path) => readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8')

test('sitemap: главная, страница по банкротству, кейсы и две страницы кейсов, без /audit и отчетов', () => {
  const sitemap = read('public/sitemap.xml')
  for (const path of ['/', '/bankrotstvo', '/cases', '/cases/legalizaciya-kommercheskih-obektov', '/cases/bankrotstvo-fizicheskih-lic']) {
    assert.ok(sitemap.includes(`<loc>https://gabulyan-tigran.ru${path}</loc>`), path)
  }
  assert.equal(sitemap.includes('/audit'), false)
  assert.equal((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length, 5)
})

test('meta description главной и страниц кейсов', () => {
  assert.ok(
    read('src/shared/config/site.js').includes(
      'Маркетинг для юридических фирм. Приведу клиентов, которые уже ищут юриста в Яндексе. Разбор ниши, сайт и Яндекс Директ одним исполнителем',
    ),
  )
  assert.ok(read('src/pages/home/ui/HomePage.jsx').includes('description={siteConfig.homeDescription}'))
  const cases = read('src/entities/case/model/cases.js')
  assert.ok(cases.includes("seoDescription: 'Как маркетинг юридической услуги привел 3 клиентов с общей выручкой более 3 млн ₽'"))
  assert.ok(cases.includes("seoDescription: '5 поводов, с которыми к юристу по банкротству приходят клиенты'"))
})

test('JSON-LD ProfessionalService на главной', () => {
  const home = read('src/shared/config/jsonld.js')
  assert.ok(home.includes("'@type': 'ProfessionalService'"))
  assert.ok(home.includes("name: 'Габулян Тигран'"))
  assert.ok(home.includes("telephone: '+79180220901'"))
  assert.ok(home.includes("addressLocality: 'Анапа', addressCountry: 'RU'"))
  assert.ok(home.includes("areaServed: 'RU'"))
  assert.ok(home.includes("description: 'Маркетинг для юридических фирм: анализ ниши, сайт и Яндекс Директ'"))
  assert.equal(home.includes('sameAs:'), false)
})

test('сборка запускает серверную сборку и пререндер', () => {
  const { scripts } = JSON.parse(read('package.json'))
  assert.ok(scripts.build.includes('--ssr src/entry-server.jsx'))
  assert.ok(scripts.build.includes('scripts/prerender.mjs'))
})
