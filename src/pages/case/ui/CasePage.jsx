import { Link, useParams } from 'react-router-dom'
import { bankruptcyWalkthrough, findCaseBySlug, legalWalkthrough } from '../../../entities/case'
import { Seo } from '../../../shared/lib/seo'
import { CtaButton } from '../../../shared/ui'
import { Header } from '../../../widgets/header'
import { Footer } from '../../../widgets/footer'
import { CaseWalkthroughPage } from '../../../widgets/case-steps'
import { NotFoundPage } from '../../not-found'

export function CasePage() {
  const { slug } = useParams()
  const item = findCaseBySlug(slug)

  if (!item) return <NotFoundPage />

  const inProgress = item.status !== 'done'
  const hasMetrics = item.metrics && item.metrics.length > 0
  const isLegal = item.slug === 'legalizaciya-kommercheskih-obektov'
  const description = Array.isArray(item.description) ? item.description.join('. ') : item.description

  return (
    <>
      <Seo title={item.title} description={description} path={`/cases/${item.slug}`} />
      <Header />
      <main className="section">
        <div className="container">
          <div className="case-detail-header">
            <Link to="/cases" className="case-detail-header__back">
              <span aria-hidden="true">←</span> Все кейсы
            </Link>
            <p className="case-detail-header__eyebrow">{item.eyebrow}</p>
            <h1 className="case-detail-header__title">{item.pageTitle}</h1>
            <p className="case-detail-header__first-lead">{item.firstLeadLine}</p>
          </div>

          <article className="case-article" style={{ paddingTop: 'clamp(var(--space-7), 6vw, var(--space-8))' }}>
            <section className="case-story">
              <h2 className="case-story__title">С чем пришел клиент</h2>
              {item.clientStory.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <CaseWalkthroughPage walkthrough={isLegal ? legalWalkthrough : bankruptcyWalkthrough} />

            <section className="case-result">
              <div className="case-result__header">
                <h2 className="case-result__title">{inProgress ? 'Промежуточный результат' : 'Результат'}</h2>
                {inProgress && (
                  <span className="case-result__badge">
                    <span className="case-result__badge-dot" />В работе
                  </span>
                )}
              </div>
              {hasMetrics && (
                <div className="case-result__metrics">
                  {item.metrics.map((metric) => (
                    <div key={metric.label} className="case-result__metric">
                      <span className="case-result__metric-value">{metric.value}</span>
                      <span className="case-result__metric-label">{metric.label}</span>
                      <span className="case-result__metric-period">{metric.period}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="case-result__text">{item.resultText}</p>
            </section>
          </article>
        </div>

        <div className="container" style={{ paddingTop: 'var(--space-7)' }}>
          <div className="case-cta">
            <h2 className="case-cta__title">Что в вашем сайте и рекламе можно исправить</h2>
            <p className="case-cta__text">
              Бесплатно пришлю документ с правками по сайту и рекламе. Для этого задам пять вопросов в Telegram-боте.
            </p>
            <CtaButton source={`s-case-${item.slug}`} style={{ marginTop: 'var(--space-2)' }} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
