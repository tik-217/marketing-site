// Метрика Яндекса уже подключена в index.html. Если ее нет, события просто не уходят.
const METRIKA_ID = 112916010
const ALLOWED = new Set(['host', 'src', 'placement', 'via', 'intent', 'position', 'code', 'reason', 'mode', 'seconds'])

/** Оставляет только разрешенные параметры, значения короткие и не похожи на ссылки. */
export function sanitizeParams(params = {}) {
  const clean = {}
  for (const [key, value] of Object.entries(params)) {
    if (!ALLOWED.has(key) || value == null) continue
    const text = String(value).slice(0, 64)
    if (/[/?#]|:\/\//.test(text)) continue
    clean[key] = text
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
