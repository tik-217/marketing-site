// Метрика Яндекса уже подключена в index.html. Если ее нет, события просто не уходят.
const METRIKA_ID = 112916010

const TAG = /^[\p{L}\p{N}_.+-]{1,64}$/u
const PATH = /^\/[\w/-]{0,60}$/
const ID = /^[0-9a-f][0-9a-f-]{7,63}$/i
const HOST = /^[\p{L}\p{N}.-]{1,100}$/u

// Разрешенные параметры и проверка значения. Все остальное отбрасывается.
const RULES = {
  hostname: (v) => HOST.test(v),
  referrerHost: (v) => HOST.test(v),
  status: (v) => TAG.test(v),
  fromPage: (v) => PATH.test(v),
  utmSource: (v) => TAG.test(v),
  utmMedium: (v) => TAG.test(v),
  utmCampaign: (v) => TAG.test(v),
  auditId: (v) => ID.test(v),
  placement: (v) => TAG.test(v),
  via: (v) => TAG.test(v),
  intent: (v) => TAG.test(v),
  position: (v) => TAG.test(v),
  code: (v) => TAG.test(v),
  reason: (v) => TAG.test(v),
  mode: (v) => TAG.test(v),
  seconds: (v) => /^\d{1,4}$/.test(v),
}

/** Оставляет только разрешенные параметры с безопасными значениями: без ссылок и текстов. */
export function sanitizeParams(params = {}) {
  const clean = {}
  for (const [key, value] of Object.entries(params)) {
    const rule = RULES[key]
    if (!rule || value == null || value === '') continue
    const text = String(value)
    if (rule(text)) clean[key] = text
  }
  return clean
}

function metrikaSink(name, params) {
  if (typeof globalThis.ym === 'function') globalThis.ym(METRIKA_ID, 'reachGoal', name, params)
}

/** @param {{ send?: (name: string, params: object) => void }} [options] */
export function createTracker({ send = metrikaSink } = {}) {
  return (name, params) => {
    try {
      send(name, sanitizeParams(params))
    } catch {
      // аналитика не должна ломать страницу
    }
  }
}
