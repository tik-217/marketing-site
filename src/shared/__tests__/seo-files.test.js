// Проверки файлов для поисковиков: sitemap, описание, JSON-LD и подключение пререндера к сборке.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (path) => readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8')

test('sitemap: главная, аудит, кейсы и две страницы кейсов, без отчетов', () => {
  const sitemap = read('public/sitemap.xml')
  for (const path of ['/', '/audit', '/cases', '/cases/legalizaciya-kommercheskih-obektov', '/cases/bankrotstvo-fizicheskih-lic']) {
    assert.ok(sitemap.includes(`<loc>https://gabulyan-tigran.ru${path}</loc>`), path)
  }
  assert.equal(sitemap.includes('/audit/report'), false)
})

test('meta description сайта', () => {
  assert.ok(
    read('src/shared/config/site.js').includes(
      'Маркетинг для юридических фирм: анализ ниши, сайт и Яндекс Директ одним исполнителем. Первые заявки за месяц, кабинет и сайт остаются у вас',
    ),
  )
})

test('JSON-LD ProfessionalService на главной', () => {
  const home = read('src/pages/home/ui/HomePage.jsx')
  assert.ok(home.includes("'@type': 'ProfessionalService'"))
  assert.ok(home.includes("name: 'Габулян Тигран'"))
  assert.ok(home.includes("telephone: '+7 918 022-09-01'"))
  assert.ok(home.includes("addressLocality: 'Анапа'"))
  assert.ok(home.includes("areaServed: 'RU'"))
  assert.ok(home.includes('sameAs: [contacts.telegramUrl, contacts.instagramUrl]'))
})

test('сборка запускает серверную сборку и пререндер', () => {
  const { scripts } = JSON.parse(read('package.json'))
  assert.ok(scripts.build.includes('--ssr src/entry-server.jsx'))
  assert.ok(scripts.build.includes('scripts/prerender.mjs'))
})
