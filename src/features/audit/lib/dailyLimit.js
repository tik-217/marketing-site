export const DAILY_LIMIT = 2
export const USAGE_KEY = 'site_audit_daily_usage_v1'

/** Локальная календарная дата пользователя: 2026-10-02. Новый день начинается в его полночь. */
export function localDateKey(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function safeLocal() {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

const unlimited = { enabled: false, limit: DAILY_LIMIT, used: 0, remaining: DAILY_LIMIT, exhausted: false }

/**
 * Ограничение на фронтенде: не больше DAILY_LIMIT новых запусков аудита в сутки с одного браузера.
 * Считаются только запуски POST /api/audit. Отчеты, PDF, копирование ссылки и Telegram счетчик не трогают.
 * Если localStorage недоступен, ограничение не действует и форма работает как обычно.
 * @param {{ storage?: Pick<Storage, 'getItem' | 'setItem'>, now?: () => Date, limit?: number, key?: string }} [options]
 */
export function createDailyLimit({ storage = safeLocal(), now = () => new Date(), limit = DAILY_LIMIT, key = USAGE_KEY } = {}) {
  function read() {
    const today = localDateKey(now())
    if (!storage) return { available: false, today, used: 0 }
    try {
      const raw = storage?.getItem(key)
      const data = raw ? JSON.parse(raw) : null
      const count = Number.isInteger(data?.count) && data.count >= 0 ? data.count : 0
      return { available: true, today, used: data?.date === today ? count : 0 }
    } catch (error) {
      // повреждённое значение считаем нулём, недоступное хранилище отключает ограничение
      return { available: error instanceof SyntaxError, today, used: 0 }
    }
  }

  function describe({ available, used }) {
    if (!available) return { ...unlimited, limit }
    return { enabled: true, limit, used, remaining: Math.max(0, limit - used), exhausted: used >= limit }
  }

  return {
    getState: () => describe(read()),
    /** Записывает один новый запуск. Вызывается ровно там, где уходит POST /api/audit. */
    consume() {
      const current = read()
      if (!current.available) return describe(current)
      const next = { available: true, today: current.today, used: current.used + 1 }
      try {
        storage.setItem(key, JSON.stringify({ date: next.today, count: next.used }))
      } catch {
        return describe({ ...next, available: false })
      }
      return describe(next)
    },
  }
}

const WORDS = { 1: 'одним', 2: 'двумя', 3: 'тремя', 4: 'четырьмя', 5: 'пятью' }

/** "двумя" для "ограничил использование двумя запусками". */
export const limitWord = (limit) => WORDS[limit] ?? String(limit)

/** 1 аудит, 2 аудита, 5 аудитов. */
export function auditsWord(count) {
  const mod100 = count % 100
  const mod10 = count % 10
  if (mod100 >= 11 && mod100 <= 14) return 'аудитов'
  if (mod10 === 1) return 'аудит'
  if (mod10 >= 2 && mod10 <= 4) return 'аудита'
  return 'аудитов'
}
