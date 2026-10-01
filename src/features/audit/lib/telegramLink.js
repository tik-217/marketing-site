const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Короткий код результата: связывает сообщение в Telegram с событиями аудита. */
export function makeResultCode(random = Math.random) {
  let code = ''
  for (let i = 0; i < 4; i += 1) {
    code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)]
  }
  return code
}

export const intents = {
  deeper: {
    label: 'Написать Тиграну',
    text: 'Хочу разобрать сайт глубже.',
  },
  ads: {
    label: 'Посмотреть рекламу и аналитику',
    text: 'Хочу, чтобы вы посмотрели рекламу и аналитику.',
  },
  fixes: {
    label: 'Нужны правки на сайте',
    text: 'Нужна помощь с правками на сайте.',
  },
  question: {
    label: 'Вопрос по аудиту',
    text: 'Есть вопрос по результату аудита.',
  },
}

export function buildTelegramMessage({ intent = 'deeper', hostname, code }) {
  const body = intents[intent]?.text ?? intents.deeper.text
  const lines = [`Здравствуйте! Прогнал сайт ${hostname} через аудит. ${body}`]
  if (code) lines.push(`Код: ${code}`)
  return lines.join('\n')
}

export function buildLimitMessage({ hostname }) {
  return `Здравствуйте! Хочу проверить сайт ${hostname}, но бесплатный аудит сейчас недоступен. Можете посмотреть вручную?`
}

export function buildTelegramUrl(baseUrl, text) {
  return `${baseUrl}?text=${encodeURIComponent(text)}`
}
