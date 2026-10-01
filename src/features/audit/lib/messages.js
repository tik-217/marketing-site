export const errorMessages = {
  INVALID_URL: 'Проверьте ссылку на сайт.',
  RATE_LIMITED: 'На сегодня лимит бесплатных аудитов исчерпан.',
  AUDIT_LIMIT_REACHED: 'На сегодня лимит бесплатных аудитов исчерпан.',
  AUDIT_BUSY: 'Сейчас много запросов. Попробуйте чуть позже.',
  AUDIT_TEMPORARILY_UNAVAILABLE: 'Не получилось завершить аудит. Попробуйте еще раз чуть позже.',
  AUDIT_NOT_AVAILABLE: 'Сервис временно недоступен.',
  NETWORK_ERROR: 'Не удалось связаться с сервисом. Проверьте интернет и попробуйте еще раз.',
  INVALID_RESPONSE: 'Не получилось завершить аудит. Попробуйте еще раз чуть позже.',
}

const retryable = new Set([
  'AUDIT_BUSY',
  'AUDIT_TEMPORARILY_UNAVAILABLE',
  'NETWORK_ERROR',
  'INVALID_RESPONSE',
])

// Ошибки, после которых человека стоит не бросать, а вести в Telegram.
const telegramFallback = new Set(['RATE_LIMITED', 'AUDIT_LIMIT_REACHED', 'AUDIT_BUSY', 'AUDIT_NOT_AVAILABLE'])

export function messageForError(code) {
  return errorMessages[code] ?? errorMessages.AUDIT_TEMPORARILY_UNAVAILABLE
}

export const canRetry = (code) => retryable.has(code)
export const hasTelegramFallback = (code) => telegramFallback.has(code)

export const validationMessages = {
  empty: 'Вставьте ссылку на сайт.',
  invalid: 'Проверьте ссылку на сайт.',
}

export const PARTIAL_NOTICE =
  'Часть выводов не удалось надежно подтвердить. Здесь только подтвержденные замечания.'

export const PDF_LOADING = 'Готовлю PDF...'
export const PDF_ERROR = 'Не получилось подготовить PDF. Попробуйте еще раз.'
