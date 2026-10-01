import { AuditError } from '../model/types.js'
import { completedAudit, emptyProblemsAudit, fixtureErrors, longAudit, partialAudit } from './fixtures.js'

const clone = (value) => JSON.parse(JSON.stringify(value))

const results = {
  partial: partialAudit,
  empty: emptyProblemsAudit,
  long: longAudit,
}

/**
 * Клиент для разработки. Сценарий выбирается по первому поддомену:
 * partial.example.ru, empty.example.ru, error.example.ru, limit.example.ru,
 * busy.example.ru, down.example.ru, offline.example.ru, long.example.ru (длинные тексты),
 * slow.example.ru (25 секунд).
 * Остальные адреса возвращают обычный завершенный аудит. Сетевых запросов не делает.
 * @param {{ delayMs?: number }} [options]
 * @returns {import('../model/types.js').AuditClient}
 */
export function createMockAuditClient({ delayMs } = {}) {
  return {
    async runAudit(url) {
      const hostname = new URL(url).hostname
      const scenario = hostname.split('.')[0]

      const wait = delayMs ?? (scenario === 'slow' ? 25_000 : 2_500)
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))

      const errorKey = { error: 'temporary', limit: 'limit', busy: 'busy', down: 'unavailable', offline: 'offline' }[scenario]
      if (errorKey) throw new AuditError(fixtureErrors[errorKey])

      return clone(results[scenario] ?? completedAudit)
    },
  }
}
