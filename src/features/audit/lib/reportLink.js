/** Постоянная ссылка на отчет строится на стороне frontend из его origin. Бэкенд абсолютных ссылок не отдает. */
export const REPORT_PATH_PREFIX = '/audit/report/'

export function reportPath(reportId) {
  return `${REPORT_PATH_PREFIX}${encodeURIComponent(reportId)}`
}

export function buildReportUrl(reportId, origin = globalThis.location?.origin ?? '') {
  return `${origin}${reportPath(reportId)}`
}

/**
 * Копирование в буфер обмена. Сначала Clipboard API, затем запасной вариант через временное поле.
 * @returns {Promise<boolean>}
 */
export async function copyText(text, { clipboard = globalThis.navigator?.clipboard, doc = globalThis.document } = {}) {
  try {
    if (clipboard?.writeText) {
      await clipboard.writeText(text)
      return true
    }
  } catch {
    // пробуем запасной вариант
  }
  try {
    if (!doc?.body || typeof doc.execCommand !== 'function') return false
    const field = doc.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    doc.body.appendChild(field)
    field.select()
    const ok = doc.execCommand('copy')
    doc.body.removeChild(field)
    return Boolean(ok)
  } catch {
    return false
  }
}

/** "2 октября 2026" */
export function formatReportDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Moscow' })
    .format(date)
    .replace(/\s*г\.$/, '')
}
