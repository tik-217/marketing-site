import { parseAuditResponse } from '../api/parseResponse.js'
import { normalizeUrl } from '../lib/normalizeUrl.js'
import { makeResultCode } from '../lib/telegramLink.js'
import { AuditError } from './types.js'

const initialState = {
  phase: 'idle', // idle | loading | result | error
  input: '',
  fieldError: '',
  url: '',
  hostname: '',
  response: null,
  errorCode: '',
  resultCode: '',
}

/**
 * Состояние аудита без привязки к React: проще тестировать и не дублировать запросы.
 * @param {{
 *   client: import('./types.js').AuditClient,
 *   track: (name: string, params?: object) => void,
 *   source?: string,
 *   onResult?: (entry: { hostname: string, response: object }) => void,
 *   makeCode?: () => string,
 *   now?: () => number,
 * }} deps
 */
export function createAuditController({
  client,
  track,
  source = 'direct',
  onResult,
  makeCode = makeResultCode,
  now = Date.now,
}) {
  let state = { ...initialState }
  let inFlight = false
  const listeners = new Set()

  const set = (patch) => {
    state = { ...state, ...patch }
    listeners.forEach((listener) => listener())
  }

  async function run(url, hostname, via) {
    if (inFlight) return
    inFlight = true
    set({ phase: 'loading', url, hostname, fieldError: '', errorCode: '', response: null })
    track('audit_loading_started', { host: hostname, src: source })
    const startedAt = now()

    try {
      const response = parseAuditResponse(await client.runAudit(url))
      const resultCode = makeCode()
      const seconds = Math.round((now() - startedAt) / 1000)
      track(response.status === 'partial' ? 'audit_partial' : 'audit_completed', {
        host: hostname,
        src: source,
        code: resultCode,
        seconds,
        via,
      })
      set({ phase: 'result', response, resultCode })
      onResult?.({ hostname, response })
    } catch (error) {
      const code = error instanceof AuditError ? error.code : 'NETWORK_ERROR'
      track('audit_failed', { host: hostname, src: source, code })
      if (code === 'INVALID_URL') set({ phase: 'idle', fieldError: 'invalid' })
      else set({ phase: 'error', errorCode: code })
    } finally {
      inFlight = false
    }
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setInput(input) {
      set({ input, fieldError: '' })
    },
    submit(raw, { via = 'form' } = {}) {
      if (inFlight) return
      const result = normalizeUrl(raw)
      if (!result.ok) {
        set({ fieldError: result.reason })
        track('audit_validation_error', { reason: result.reason, src: source })
        return
      }
      set({ input: raw })
      track('audit_submit', { host: result.hostname, src: source, via })
      return run(result.url, result.hostname, via)
    },
    retry() {
      if (inFlight || state.phase !== 'error' || !state.url) return
      track('audit_retry_click', { host: state.hostname, src: source, code: state.errorCode })
      return run(state.url, state.hostname, 'retry')
    },
    newSite() {
      if (inFlight) return
      track('audit_new_site_click', { host: state.hostname, src: source })
      state = { ...initialState }
      listeners.forEach((listener) => listener())
    },
    restore({ hostname, response }) {
      if (inFlight) return
      set({ phase: 'result', hostname, response, resultCode: makeCode(), fieldError: '', errorCode: '' })
    },
  }
}
