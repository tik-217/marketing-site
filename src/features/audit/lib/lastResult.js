const TTL_MS = 7 * 24 * 60 * 60 * 1000

const keyFor = (mode) => `audit:last:${mode}`

function safeLocal() {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

/** Последний результат хранится только в браузере пользователя, 7 дней. */
export function saveLastResult(mode, entry, storage = safeLocal(), now = Date.now()) {
  try {
    storage?.setItem(keyFor(mode), JSON.stringify({ ...entry, savedAt: now }))
  } catch {
    // хранилище недоступно: просто не сохраняем
  }
}

export function loadLastResult(mode, storage = safeLocal(), now = Date.now()) {
  try {
    const raw = storage?.getItem(keyFor(mode))
    if (!raw) return null
    const entry = JSON.parse(raw)
    if (!entry || typeof entry.savedAt !== 'number' || now - entry.savedAt > TTL_MS) return null
    if (typeof entry.hostname !== 'string' || !entry.response) return null
    return entry
  } catch {
    return null
  }
}
