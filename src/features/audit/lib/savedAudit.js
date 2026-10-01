const TTL_MS = 24 * 60 * 60 * 1000
const MAX_ENTRIES = 5

const keyFor = (mode) => `audit:saved:${mode}`

function safeLocal() {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

/** Ключ страницы без query и hash: https://www.Example.ru/a/?x=1 → example.ru/a */
export function savedKey(url) {
  try {
    const parsed = new URL(url)
    const path = parsed.pathname.replace(/\/+$/, '')
    return `${parsed.hostname.replace(/^www\./, '').toLowerCase()}${path}`
  } catch {
    return ''
  }
}

function readAll(mode, storage) {
  try {
    const list = JSON.parse(storage?.getItem(keyFor(mode)) ?? '[]')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

/**
 * Разбор хранится только в браузере пользователя и только сутки. Нужен, чтобы при исчерпанном лимите
 * показать уже полученный разбор той же страницы.
 */
export function saveAudit(mode, url, response, { storage = safeLocal(), now = Date.now() } = {}) {
  const key = savedKey(url)
  if (!key || !storage) return
  try {
    const rest = readAll(mode, storage).filter((entry) => entry.key !== key && now - entry.savedAt < TTL_MS)
    storage.setItem(keyFor(mode), JSON.stringify([{ key, savedAt: now, response }, ...rest].slice(0, MAX_ENTRIES)))
  } catch {
    // хранилище недоступно или переполнено: просто не сохраняем
  }
}

/** @returns {{ savedAt: number, response: object } | null} */
export function loadSavedAudit(mode, url, { storage = safeLocal(), now = Date.now() } = {}) {
  const key = savedKey(url)
  const entry = readAll(mode, storage).find((item) => item.key === key)
  if (!entry || typeof entry.savedAt !== 'number' || now - entry.savedAt >= TTL_MS || !entry.response) return null
  return { savedAt: entry.savedAt, response: entry.response }
}
