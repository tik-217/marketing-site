import { REPORT_PATH_PREFIX, reportPath } from './reportLink.js'

/**
 * Делает постоянную ссылку текущим адресом страницы, не перезагружая ее и не обращаясь к роутеру.
 * replaceState (не pushState): по "Назад" пользователь уходит на предыдущую страницу сайта,
 * а не на промежуточное состояние завершенного аудита. Внутреннее состояние роутера (history.state)
 * сохраняется, поэтому "Вперед" и обновление страницы работают штатно: откроется ReportPage.
 * @returns {boolean} true, если адрес стал постоянным
 */
export function assignReportUrl(reportId, { history = globalThis.history, location = globalThis.location } = {}) {
  try {
    const target = reportPath(reportId)
    if (location.pathname !== target) history.replaceState(history.state, '', target)
    return location.pathname === target
  } catch {
    return false
  }
}

/** Возвращает /audit, если адрес был заменен на постоянный (например, при "Проверить другую страницу"). */
export function restoreAuditUrl({ history = globalThis.history, location = globalThis.location } = {}) {
  try {
    if (location.pathname.startsWith(REPORT_PATH_PREFIX)) history.replaceState(history.state, '', '/audit')
  } catch {
    // адрес остается как есть
  }
}

/**
 * Следит за состоянием аудита: когда есть результат с reportId, один раз на результат меняет адрес
 * и отправляет событие без id отчета. Новый запрос аудита и GET отчета не выполняются.
 * @param {{ track: (name: string, params?: object) => void, history?: History, location?: Location }} deps
 */
export function createReportUrlSync({ track, history, location }) {
  let doneFor = ''
  let assigned = false
  const listeners = new Set()

  const setAssigned = (value) => {
    if (assigned === value) return
    assigned = value
    listeners.forEach((listener) => listener())
  }

  return {
    getAssigned: () => assigned,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    /** @returns {boolean} получила ли страница постоянный адрес */
    sync({ phase, response, hostname, resultCode }) {
      const reportId = phase === 'result' ? response?.reportId : undefined
      if (!reportId) {
        doneFor = ''
        setAssigned(false)
        return false
      }
      if (doneFor === resultCode) return assigned
      doneFor = resultCode
      const ok = assignReportUrl(reportId, { history, location })
      if (ok) track('audit_report_url_assigned', { hostname, status: response.status })
      setAssigned(ok)
      return ok
    },
    reset() {
      doneFor = ''
      setAssigned(false)
      restoreAuditUrl({ history, location })
    },
  }
}
