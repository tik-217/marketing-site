/** Отправка заявки через сервер: токен бота никогда не передается браузеру. */
export async function sendTelegramMessage(text) {
  const response = await fetch('/api/contact.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!response.ok) throw new Error('Не удалось отправить заявку')
  const data = await response.json()
  if (!data.ok) throw new Error('Не удалось отправить заявку')
  return data
}
