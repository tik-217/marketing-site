const SRC_KEY = 'audit:src'
const VALID = /^[a-z0-9_-]{1,32}$/i

export function cleanTag(value) {
  return typeof value === 'string' && VALID.test(value) ? value.toLowerCase() : ''
}

/** Источник трафика из ?src=, живет в рамках вкладки. */
export function resolveSource(search, storage = safeSession()) {
  const fromQuery = cleanTag(new URLSearchParams(search).get('src'))
  try {
    if (fromQuery) {
      storage?.setItem(SRC_KEY, fromQuery)
      return fromQuery
    }
    return cleanTag(storage?.getItem(SRC_KEY)) || 'direct'
  } catch {
    return fromQuery || 'direct'
  }
}

function safeSession() {
  try {
    return globalThis.sessionStorage
  } catch {
    return undefined
  }
}
