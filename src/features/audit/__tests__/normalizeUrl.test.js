import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeUrl } from '../lib/normalizeUrl.js'

test('пустой ввод и пробелы', () => {
  assert.deepEqual(normalizeUrl(''), { ok: false, reason: 'empty' })
  assert.deepEqual(normalizeUrl('    '), { ok: false, reason: 'empty' })
  assert.deepEqual(normalizeUrl(undefined), { ok: false, reason: 'empty' })
})

test('домен без протокола получает https', () => {
  const result = normalizeUrl('example.ru')
  assert.equal(result.ok, true)
  assert.equal(result.url, 'https://example.ru/')
  assert.equal(result.hostname, 'example.ru')
})

test('http и https сохраняются, пробелы по краям убираются', () => {
  assert.equal(normalizeUrl('  http://example.ru/page  ').url, 'http://example.ru/page')
  assert.equal(normalizeUrl('https://www.Example.ru/a?b=1#top').url, 'https://www.example.ru/a?b=1')
})

test('hostname для показа: без www, схемы, пути и query', () => {
  assert.equal(normalizeUrl('https://www.gabulyan-tigran.ru/cases?x=1').hostname, 'gabulyan-tigran.ru')
})

test('кириллический домен принимается', () => {
  const result = normalizeUrl('юрист-про.рф')
  assert.equal(result.ok, true)
  assert.equal(result.hostname, 'юрист-про.рф')
})

test('невалидные адреса отклоняются', () => {
  for (const bad of [
    'not a url',
    'example',
    'localhost',
    '127.0.0.1',
    'http://192.168.0.1',
    'ftp://example.ru',
    'javascript:alert(1)',
    'mailto:a@b.ru',
    'https://user:pass@example.ru',
    'http://',
    'https://exa mple.ru',
    '.ru',
  ]) {
    assert.deepEqual(normalizeUrl(bad), { ok: false, reason: 'invalid' }, bad)
  }
})
