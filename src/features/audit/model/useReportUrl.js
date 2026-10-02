import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { createReportUrlSync } from '../lib/reportUrl.js'

/**
 * Постоянная ссылка становится адресом страницы после completed/partial с reportId.
 * @returns {{ assigned: boolean, resetUrl: () => void }}
 */
export function useReportUrl({ state, track }) {
  const urlSync = useMemo(() => createReportUrlSync({ track }), [track])
  const assigned = useSyncExternalStore(urlSync.subscribe, urlSync.getAssigned, () => false)

  const { phase, response, hostname, resultCode } = state
  useEffect(() => {
    urlSync.sync({ phase, response, hostname, resultCode })
  }, [urlSync, phase, response, hostname, resultCode])

  return { assigned, resetUrl: urlSync.reset }
}
