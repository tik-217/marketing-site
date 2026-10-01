import { createHttpAuditClient } from './httpAuditClient.js'
import { createMockAuditClient } from './mockAuditClient.js'

export const DEFAULT_API_URL = 'https://api.gabulyan-tigran.ru'

/** По умолчанию mock. Боевой режим включается только явным VITE_AUDIT_MODE=live. */
export function getAuditMode(env = import.meta.env) {
  return env?.VITE_AUDIT_MODE === 'live' ? 'live' : 'mock'
}

export function getApiUrl(env = import.meta.env) {
  const value = env?.VITE_AUDIT_API_URL
  return typeof value === 'string' && /^https:\/\//.test(value) ? value.replace(/\/$/, '') : DEFAULT_API_URL
}

export function createAuditClient({ mode = getAuditMode(), baseUrl = getApiUrl(), ...options } = {}) {
  if (mode === 'live') return createHttpAuditClient({ baseUrl, ...options })
  return createMockAuditClient(options)
}
