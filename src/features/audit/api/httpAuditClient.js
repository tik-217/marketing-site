import { AuditError } from '../model/types.js'
import { errorFromResponse, parseAuditResponse, parsePdfLink } from './parseResponse.js'

const TIMEOUT_MS = 90_000
const PDF_TIMEOUT_MS = 30_000

const present = (value) => typeof value === 'string' && value.trim() !== ''

/** Тело запроса: UTM и referrer только если они реально есть, никаких других полей. */
export function buildAuditBody(input) {
  const body = { url: input.url }
  for (const key of ['utmSource', 'utmMedium', 'utmCampaign', 'referrer']) {
    if (present(input[key])) body[key] = input[key]
  }
  return body
}

/**
 * Единственное место, где фронтенд ходит в API аудита.
 * @param {{ baseUrl: string, fetchImpl?: typeof fetch }} options
 * @returns {import('../model/types.js').AuditClient}
 */
export function createHttpAuditClient({ baseUrl, fetchImpl }) {
  async function post(path, body, timeoutMs) {
    const doFetch = fetchImpl ?? globalThis.fetch
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      return await doFetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timer)
    }
  }

  async function readJson(response) {
    try {
      return await response.json()
    } catch {
      return undefined
    }
  }

  return {
    async runAudit(input) {
      let response
      try {
        response = await post('/api/audit', buildAuditBody(input), TIMEOUT_MS)
      } catch {
        throw new AuditError('NETWORK_ERROR')
      }
      const body = await readJson(response)
      if (!response.ok) throw errorFromResponse(response.status, body)
      return parseAuditResponse(body)
    },

    async getPdfLink(auditId) {
      let response
      try {
        response = await post(`/api/audits/${encodeURIComponent(auditId)}/pdf-token`, undefined, PDF_TIMEOUT_MS)
      } catch {
        throw new AuditError('PDF_FAILED')
      }
      if (!response.ok) throw new AuditError('PDF_FAILED')
      return parsePdfLink(await readJson(response))
    },
  }
}
