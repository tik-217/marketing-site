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
 * @typedef {Object} PublicAuditResponse
 * @property {'completed' | 'partial'} status
 * @property {AuditResult} audit
 * @property {string} [message]
 *
 * @typedef {'INVALID_URL' | 'RATE_LIMITED' | 'AUDIT_BUSY' | 'AUDIT_TEMPORARILY_UNAVAILABLE' | 'AUDIT_NOT_AVAILABLE' | 'NETWORK_ERROR' | 'INVALID_RESPONSE'} PublicAuditErrorCode
 *
 * @typedef {Object} PublicAuditError
 * @property {PublicAuditErrorCode} code
 *
 * @typedef {Object} AuditClient
 * @property {(url: string) => Promise<PublicAuditResponse>} runAudit
 */

export const ERROR_CODES = [
  'INVALID_URL',
  'RATE_LIMITED',
  'AUDIT_BUSY',
  'AUDIT_TEMPORARILY_UNAVAILABLE',
  'AUDIT_NOT_AVAILABLE',
  'NETWORK_ERROR',
  'INVALID_RESPONSE',
]

export class AuditError extends Error {
  /** @param {PublicAuditErrorCode} code */
  constructor(code) {
    super(code)
    this.name = 'AuditError'
    this.code = code
  }
}
