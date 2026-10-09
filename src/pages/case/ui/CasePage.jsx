import { Link, useParams } from 'react-router-dom'
import { findCaseBySlug } from '../../../entities/case'
import { Seo } from '../../../shared/lib/seo'
import { CtaButton } from '../../../shared/ui'
import { Header } from '../../../widgets/header'
import { Footer } from '../../../widgets/footer'
import { CaseWalkthroughPage } from '../../../widgets/case-steps'
import { CaseStepImage } from './CaseStepImage'
import { NotFoundPage } from '../../not-found'

export function CasePage() {
  const { slug } = useParams()
  const item = findCaseBySlug(slug)

  if (!item) return <NotFoundPage />

  const inProgress = item.status !== 'done'
  const hasMetrics = item.metrics && item.metrics.length > 0
  const cover = item.cover
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
            {isLegal ? (
              <p className="case-detail-header__first-lead">{item.firstLeadLine}</p>
            ) : (
              <dl className="case-detail-header__meta">
                <div className="case-detail-header__meta-item">
                  <dt className="case-detail-header__meta-label">Ниша</dt>
                  <dd className="case-detail-header__meta-value">{item.niche}</dd>
                </div>
                <div className="case-detail-header__meta-item">
                  <dt className="case-detail-header__meta-label">Срок</dt>
                  <dd className="case-detail-header__meta-value">{item.period}</dd>
                </div>
                <div className="case-detail-header__meta-item">
                  <dt className="case-detail-header__meta-label">Что входило</dt>
                  <dd className="case-detail-header__meta-value">{item.scope.join(', ')}</dd>
                </div>
              </dl>
            )}
          </div>

          {cover && !isLegal && (
            <div style={{ paddingTop: 'var(--space-6)' }}>
              <>
                <img src={cover.src} alt={cover.alt} className={cover.srcDark ? 'case-detail-cover theme-image--light' : 'case-detail-cover'} decoding="async" fetchPriority="high" />
                {cover.srcDark && (
                  <img src={cover.srcDark} alt={cover.alt} className="case-detail-cover theme-image--dark" decoding="async" />
                )}
              </>
            </div>
          )}

          <article className="case-article" style={{ paddingTop: 'clamp(var(--space-7), 6vw, var(--space-8))' }}>
            <section className="case-story">
              <h2 className="case-story__title">С чем пришел клиент</h2>
              {item.clientStory.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            {isLegal ? (
              <CaseWalkthroughPage />
            ) : (
            <section className="case-solution">
              <h2 className="case-solution__title">Решение</h2>
              <ol className="case-steps">
                {item.solutionSteps.map((step, index) => (
                  <li key={step.title} className="case-step">
                    <span className="case-step__num">{String(index + 1).padStart(2, '0')}</span>
                    <div className="case-step__body">
                      <h3 className="case-step__title">{step.title}</h3>
                      <p className="case-step__text">{step.text}</p>
                      {step.images && step.images.length > 0 && (
                        <div className="case-step__images">
                          {step.images.map((image) => (
                            <CaseStepImage key={image.src} {...image} />
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
            )}

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
