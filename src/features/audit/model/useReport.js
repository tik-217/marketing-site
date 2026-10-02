import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { createAuditClient, getAuditMode } from '../api/config.js'
import { createAuditTracker } from '../lib/track.js'
import { createPdfController } from './pdfController.js'
import { useCopyLink } from './useCopyLink.js'
import { createReportController, createReportTrack } from './reportController.js'

/** Состояние постоянной страницы отчета: загрузка, PDF и копирование ссылки. Аудит здесь не запускается. */
export function useReport(reportId) {
  const mode = getAuditMode()
  const baseTrack = useMemo(() => createAuditTracker(mode), [mode])
  const client = useMemo(() => createAuditClient({ mode }), [mode])
  const controller = useMemo(() => createReportController({ client, track: baseTrack }), [client, baseTrack])
  const state = useSyncExternalStore(controller.subscribe, controller.getState, controller.getState)

  useEffect(() => {
    controller.load(reportId)
  }, [controller, reportId])

  const report = state.report
  const track = useMemo(
    () => createReportTrack(baseTrack, { hostname: report?.hostname ?? '', status: report?.status ?? '' }),
    [baseTrack, report],
  )

  // PDF: тот же контроллер, что и после живого аудита; в него передается reportId вместо auditId, а события переименованы и очищены.
  const pendingWindow = useRef(null)
  const pdfController = useMemo(
    () =>
      createPdfController({
        client: { getPdfLink: (id) => client.getReportPdfLink(id) },
        track: (name) => track(name),
        openUrl: (url) => {
          const target = pendingWindow.current
          pendingWindow.current = null
          if (target && !target.closed) target.location.replace(url)
          else window.open(url, '_blank', 'noopener,noreferrer')
        },
        onFail: () => {
          pendingWindow.current?.close()
          pendingWindow.current = null
        },
      }),
    [client, track],
  )
  const pdf = useSyncExternalStore(pdfController.subscribe, pdfController.getState, pdfController.getState)
  const startPdf = useCallback(() => {
    try {
      pendingWindow.current = window.open('', '_blank')
      if (pendingWindow.current) pendingWindow.current.opener = null
    } catch {
      pendingWindow.current = null
    }
    return pdfController.download({ auditId: reportId, hostname: report?.hostname })
  }, [pdfController, reportId, report])

  const { copied, copyLink } = useCopyLink({ reportId, onCopy: () => track('audit_report_link_copy') })

  return { state, track, pdf, startPdf, copied, copyLink, retry: () => controller.retry(reportId) }
}
