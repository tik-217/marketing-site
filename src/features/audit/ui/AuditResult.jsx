import { useEffect, useRef } from 'react'
import { PARTIAL_NOTICE } from '../lib/messages'
import { ProblemCard } from './ProblemCard'
import { TelegramCta } from './TelegramCta'
import { TelegramLink } from './TelegramLink'

const VIEW_AFTER_MS = 5000

function useResultViewed(code, hostname, track) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    let timer
    const fire = () => track('audit_result_view', { host: hostname, code })

    if (typeof IntersectionObserver === 'undefined') {
      timer = setTimeout(fire, VIEW_AFTER_MS)
      return () => clearTimeout(timer)
    }

    const observer = new IntersectionObserver(([entry]) => {
      clearTimeout(timer)
      if (entry.isIntersecting) {
        timer = setTimeout(() => {
          fire()
          observer.disconnect()
        }, VIEW_AFTER_MS)
      }
    })
    observer.observe(element)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [code, hostname, track])

  return ref
}

export function AuditResult({ response, hostname, code, track, onNewSite, preview = false }) {
  const { audit, status } = response
  const viewRef = useResultViewed(code, hostname, track)
  const hasProblems = audit.problems.length > 0
  const hasActions = audit.priorityActions.length > 0
  const hasFindings = hasProblems || hasActions

  return (
    <div className="audit-result">
      {status === 'partial' && (
        <p className="audit-notice" role="note">
          {PARTIAL_NOTICE}
        </p>
      )}

      <section className="audit-block" ref={viewRef} aria-labelledby="audit-summary-title">
        <h2 id="audit-summary-title" className="audit-block__title">
          Коротко
        </h2>
        <p className="audit-summary">{audit.summary}</p>
      </section>

      {hasActions && (
        <section className="audit-block" aria-labelledby="audit-actions-title">
          <h2 id="audit-actions-title" className="audit-block__title">
            Что исправить в первую очередь
          </h2>
          <div className="audit-actions__head" aria-hidden="true">
            <span>Где</span>
            <span>Что сделать</span>
          </div>
          <ol className="audit-actions">
            {audit.priorityActions.map((item) => (
              <li key={`${item.area}-${item.action}`} className="audit-actions__row">
                <span className="audit-actions__area">{item.area}</span>
                <span className="audit-actions__action">{item.action}</span>
              </li>
            ))}
          </ol>
          {!preview && (
          <p className="audit-midcta">
            Это разбор страницы. Если идет реклама, могу посмотреть и ее.{' '}
            <TelegramLink
              intent="ads"
              position="mid"
              hostname={hostname}
              code={code}
              track={track}
              className="text-link"
            >
              Написать в Telegram
            </TelegramLink>
          </p>
          )}
        </section>
      )}

      {hasProblems && (
        <section className="audit-block" aria-labelledby="audit-problems-title">
          <h2 id="audit-problems-title" className="audit-block__title">
            Основные проблемы
          </h2>
          <div className="audit-problems">
            {audit.problems.map((problem, index) => (
              <ProblemCard key={problem.title} problem={problem} index={index} />
            ))}
          </div>
        </section>
      )}

      {!hasFindings && (
        <p className="audit-empty">
          Явных проблем, которые можно уверенно подтвердить по публичной странице, не нашлось.
        </p>
      )}

      {audit.secondaryNotes.length > 0 && (
        <section className="audit-block" aria-labelledby="audit-notes-title">
          <h2 id="audit-notes-title" className="audit-block__title">
            Еще что стоит поправить
          </h2>
          <ul className="audit-list">
            {audit.secondaryNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      {audit.mobileNotes.length > 0 && (
        <section className="audit-block" aria-labelledby="audit-mobile-title">
          <h2 id="audit-mobile-title" className="audit-block__title">
            Мобильная версия
          </h2>
          <ul className="audit-list">
            {audit.mobileNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      {audit.strengths.length > 0 && (
        <section className="audit-block" aria-labelledby="audit-strengths-title">
          <h2 id="audit-strengths-title" className="audit-block__title">
            Что уже работает
          </h2>
          <ul className="audit-list audit-list--plain">
            {audit.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {!preview && (
        <>
          <TelegramCta hostname={hostname} code={code} track={track} hasFindings={hasFindings} />

          <p className="audit-result__again">
            <button type="button" className="audit-linkbutton" onClick={onNewSite}>
              Проверить другой сайт
            </button>
          </p>
        </>
      )}
    </div>
  )
}
