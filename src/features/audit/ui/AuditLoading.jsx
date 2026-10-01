import { useEffect, useState } from 'react'

const steps = [
  'Открываю страницу',
  'Смотрю первый экран',
  'Проверяю кнопки и формы',
  'Собираю разбор',
]

const STEP_MS = 5500

function statusFor(index, current) {
  if (index < current) return 'Готово'
  if (index === current) return 'Сейчас'
  return 'Далее'
}

export function AuditLoading({ hostname }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((value) => Math.min(value + 1, steps.length - 1)), STEP_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="ad-wait">
      <span className="audit-sr" role="status">
        Идет проверка сайта {hostname}
      </span>
      <div className="ad-wait__head" aria-hidden="true">
        <h2 className="ad-h2 ad-h2--big">Готовлю разбор</h2>
        <p className="ad-muted">Обычно это занимает 20-30 секунд. Страницу можно не обновлять.</p>
      </div>
      <ol className="ad-steps" aria-hidden="true">
        {steps.map((label, index) => (
          <li key={label} className={`ad-steps__item ad-steps__item--${index < current ? 'done' : index === current ? 'now' : 'next'}`}>
            <span className="ad-steps__num">{index + 1}</span>
            <span className="ad-steps__label">{label}</span>
            <span className="ad-steps__status">{statusFor(index, current)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
