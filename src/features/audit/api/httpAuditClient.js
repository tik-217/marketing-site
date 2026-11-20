import { AuditError } from '../model/types.js'
import { errorFromReportResponse, errorFromResponse, isReportId, parseAuditResponse, parsePdfLink, parseReportResponse } from './parseResponse.js'

const TIMEOUT_MS = 90_000
const PDF_TIMEOUT_MS = 30_000
const REPORT_TIMEOUT_MS = 20_000

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
export function createHttpAuditClient({ baseUrl, fetchImpl, timeoutOverride }) {
  async function request(path, { method, body, timeoutMs }) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutOverride ?? timeoutMs)
    try {
      const response = await (fetchImpl ?? globalThis.fetch)(`${baseUrl}${path}`, {
        method,
        ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
        signal: controller.signal,
      })
      let data
      try {
        data = await response.json()
      } catch (error) {
        if (controller.signal.aborted) throw error
      }
      return { response, data }
    } finally {
      clearTimeout(timer)
    }
  }

  return {
    async runAudit(input) {
      let response, body
      try {
        ({ response, data: body } = await request('/api/audit', { method: 'POST', body: buildAuditBody(input), timeoutMs: TIMEOUT_MS }))
      } catch {
        throw new AuditError('NETWORK_ERROR')
      }
      if (!response.ok) throw errorFromResponse(response.status, body)
      return parseAuditResponse(body)
    },

    /** Сохраненный отчет по постоянной ссылке. Не запускает аудит ни при каких ответах. */
    async getReport(reportId) {
      if (!isReportId(reportId)) throw new AuditError('REPORT_NOT_FOUND')
      let response, body
      try {
        ({ response, data: body } = await request(`/api/reports/${encodeURIComponent(reportId)}`, { method: 'GET', timeoutMs: REPORT_TIMEOUT_MS }))
      } catch {
        throw new AuditError('NETWORK_ERROR')
      }
      if (!response.ok) throw errorFromReportResponse(response.status, body)
      return parseReportResponse(body)
    },

    async getReportPdfLink(reportId) {
      let response, body
      try {
        ({ response, data: body } = await request(`/api/reports/${encodeURIComponent(reportId)}/pdf-token`, { method: 'POST', timeoutMs: PDF_TIMEOUT_MS }))
      } catch {
        throw new AuditError('PDF_FAILED')
      }
      if (!response.ok) throw new AuditError('PDF_FAILED')
      return parsePdfLink(body)
    },

    async getPdfLink(auditId) {
      let response, body
      try {
        ({ response, data: body } = await request(`/api/audits/${encodeURIComponent(auditId)}/pdf-token`, { method: 'POST', timeoutMs: PDF_TIMEOUT_MS }))
      } catch {
        throw new AuditError('PDF_FAILED')
      }
      if (!response.ok) throw new AuditError('PDF_FAILED')
      return parsePdfLink(body)
    },
  }
}
