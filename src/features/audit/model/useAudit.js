import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { createAuditClient, getAuditMode } from '../api/config.js'
import { parseAuditResponse } from '../api/parseResponse.js'
import { resolveAttribution } from '../lib/context.js'
import { loadLastResult, saveLastResult } from '../lib/lastResult.js'
import { normalizeUrl } from '../lib/normalizeUrl.js'
import { createAuditTracker } from '../lib/track.js'
import { createAuditController } from './controller.js'
import { createPdfController } from './pdfController.js'

/**
 * @param {{ search: string, onPrefillHandled?: () => void }} options
 */
export function useAudit({ search, onPrefillHandled }) {
  const mode = getAuditMode()
  // UTM и referrer читаются один раз при заходе: смена адреса (например, удаление ?url=) их не пересоздает.
  const [attribution] = useState(() => resolveAttribution(search))
  const baseTrack = useMemo(() => createAuditTracker(mode), [mode])
  const client = useMemo(() => createAuditClient({ mode }), [mode])

  // Для событий из интерфейса (Telegram, PDF и т.д.) метки источника добавляем автоматически.
  const track = useCallback(
    (name, params) =>
      baseTrack(name, {
        utmSource: attribution.utmSource,
        utmMedium: attribution.utmMedium,
        utmCampaign: attribution.utmCampaign,
        ...params,
      }),
    [baseTrack, attribution],
  )

  const controller = useMemo(
    () =>
      createAuditController({
        client,
        track: baseTrack,
        attribution,
        onResult: (entry) => saveLastResult(mode, entry),
      }),
    [client, baseTrack, attribution, mode],
  )

  // Окно под PDF открываем сразу по клику, иначе браузер заблокирует его после ожидания ответа.
  const pendingWindow = useRef(null)
  const pdfController = useMemo(
    () =>
      createPdfController({
        client,
        track,
        openUrl: (url) => {
          const target = pendingWindow.current
          pendingWindow.current = null
          if (target && !target.closed) target.location.replace(url)
          else window.open(url, '_blank', 'noopener')
        },
        onFail: () => {
          pendingWindow.current?.close()
          pendingWindow.current = null
        },
      }),
    [client, track],
  )

  const startPdf = useCallback(
    (args) => {
      try {
        pendingWindow.current = window.open('', '_blank')
        if (pendingWindow.current) pendingWindow.current.opener = null
      } catch {
        pendingWindow.current = null
      }
      return pdfController.download(args)
    },
    [pdfController],
  )

  const state = useSyncExternalStore(controller.subscribe, controller.getState, controller.getState)
  const pdf = useSyncExternalStore(pdfController.subscribe, pdfController.getState, pdfController.getState)

  useEffect(() => {
    track('audit_page_view', {
      fromPage: attribution.fromPage,
      referrerHost: attribution.referrerHost,
    })
  }, [track, attribution])

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

  // После нового результата PDF-состояние сбрасывается.
  useEffect(() => {
    pdfController.reset()
  }, [state.resultCode, pdfController])

  const lastResult = useMemo(() => {
    const entry = loadLastResult(mode)
    if (!entry) return null
    try {
      return { hostname: entry.hostname, response: parseAuditResponse(entry.response) }
    } catch {
      return null
    }
  }, [mode])

  return { state, controller, pdf, startPdf, mode, track, lastResult }
}
