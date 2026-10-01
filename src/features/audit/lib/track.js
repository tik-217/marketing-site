import { createTracker } from '../../../shared/lib/analytics/track.js'

/**
 * В режиме mock цели в Метрику не отправляются, чтобы тестовые прогоны не портили данные.
 * @param {'mock' | 'live'} mode
 * @param {(name: string, params: object) => void} [send]
 */
export function createAuditTracker(mode, send) {
  if (mode !== 'live' && !send) {
    return createTracker({
      send: (name, params) => {
        if (import.meta.env?.DEV) console.debug('[audit event]', name, params)
      },
    })
  }
  const track = createTracker(send ? { send } : undefined)
  return (name, params) => track(name, { ...params, mode })
}
