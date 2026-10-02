/**
 * @typedef {Object} PriorityAction
 * @property {string} area
 * @property {string} action
 *
 * @typedef {Object} AuditProblem
 * @property {string} title
 * @property {string} observed
 * @property {string} reason
 * @property {string} action
 * @property {string} [currentText]
 * @property {string} [suggestedText]
 *
 * @typedef {Object} AuditResult
 * @property {string} summary
 * @property {PriorityAction[]} priorityActions
 * @property {AuditProblem[]} problems
 * @property {string[]} secondaryNotes
 * @property {string[]} mobileNotes
 * @property {string[]} strengths
 *
 * @typedef {Object} AuditSuccessResponse
 * @property {'completed'} status
 * @property {string} [auditId] может отсутствовать, если история на бэкенде не сохранилась
 * @property {AuditResult} audit
 *
 * @typedef {Object} AuditPartialResponse
 * @property {'partial'} status
 * @property {string} [auditId]
 * @property {AuditResult} audit
 * @property {string} [message]
 *
 * @typedef {Object} SavedReport
 * @property {'completed' | 'partial'} status
 * @property {string} createdAt ISO-дата проверки
 * @property {string} hostname
 * @property {string} pathname
 * @property {AuditResult} audit
 *
 * @typedef {AuditSuccessResponse | AuditPartialResponse} AuditResponse
 *
 * @typedef {'INVALID_URL' | 'RATE_LIMITED' | 'AUDIT_LIMIT_REACHED' | 'AUDIT_BUSY' | 'AUDIT_TEMPORARILY_UNAVAILABLE' | 'AUDIT_NOT_AVAILABLE' | 'NETWORK_ERROR' | 'INVALID_RESPONSE'} AuditErrorCode
 *
 * @typedef {Object} AuditErrorResponse
 * @property {{ code: string, message?: string }} error
 *
 * @typedef {Object} AuditInput
 * @property {string} url
 * @property {string} [utmSource]
 * @property {string} [utmMedium]
 * @property {string} [utmCampaign]
 * @property {string} [referrer]
 *
 * @typedef {Object} PdfLink
 * @property {string} downloadUrl
 * @property {string} [expiresAt]
 *
 * @typedef {Object} AuditClient
 * @property {(input: AuditInput) => Promise<AuditResponse>} runAudit
 * @property {(auditId: string) => Promise<PdfLink>} getPdfLink
 * @property {(reportId: string) => Promise<SavedReport>} getReport
 * @property {(reportId: string) => Promise<PdfLink>} getReportPdfLink
 */

export const ERROR_CODES = [
  'INVALID_URL',
  'RATE_LIMITED',
  'AUDIT_LIMIT_REACHED',
  'AUDIT_BUSY',
  'AUDIT_TEMPORARILY_UNAVAILABLE',
  'AUDIT_NOT_AVAILABLE',
  'NETWORK_ERROR',
  'INVALID_RESPONSE',
]

export class AuditError extends Error {
  /** @param {AuditErrorCode | 'PDF_FAILED' | 'REPORT_NOT_FOUND' | 'REPORT_UNAVAILABLE'} code */
  constructor(code) {
    super(code)
    this.name = 'AuditError'
    this.code = code
  }
}
