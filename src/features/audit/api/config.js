import { createHttpAuditClient } from './httpAuditClient.js'
import { createMockAuditClient } from './mockAuditClient.js'

export const AUDIT_API_URL = 'https://api.gabulyan-tigran.ru'

/** По умолчанию mock. Боевой режим включается только явным VITE_AUDIT_MODE=live. */
export function getAuditMode(env = import.meta.env) {
  return env?.VITE_AUDIT_MODE === 'live' ? 'live' : 'mock'
}

export function createAuditClient({ mode = getAuditMode(), ...options } = {}) {
  if (mode === 'live') return createHttpAuditClient({ baseUrl: AUDIT_API_URL, ...options })
  return createMockAuditClient(options)
}
