import { useEffect, useState } from 'react'

const steps = ['Открываю страницу', 'Смотрю первый экран', 'Проверяю кнопки и формы', 'Собираю разбор']

const STEP_MS = 5500

const STATUS = { done: 'Готово', now: 'Сейчас', next: 'Далее' }

/** Страница ожидания. Шаги меняются по таймеру и не показывают реальный прогресс бэкенда. */
export function AuditLoading({ hostname, displayUrl }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((value) => Math.min(value + 1, steps.length - 1)), STEP_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="ad-wait">
      <div className="ad-wait__in">
        <span className="ad-sr" role="status">
          Идет проверка сайта {hostname}
        </span>
        <div className="ad-wait__bar" aria-hidden="true">
          <div className="ad-wait__url">{displayUrl || hostname}</div>
          <button type="button" disabled className="ad-wait__btn">
            Идет проверка
          </button>
        </div>
        <div className="ad-wait__head" aria-hidden="true">
          <h1 className="ad-h1 ad-wait__title">Готовлю разбор</h1>
          <p>Обычно это занимает 20-30 секунд. Страницу можно не обновлять.</p>
        </div>
        <ol className="ad-steps" aria-hidden="true">
          {steps.map((label, index) => {
            const kind = index < current ? 'done' : index === current ? 'now' : 'next'
            return (
              <li key={label} className={`ad-steps__item ad-steps__item--${kind}`}>
                <span className="ad-steps__num">{index + 1}</span>
                <span>{label}</span>
                <span className="ad-steps__status">{STATUS[kind]}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
