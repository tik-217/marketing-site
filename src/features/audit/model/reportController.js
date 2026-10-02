import { AuditError } from './types.js'

const initialState = {
  phase: 'loading', // loading | result | notfound | error
  report: null,
  errorCode: '',
}

/**
 * Состояние страницы постоянного отчета без привязки к React.
 * Эта страница ТОЛЬКО читает сохраненный отчет: runAudit здесь не вызывается ни при каких условиях,
 * в том числе когда отчет не найден (404 остается 404).
 * В аналитику уходят только хост и статус: reportId не передается.
 * @param {{
 *   client: Pick<import('./types.js').AuditClient, 'getReport'>,
 *   track: (name: string, params?: object) => void,
 * }} deps
 */
export function createReportController({ client, track }) {
  let state = { ...initialState }
  let started = false
  const listeners = new Set()
  const set = (patch) => {
    state = { ...state, ...patch }
    listeners.forEach((listener) => listener())
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    /** Загружает отчет один раз на открытие страницы (повторный вызов с тем же id игнорируется). */
    async load(reportId) {
      if (started) return
      started = true
      set({ phase: 'loading', report: null, errorCode: '' })
      try {
        const report = await client.getReport(reportId)
        track('audit_report_view', { hostname: report.hostname, status: report.status })
        set({ phase: 'result', report })
      } catch (error) {
        const code = error instanceof AuditError ? error.code : 'NETWORK_ERROR'
        if (code === 'REPORT_NOT_FOUND') set({ phase: 'notfound', errorCode: code })
        else set({ phase: 'error', errorCode: code })
      }
    },
    /** Повторная загрузка после сетевой ошибки: тоже только чтение. */
    async retry(reportId) {
      if (state.phase !== 'error') return
      started = false
      return this.load(reportId)
    },
  }
}

/**
 * События постоянной страницы. Внутренние события результата аудита переименовываются или отбрасываются,
 * id отчета и аудита никогда не попадают в аналитику.
 * @param {(name: string, params?: object) => void} baseTrack
 * @param {{ hostname: string, status: string }} context
 */
export function createReportTrack(baseTrack, context) {
  const base = () => ({ hostname: context.hostname, status: context.status })
  return (name) => {
    if (name === 'audit_telegram_click') baseTrack('audit_report_telegram_click', base())
    else if (name === 'audit_pdf_click') baseTrack('audit_report_pdf_click', base())
    else if (name === 'audit_report_link_copy') baseTrack('audit_report_link_copy', base())
    // audit_result_view, audit_copy_message и прочие события живого результата здесь не нужны
  }
}
