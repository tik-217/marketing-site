import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuditMode } from '../../../features/audit/api/config'
import { useAudit } from '../../../features/audit/model/useAudit'
import { AuditErrorPanel } from '../../../features/audit/ui/AuditErrorPanel'
import { AuditForm } from '../../../features/audit/ui/AuditForm'
import { AuditLoading } from '../../../features/audit/ui/AuditLoading'
import { AuditResult } from '../../../features/audit/ui/AuditResult'
import {
  AuthorSection,
  ChecksSection,
  ExampleSection,
  FaqSection,
} from '../../../features/audit/ui/AuditSections'
import { Seo } from '../../../shared/lib/seo'
import { Footer } from '../../../widgets/footer'
import { Header } from '../../../widgets/header'

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

  const { state, controller, pdf, startPdf, track, lastResult } = useAudit({
    search,
    // Параметр url убираем из адреса, чтобы обновление страницы не запускало аудит повторно.
    onPrefillHandled: () => {
      const params = new URLSearchParams(search)
      params.delete('url')
      const rest = params.toString()
      navigate(rest ? `/audit?${rest}` : '/audit', { replace: true })
    },
  })

  const isResult = state.phase === 'result'
  const isError = state.phase === 'error'
  const isIdle = state.phase === 'idle'
  const displayUrl = displayUrlOf(state.url)

  useEffect(() => {
    if (!isResult) return
    const heading = headingRef.current
    heading?.focus({ preventScroll: true })
    heading?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }, [isResult, state.resultCode])

  function handleNewSite() {
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
        noIndex={getAuditMode() !== 'live'}
      />
      <Header />
      <main>
        <section className="ad-hero">
          <div className={isResult || isError ? 'ad-col ad-col--read' : 'ad-col'}>
            {isResult && (
              <>
                <header className="ad-hero__head">
                  <span className="ad-eyebrow">Разбор страницы</span>
                  <h1 className="ad-h1 ad-h1--result" tabIndex={-1} ref={headingRef}>
                    Что на странице может мешать заявкам
                  </h1>
                  <p className="ad-host">{displayUrl}</p>
                  <p>
                    <button type="button" className="audit-linkbutton" onClick={handleNewSite}>
                      Проверить другую страницу
                    </button>
                  </p>
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
              </>
            )}

            {isError && (
              <AuditErrorPanel
                code={state.errorCode}
                hostname={state.hostname}
                displayUrl={displayUrl}
                track={track}
                onRetry={controller.retry}
                onNewSite={handleNewSite}
              />
            )}

            {(isIdle || state.phase === 'loading') && (
              <>
                <header className="ad-hero__head">
                  <h1 className="ad-h1">Покажу, что на вашей странице может мешать заявкам</h1>
                  <p className="ad-lead">
                    Вставьте ссылку на страницу сайта. Через 30 секунд получите разбор по моей
                    методике.
                  </p>
                </header>
                <AuditForm
                  state={state}
                  inputRef={inputRef}
                  onChange={controller.setInput}
                  onSubmit={(value) => controller.submit(value)}
                  lastResult={lastResult}
                  onRestore={() => controller.restore(lastResult)}
                />
                {state.phase === 'loading' && <AuditLoading hostname={state.hostname} />}
              </>
            )}
          </div>
        </section>

        {isIdle && (
          <>
            <ExampleSection track={track} />
            <ChecksSection />
            <AuthorSection />
            <FaqSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
