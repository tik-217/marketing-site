import { useEffect, useRef } from 'react'
import { PARTIAL_NOTICE } from '../lib/messages'
import { ProblemCard } from './ProblemCard'
import { PdfAction } from './PdfAction'
import { CtaBlock, FinalCta } from './TelegramCta'

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

function BulletSection({ id, title, items, muted = false }) {
  return (
    <section className="ad-block" aria-labelledby={id}>
      <h2 id={id} className="ad-h2 ad-h2--result">
        {title}
      </h2>
      <ul className={muted ? 'audit-list audit-list--plain' : 'audit-list'}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export function AuditResult({ response, hostname, code, track, pdf, preview = false }) {
  const { audit, status } = response
  const viewRef = useResultViewed(code, hostname, response.auditId, track)
  const hasProblems = audit.problems.length > 0
  const hasActions = audit.priorityActions.length > 0
  const cta = { hostname, code, auditId: response.auditId, track }

  return (
    <div className="ad-result">
      {status === 'partial' && (
        <p className="audit-notice" role="note">
          {PARTIAL_NOTICE}
        </p>
      )}

      <section className="ad-block" ref={viewRef} aria-labelledby="audit-summary-title">
        <h2 id="audit-summary-title" className="ad-h2 ad-h2--result">
          Краткий итог
        </h2>
        <p className="audit-summary">{audit.summary}</p>
      </section>

      {hasActions && (
        <section className="ad-block" aria-labelledby="audit-actions-title">
          <h2 id="audit-actions-title" className="ad-h2 ad-h2--result">
            Что исправить в первую очередь
          </h2>
          <ol className="ad-actions">
            {audit.priorityActions.map((item, index) => (
              <li key={`${item.area}-${item.action}`} className="ad-actions__row">
                <span className="ad-actions__num">{index + 1}</span>
                <div>
                  <span className="ad-actions__area">Где: {item.area}</span>
                  <p className="ad-actions__text">
                    <strong>Что сделать.</strong> {item.action}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {!preview && (
            <CtaBlock
              {...cta}
              position="actions"
              label="Обсудить разбор в Telegram"
              text="Помогу расставить эти пункты по порядку под ваш бюджет."
            />
          )}
        </section>
      )}

      {hasProblems && (
        <section className="ad-block" aria-labelledby="audit-problems-title">
          <h2 id="audit-problems-title" className="ad-h2 ad-h2--result">
            Основные проблемы
          </h2>
          <div className="ad-problems">
            {audit.problems.map((problem, index) => (
              <ProblemCard key={problem.title} problem={problem} index={index} />
            ))}
          </div>
        </section>
      )}

      {audit.secondaryNotes.length > 0 && (
        <BulletSection id="audit-notes-title" title="Дополнительные замечания" items={audit.secondaryNotes} />
      )}

      {audit.mobileNotes.length > 0 && (
        <BulletSection id="audit-mobile-title" title="Мобильная версия" items={audit.mobileNotes} />
      )}

      {audit.strengths.length > 0 && (
        <section className="ad-block" aria-labelledby="audit-strengths-title">
          <h2 id="audit-strengths-title" className="ad-h2 ad-h2--result">
            Сильные стороны страницы
          </h2>
          <ul className="ad-strengths">
            {audit.strengths.map((item) => (
              <li key={item} className="ad-strengths__card">
                <span className="ad-tag">Сильная сторона</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!preview && <FinalCta {...cta} />}

      {!preview && pdf && <PdfAction pdf={pdf} />}
    </div>
  )
}
