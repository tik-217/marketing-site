import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { createAuditClient, getAuditMode } from '../api/config.js'
import { parseAuditResponse } from '../api/parseResponse.js'
import { resolveSource } from '../lib/context.js'
import { loadLastResult, saveLastResult } from '../lib/lastResult.js'
import { normalizeUrl } from '../lib/normalizeUrl.js'
import { createAuditTracker } from '../lib/track.js'
import { createAuditController } from './controller.js'

/**
 * @param {{ search: string, onPrefillHandled?: () => void }} options
 */
export function useAudit({ search, onPrefillHandled }) {
  const mode = getAuditMode()
  const source = useMemo(() => resolveSource(search), [search])
  const track = useMemo(() => createAuditTracker(mode), [mode])

  const controller = useMemo(
    () =>
      createAuditController({
        client: createAuditClient({ mode }),
        track,
        source,
        onResult: (entry) => saveLastResult(mode, entry),
      }),
    [mode, track, source],
  )

  const state = useSyncExternalStore(controller.subscribe, controller.getState, controller.getState)

  useEffect(() => {
    track('audit_page_view', { src: source })
  }, [track, source])

  // ?url=... запускает аудит сам, например со ссылки с главной. Один раз на открытие страницы.
  const prefillDone = useRef(false)
  useEffect(() => {
    if (prefillDone.current) return
    prefillDone.current = true
    const prefill = new URLSearchParams(search).get('url')
    if (!prefill) return
    const parsed = normalizeUrl(prefill)
    if (parsed.ok) controller.submit(prefill, { via: 'prefill' })
    else controller.setInput(prefill)
    onPrefillHandled?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const lastResult = useMemo(() => {
    const entry = loadLastResult(mode)
    if (!entry) return null
    try {
      return { hostname: entry.hostname, response: parseAuditResponse(entry.response) }
    } catch {
      return null
    }
  }, [mode])

  return { state, controller, mode, source, track, lastResult }
}
