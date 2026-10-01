import { AuditError } from '../model/types.js'
import { errorFromResponse, parseAuditResponse } from './parseResponse.js'

const TIMEOUT_MS = 90_000

/**
 * Боевой клиент. Подготовлен под будущее подключение, в режиме mock не используется.
 * @param {{ baseUrl: string, fetchImpl?: typeof fetch }} options
 * @returns {import('../model/types.js').AuditClient}
 */
export function createHttpAuditClient({ baseUrl, fetchImpl }) {
  return {
    async runAudit(url) {
      const doFetch = fetchImpl ?? globalThis.fetch
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

      let response
      try {
        response = await doFetch(`${baseUrl}/api/audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
          signal: controller.signal,
        })
      } catch {
        throw new AuditError('NETWORK_ERROR')
      } finally {
        clearTimeout(timer)
      }

      let body
      try {
        body = await response.json()
      } catch {
        body = undefined
      }

      if (!response.ok) throw errorFromResponse(response.status, body)
      return parseAuditResponse(body)
    },
  }
}
