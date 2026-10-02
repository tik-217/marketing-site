import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getAuditMode } from '../../../features/audit/api/config'
import { useAudit } from '../../../features/audit/model/useAudit'
import { useCopyLink } from '../../../features/audit/model/useCopyLink'
import { useReportUrl } from '../../../features/audit/model/useReportUrl'
import { reportPath } from '../../../features/audit/lib/reportLink'
import { CopyLinkButton } from '../../../features/audit/ui/CopyLinkButton'
import { AuditErrorPanel } from '../../../features/audit/ui/AuditErrorPanel'
import { AuditForm } from '../../../features/audit/ui/AuditForm'
import { AuditLoading } from '../../../features/audit/ui/AuditLoading'
import { AuditResult } from '../../../features/audit/ui/AuditResult'
import { SavedNotice } from '../../../features/audit/ui/SavedNotice'
import {
  AuthorSection,
  ChecksSection,
  ExampleSection,
  FaqSection,
} from '../../../features/audit/ui/AuditSections'
import { Seo } from '../../../shared/lib/seo'
import { Footer } from '../../../widgets/footer'
import { Header } from '../../../widgets/header'

/** Адрес для показа: без query и hash. */
function displayUrlOf(url) {
  try {
    const parsed = new URL(url)
    return `${parsed.protocol}//${parsed.host}${parsed.pathname === '/' ? '' : parsed.pathname}`
  } catch {
    return ''
  }
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function AuditPage() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const headingRef = useRef(null)

  const { state, controller, pdf, startPdf, track } = useAudit({
    search,
    // Параметр url убираем из адреса, чтобы обновление страницы не запускало аудит повторно.
    onPrefillHandled: () => {
      const params = new URLSearchParams(search)
      params.delete('url')
      const rest = params.toString()
      navigate(rest ? `/audit?${rest}` : '/audit', { replace: true })
    },
  })

  const phase = state.phase
  const reportId = state.phase === 'result' ? state.response?.reportId : undefined
  const { copied, copyLink } = useCopyLink({
    reportId,
    // В аналитику только хост и статус: id отчета не передается.
    onCopy: () => track('audit_report_link_copy', { hostname: state.hostname, status: state.response?.status }),
  })
  const displayUrl = displayUrlOf(state.url)
  // После результата с reportId адрес страницы становится постоянной ссылкой (без перезагрузки и без запросов).
  const { assigned: urlAssigned, resetUrl } = useReportUrl({ state, track })

  useEffect(() => {
    if (phase !== 'result') return
    const heading = headingRef.current
    heading?.focus({ preventScroll: true })
    heading?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }, [phase, state.resultCode])

  function handleNewSite() {
    resetUrl()
    controller.newSite()
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0)
  }

  return (
    <div className="ad-page">
      <Seo
        title="Аудит сайта на конверсию"
        description="Введите ссылку на сайт и получите разбор основных проблем страницы и рекомендации по улучшению."
        path="/audit"
        // Когда адрес стал постоянной ссылкой, страница ведет себя как страница отчета: без индексации и referrer.
        noIndex={getAuditMode() !== 'live' || urlAssigned}
        noArchive={urlAssigned}
        noReferrer={urlAssigned}
      />
      <Header />
      <main className="ad-main">
        {phase === 'idle' && (
          <>
            <section className="ad-start">
              <div className="ad-start__intro">
                <h1 className="ad-h1 ad-start__title">Покажу, что на вашей странице может мешать заявкам</h1>
                <p className="ad-start__lead">
                  Вставьте ссылку на страницу сайта. Через 30 секунд получите разбор по моей методике.
                </p>
              </div>
              <AuditForm
                state={state}
                inputRef={inputRef}
                onChange={controller.setInput}
                onSubmit={(value) => controller.submit(value)}
              />
            </section>
            <ExampleSection track={track} />
            <ChecksSection />
            <AuthorSection />
            <FaqSection />
          </>
        )}

        {phase === 'loading' && <AuditLoading hostname={state.hostname} displayUrl={displayUrl} />}

        {phase === 'error' && (
          <AuditErrorPanel
            code={state.errorCode}
            hostname={state.hostname}
            displayUrl={displayUrl}
            track={track}
            onRetry={controller.retry}
            onNewSite={handleNewSite}
          />
        )}

        {phase === 'result' && (
          <section className="ad-read">
            <div className="ad-read__in">
              {state.savedAt && <SavedNotice savedAt={state.savedAt} />}
              <header className="ad-result__head">
                <span className="ad-eyebrow">Разбор страницы</span>
                <h1 className="ad-h1 ad-result__title" tabIndex={-1} ref={headingRef}>
                  Что на странице может мешать заявкам
                </h1>
                <a className="ad-result__url" href={displayUrl} target="_blank" rel="noopener noreferrer">
                  {displayUrl}
                </a>
                <div className="ad-result__actions">
                  <button type="button" className="ad-textbtn" onClick={handleNewSite}>
                    Проверить другую страницу
                  </button>
                  {reportId && <CopyLinkButton label="Скопировать ссылку на отчет" copied={copied} onCopy={copyLink} />}
                  {reportId && !urlAssigned && (
                    <Link className="ad-textbtn" to={reportPath(reportId)}>
                      Открыть постоянный отчет
                    </Link>
                  )}
                </div>
              </header>
              <AuditResult
                response={state.response}
                hostname={state.hostname}
                code={state.resultCode}
                track={track}
                pdf={
                  state.response.auditId
                    ? {
                        status: pdf.status,
                        onClick: () => startPdf({ auditId: state.response.auditId, hostname: state.hostname }),
                      }
                    : undefined
                }
              />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
