import { useEffect, useRef } from 'react'
import { PARTIAL_NOTICE } from '../lib/messages'
import { PdfAction } from './PdfAction'
import { ProblemCard } from './ProblemCard'
import { FinalCta, MidCta } from './TelegramCta'

const VIEW_AFTER_MS = 5000

function useResultViewed(code, hostname, auditId, track) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    let timer
    const fire = () => track('audit_result_view', { hostname, code, auditId })

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
  }, [code, hostname, auditId, track])

  return ref
}

function ListSection({ id, title, items }) {
  return (
    <section className="ad-block ad-block--tight" aria-labelledby={id}>
      <h2 id={id} className="ad-h2">
        {title}
      </h2>
      <ul className="ad-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

/** Секции разбора. Колонку, отступы между блоками и шапку задает страница. */
export function AuditResult({ response, hostname, code, track, pdf }) {
  const { audit, status } = response
  const viewRef = useResultViewed(code, hostname, response.auditId, track)
  const cta = { hostname, code, auditId: response.auditId, track }

  return (
    <>
      {status === 'partial' && (
        <p className="ad-notice" role="note">
          {PARTIAL_NOTICE}
        </p>
      )}

      <section className="ad-block" ref={viewRef} aria-labelledby="audit-summary-title">
        <h2 id="audit-summary-title" className="ad-h2">
          Краткий итог
        </h2>
        <p className="ad-summary">{audit.summary}</p>
      </section>

      {audit.priorityActions.length > 0 && (
        <section className="ad-block" aria-labelledby="audit-actions-title">
          <h2 id="audit-actions-title" className="ad-h2">
            Что исправить в первую очередь
          </h2>
          <ol className="ad-actions">
            {audit.priorityActions.map((item, index) => (
              <li key={`${item.area}-${item.action}`} className="ad-actions__row">
                <span className="ad-actions__num">{index + 1}</span>
                <div className="ad-actions__body">
                  <span className="ad-actions__area">Где: {item.area}</span>
                  <p className="ad-actions__text">
                    <strong>Что сделать.</strong> {item.action}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <MidCta {...cta} />
        </section>
      )}

      {audit.problems.length > 0 && (
        <section className="ad-block" aria-labelledby="audit-problems-title">
          <h2 id="audit-problems-title" className="ad-h2">
            Основные проблемы
          </h2>
          {audit.problems.map((problem, index) => (
            <ProblemCard key={problem.title} problem={problem} index={index} />
          ))}
        </section>
      )}

      {audit.secondaryNotes.length > 0 && (
        <ListSection id="audit-notes-title" title="Дополнительные замечания" items={audit.secondaryNotes} />
      )}

      {audit.mobileNotes.length > 0 && (
        <ListSection id="audit-mobile-title" title="Мобильная версия" items={audit.mobileNotes} />
      )}

      {audit.strengths.length > 0 && (
        <section className="ad-block" aria-labelledby="audit-strengths-title">
          <h2 id="audit-strengths-title" className="ad-h2">
            Сильные стороны страницы
          </h2>
          {audit.strengths.map((item) => (
            <article key={item} className="ad-card ad-strength">
              <span className="ad-tag ad-tag--accent">Сильная сторона</span>
              <p>{item}</p>
            </article>
          ))}
        </section>
      )}

      <FinalCta {...cta} />

      {pdf && <PdfAction pdf={pdf} />}
    </>
  )
}
