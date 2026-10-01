/**
 * Состояние PDF живет отдельно от аудита: ошибка PDF не трогает показанный разбор.
 * @param {{
 *   client: import('./types.js').AuditClient,
 *   track: (name: string, params?: object) => void,
 *   openUrl: (url: string) => void,
 *   onFail?: () => void,
 * }} deps
 */
export function createPdfController({ client, track, openUrl, onFail }) {
  let state = { status: 'idle' } // idle | loading | error
  let busy = false
  const listeners = new Set()

  const set = (next) => {
    state = next
    listeners.forEach((listener) => listener())
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    reset() {
      if (!busy) set({ status: 'idle' })
    },
    async download({ auditId, hostname }) {
      if (busy || !auditId) return
      busy = true
      set({ status: 'loading' })
      track('audit_pdf_click', { hostname, auditId })
      try {
        const { downloadUrl } = await client.getPdfLink(auditId)
        openUrl(downloadUrl)
        track('audit_pdf_ready', { hostname, auditId })
        set({ status: 'idle' })
      } catch {
        onFail?.()
        track('audit_pdf_failed', { hostname, auditId })
        set({ status: 'error' })
      } finally {
        busy = false
      }
    },
  }
}
