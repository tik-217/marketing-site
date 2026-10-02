import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatReportDate } from '../lib/reportLink.js'
import { AuditResult } from './AuditResult'
import { CopyLinkButton } from './CopyLinkButton'

/** Загрузка постоянного отчета: анализ уже выполнен, поэтому никаких этапов проверки, только "Загружаю отчет". */
export function ReportLoading() {
  return (
    <section className="ad-wait">
      <div className="ad-wait__in">
        <p className="ad-report__loading" role="status" aria-live="polite">
          Загружаю отчет
        </p>
        <div className="ad-skeleton" aria-hidden="true">
          <span className="ad-skeleton__line ad-skeleton__line--title" />
          <span className="ad-skeleton__line" />
          <span className="ad-skeleton__line" />
          <span className="ad-skeleton__line ad-skeleton__line--short" />
        </div>
      </div>
    </section>
  )
}

/** 404 остается 404: аудит не запускается и не предлагается автоматически. */
export function ReportNotFound() {
  return (
    <section className="ad-state" role="alert">
      <div className="ad-state__in">
        <span className="ad-eyebrow ad-eyebrow--muted">Отчет</span>
        <h1 className="ad-h1 ad-state__title">Отчет не найден</h1>
        <p className="ad-state__text">Возможно, ссылка указана неверно.</p>
        <div className="ad-state__actions">
          <Link className="ad-btn ad-state__btn" to="/audit">
            Проверить сайт
          </Link>
        </div>
      </div>
    </section>
  )
}

export function ReportError({ code, onRetry }) {
  const limited = code === 'RATE_LIMITED'
  return (
    <section className="ad-state" role="alert">
      <div className="ad-state__in">
        <span className="ad-eyebrow ad-eyebrow--muted">Отчет</span>
        <h1 className="ad-h1 ad-state__title">{limited ? 'Слишком много запросов' : 'Не удалось загрузить отчет'}</h1>
        <p className="ad-state__text">
          {limited ? 'Подождите минуту и откройте ссылку еще раз.' : 'Проверьте соединение и попробуйте еще раз. Отчет сохранен, он не пропал.'}
        </p>
        <div className="ad-state__actions">
          <button type="button" className="ad-btn" onClick={onRetry}>
            Загрузить еще раз
          </button>
          <Link className="ad-link" to="/audit">
            Проверить сайт
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Сохраненный отчет: тот же визуальный результат, что после живого аудита (AuditResult), с шапкой отчета. */
export function ReportResult({ report, track, pdf, copied, onCopy }) {
  const headingRef = useRef(null)

  useEffect(() => {
    // Фокус на заголовок отчета для экранных читателей; страница открывается сверху, без прокрутки.
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const date = formatReportDate(report.createdAt)

  return (
    <section className="ad-read">
      <div className="ad-read__in">
        <header className="ad-result__head">
          <span className="ad-eyebrow">Аудит сайта</span>
          <h1 className="ad-h1 ad-result__title" tabIndex={-1} ref={headingRef}>
            {report.hostname}
          </h1>
          {date && <p className="ad-report__date">Проверено {date}</p>}
          <div className="ad-result__actions">
            <CopyLinkButton label="Скопировать ссылку" copied={copied} onCopy={onCopy} className="ad-btn ad-btn--outline" />
            <Link className="ad-textbtn" to="/audit">
              Проверить другую страницу
            </Link>
          </div>
        </header>
        <AuditResult
          response={{ status: report.status, audit: report.audit }}
          hostname={report.hostname}
          track={track}
          pdf={pdf}
        />
      </div>
    </section>
  )
}

/** Выбор состояния страницы отчета. */
export function ReportView({ state, track, pdf, copied, onCopy, onRetry }) {
  if (state.phase === 'loading') return <ReportLoading />
  if (state.phase === 'notfound') return <ReportNotFound />
  if (state.phase === 'error') return <ReportError code={state.errorCode} onRetry={onRetry} />
  return <ReportResult report={state.report} track={track} pdf={pdf} copied={copied} onCopy={onCopy} />
}
