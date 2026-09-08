const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

export async function sendTelegramMessage(text) {
  if (!BOT_TOKEN || !CHAT_ID) {
    throw new Error(
      'Не настроены переменные VITE_TELEGRAM_BOT_TOKEN и VITE_TELEGRAM_CHAT_ID. См. .env.example',
    )
  }

  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  })

  if (!response.ok) {
    throw new Error(`Telegram API вернул ошибку: ${response.status}`)
  }

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.description || 'Telegram API вернул ошибку')
  }

  return data
}
