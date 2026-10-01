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

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function AuditPage() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const headingRef = useRef(null)

  const { state, controller, track, lastResult } = useAudit({
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
          <div className="ad-col">
            {isResult ? (
              <>
                <header className="ad-hero__head">
                  <h1 className="ad-h1 ad-h1--result" tabIndex={-1} ref={headingRef}>
                    Разбор страницы <span className="ad-host">{state.hostname}</span>
                  </h1>
                  <p className="ad-lead">
                    Это взгляд на публичную страницу: рекламу, аналитику и продажи он не учитывает.
                  </p>
                </header>
                <AuditResult
                  response={state.response}
                  hostname={state.hostname}
                  code={state.resultCode}
                  track={track}
                  onNewSite={handleNewSite}
                />
              </>
            ) : (
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
                <div className="ad-status">
                  {state.phase === 'loading' && <AuditLoading hostname={state.hostname} />}
                  {state.phase === 'error' && (
                    <AuditErrorPanel
                      code={state.errorCode}
                      hostname={state.hostname}
                      track={track}
                      onRetry={controller.retry}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {!isResult && (
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
