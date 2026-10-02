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
  usage: null, // состояние дневного лимита запусков (см. lib/dailyLimit.js)
  savedAt: null, // не null, если показан разбор, сохраненный на этом устройстве, а не новый
  errorCode: '',
  resultCode: '',
}

/**
 * Состояние аудита без привязки к React: проще тестировать и не дублировать запросы.
 * @param {{
 *   client: import('./types.js').AuditClient,
 *   track: (name: string, params?: object) => void,
 *   limit?: { getState: () => object, consume: () => object },
 *   store?: { load: (url: string) => ({ savedAt: number, response: object } | null), save: (url: string, response: object) => void },
 *   attribution?: { utmSource?: string, utmMedium?: string, utmCampaign?: string, referrer?: string, referrerHost?: string, fromPage?: string },
 *   makeCode?: () => string,
 *   now?: () => number,
 * }} deps
 */
export function createAuditController({
  client,
  track,
  attribution = {},
  store = { load: () => null, save: () => {} },
  limit = { getState: () => ({ enabled: false, limit: 3, used: 0, remaining: 3, exhausted: false }), consume: () => ({ enabled: false, limit: 3, used: 0, remaining: 3, exhausted: false }) },
  makeCode = makeResultCode,
  now = Date.now,
}) {
  let state = { ...initialState, usage: limit.getState() }
  let inFlight = false
  const listeners = new Set()

  // Что уходит в аналитику: только метки и хост, без ссылок и текста.
  const common = (hostname) => ({
    hostname,
    utmSource: attribution.utmSource,
    utmMedium: attribution.utmMedium,
    utmCampaign: attribution.utmCampaign,
    fromPage: attribution.fromPage,
    referrerHost: attribution.referrerHost,
  })
  // Что уходит на бэкенд: UTM и referrer, только если они есть.
  const backendFields = () => ({
    utmSource: attribution.utmSource,
    utmMedium: attribution.utmMedium,
    utmCampaign: attribution.utmCampaign,
    referrer: attribution.referrer,
  })

  const set = (patch) => {
    state = { ...state, ...patch }
    listeners.forEach((listener) => listener())
  }

  async function run(url, hostname, via) {
    if (inFlight) return
    inFlight = true
    // Счетчик растет в момент фактического запуска нового аудита, ровно перед POST /api/audit.
    const usage = limit.consume()
    set({ phase: 'loading', url, hostname, fieldError: '', errorCode: '', response: null, savedAt: null, usage })
    track('audit_loading_started', common(hostname))
    const startedAt = now()

    try {
      const response = parseAuditResponse(await client.runAudit({ url, ...backendFields() }))
      const resultCode = makeCode()
      const seconds = Math.round((now() - startedAt) / 1000)
      track(response.status === 'partial' ? 'audit_partial' : 'audit_completed', {
        ...common(hostname),
        status: response.status,
        auditId: response.auditId,
        code: resultCode,
        seconds,
        via,
      })
      store.save(url, response)
      set({ phase: 'result', response, resultCode })
    } catch (error) {
      const code = error instanceof AuditError ? error.code : 'NETWORK_ERROR'
      track('audit_failed', { ...common(hostname), code })
      const saved = code === 'RATE_LIMITED' || code === 'AUDIT_LIMIT_REACHED' ? store.load(url) : null
      if (code === 'INVALID_URL') set({ phase: 'idle', fieldError: 'invalid' })
      else if (saved) {
        // Лимит исчерпан, но эту страницу сегодня уже проверяли: показываем сохраненный разбор.
        track('audit_limit_saved_shown', common(hostname))
        set({ phase: 'result', response: saved.response, savedAt: saved.savedAt, resultCode: makeCode() })
      } else set({ phase: 'error', errorCode: code })
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
        track('audit_validation_error', { reason: result.reason, utmSource: attribution.utmSource, utmMedium: attribution.utmMedium, utmCampaign: attribution.utmCampaign })
        return
      }
      const usage = limit.getState()
      if (usage.exhausted) {
        // Лимит на сегодня исчерпан: запрос не отправляется, форма остается с пояснением.
        track('audit_local_limit_blocked', common(result.hostname))
        set({ input: raw, usage })
        return
      }
      set({ input: raw, usage })
      track('audit_submit', { ...common(result.hostname), via })
      return run(result.url, result.hostname, via)
    },
    retry() {
      if (inFlight || state.phase !== 'error' || !state.url) return
      const usage = limit.getState()
      if (usage.exhausted) {
        track('audit_local_limit_blocked', common(state.hostname))
        set({ phase: 'idle', input: state.input, fieldError: '', errorCode: '', usage })
        return
      }
      track('audit_retry_click', { ...common(state.hostname), code: state.errorCode })
      return run(state.url, state.hostname, 'retry')
    },
    /** Пересчитывает дневной лимит (например, после полуночи на открытой странице). */
    refreshUsage() {
      const usage = limit.getState()
      if (JSON.stringify(usage) !== JSON.stringify(state.usage)) set({ usage })
    },
    newSite() {
      if (inFlight) return
      track('audit_new_site_click', common(state.hostname))
      state = { ...initialState, usage: limit.getState() }
      listeners.forEach((listener) => listener())
    }
  }
}
