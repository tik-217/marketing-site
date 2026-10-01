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
 * busy.example.ru, budget.example.ru, down.example.ru, offline.example.ru, noid.example.ru (без auditId), pdferr.example.ru (PDF не готовится), long.example.ru (длинные тексты),
 * slow.example.ru (25 секунд).
 * Остальные адреса возвращают обычный завершенный аудит. Сетевых запросов не делает.
 * @param {{ delayMs?: number }} [options]
 * @returns {import('../model/types.js').AuditClient}
 */
const MOCK_ID = '11111111-1111-4111-8111-111111111111'
const MOCK_PDF_FAIL_ID = '11111111-1111-4111-8111-eeeeeeeeeeee'

export function createMockAuditClient({ delayMs } = {}) {
  const pause = (ms) => (ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve())

  return {
    async getPdfLink(auditId) {
      await pause(delayMs ?? 1_200)
      if (auditId === MOCK_PDF_FAIL_ID) throw new AuditError('PDF_FAILED')
      return { downloadUrl: 'https://example.invalid/mock-report.pdf', expiresAt: '2099-01-01T00:00:00Z' }
    },

    async runAudit(input) {
      const hostname = new URL(input.url).hostname
      const scenario = hostname.split('.')[0]

      await pause(delayMs ?? (scenario === 'slow' ? 25_000 : 2_500))

      const errorKey = { error: 'temporary', limit: 'limit', budget: 'budget', busy: 'busy', down: 'unavailable', offline: 'offline' }[scenario]
      if (errorKey) throw new AuditError(fixtureErrors[errorKey])

      const result = clone(results[scenario] ?? completedAudit)
      if (scenario !== 'noid') result.auditId = scenario === 'pdferr' ? MOCK_PDF_FAIL_ID : MOCK_ID
      return result
    },
  }
}
