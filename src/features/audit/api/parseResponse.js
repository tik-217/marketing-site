import { AuditError } from '../model/types.js'

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)
const isText = (value) => typeof value === 'string' && value.trim().length > 0

function textList(value) {
  return Array.isArray(value) ? value.filter(isText) : []
}

function parseAction(item) {
  return isObject(item) && isText(item.area) && isText(item.action)
    ? { area: item.area, action: item.action }
    : null
}

function parseProblem(item) {
  if (!isObject(item)) return null
  if (!isText(item.title) || !isText(item.observed) || !isText(item.reason) || !isText(item.action)) {
    return null
  }
  const problem = {
    title: item.title,
    observed: item.observed,
    reason: item.reason,
    action: item.action,
  }
  if (isText(item.currentText)) problem.currentText = item.currentText
  if (isText(item.suggestedText)) problem.suggestedText = item.suggestedText
  return problem
}

/**
 * Не доверяем JSON слепо: пропускаем только ожидаемую структуру,
 * все остальное превращаем в безопасную ошибку.
 * @returns {import('../model/types.js').PublicAuditResponse}
 */
export function parseAuditResponse(data) {
  if (!isObject(data)) throw new AuditError('INVALID_RESPONSE')
  if (data.status !== 'completed' && data.status !== 'partial') throw new AuditError('INVALID_RESPONSE')
  const audit = data.audit
  if (!isObject(audit) || !isText(audit.summary)) throw new AuditError('INVALID_RESPONSE')

  const parsed = {
    status: data.status,
    audit: {
      summary: audit.summary,
      priorityActions: (Array.isArray(audit.priorityActions) ? audit.priorityActions : [])
        .map(parseAction)
        .filter(Boolean),
      problems: (Array.isArray(audit.problems) ? audit.problems : []).map(parseProblem).filter(Boolean),
      secondaryNotes: textList(audit.secondaryNotes),
      mobileNotes: textList(audit.mobileNotes),
      strengths: textList(audit.strengths),
    },
  }
  // auditId нужен только для PDF. Без валидного id аудит остается успешным, PDF просто не показываем.
  if (isAuditId(data.auditId)) parsed.auditId = data.auditId
  return parsed
}

const isAuditId = (value) => typeof value === 'string' && /^[0-9a-f][0-9a-f-]{7,63}$/i.test(value)

/** Ответ pdf-token: ссылку строим не сами, но принимаем только https. */
export function parsePdfLink(data) {
  if (!isObject(data) || !isText(data.downloadUrl)) throw new AuditError('PDF_FAILED')
  let url
  try {
    url = new URL(data.downloadUrl)
  } catch {
    throw new AuditError('PDF_FAILED')
  }
  if (url.protocol !== 'https:') throw new AuditError('PDF_FAILED')
  return {
    downloadUrl: url.toString(),
    ...(isText(data.expiresAt) ? { expiresAt: data.expiresAt } : {}),
  }
}

const KNOWN_CODES = new Set([
  'INVALID_URL',
  'RATE_LIMITED',
  'AUDIT_LIMIT_REACHED',
  'AUDIT_BUSY',
  'AUDIT_TEMPORARILY_UNAVAILABLE',
  'AUDIT_NOT_AVAILABLE',
])

/** Код ошибки из тела ответа или по HTTP-статусу. Тексты сервера пользователю не показываем. */
export function errorFromResponse(status, body) {
  const code = isObject(body) && isObject(body.error) ? body.error.code : undefined
  if (KNOWN_CODES.has(code)) return new AuditError(code)
  if (status === 429) return new AuditError('RATE_LIMITED')
  if (status === 400 || status === 422) return new AuditError('INVALID_URL')
  if (status === 503) return new AuditError('AUDIT_BUSY')
  if (status === 404 || status === 403) return new AuditError('AUDIT_NOT_AVAILABLE')
  return new AuditError('AUDIT_TEMPORARILY_UNAVAILABLE')
}
