/** "1 октября, 10:42" */
export function formatSavedAt(timestamp) {
  const date = new Date(timestamp)
  const day = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date)
  const pad = (value) => String(value).padStart(2, '0')
  return `${day}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
