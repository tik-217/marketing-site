import { useEffect, useState } from 'react'

const steps = [
  'Открываю страницу',
  'Смотрю первый экран и структуру',
  'Проверяю оффер, кейсы и формы',
  'Собираю рекомендации',
]

const STEP_MS = 5500

export function AuditLoading({ hostname }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setStep((current) => Math.min(current + 1, steps.length - 1)), STEP_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="audit-loading">
      <span className="audit-sr" role="status">
        Идет проверка сайта {hostname}
      </span>
      <div className="audit-loading__bar" aria-hidden="true">
        <span />
      </div>
      <p className="audit-loading__step" aria-hidden="true">
        {steps[step]}
        <span className="audit-loading__dots">...</span>
      </p>
      <p className="audit-loading__hint">Обычно это занимает 20–30 секунд. Страницу можно не закрывать и не обновлять.</p>
    </div>
  )
}
