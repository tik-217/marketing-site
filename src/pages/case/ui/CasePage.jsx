import { useSyncExternalStore } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { bankruptcyWalkthrough, findCaseBySlug, legalWalkthrough } from '../../../entities/case'
import { Seo } from '../../../shared/lib/seo'
import { CtaButton } from '../../../features/contact-cta'
import { Header } from '../../../widgets/header'
import { Footer } from '../../../widgets/footer'
import { CaseWalkthroughPage } from '../../../widgets/case-steps'
import { NotFoundPage } from '../../not-found'

const subscribeToOrigin = () => () => {}
const serverOrigin = () => false

export function CasePage() {
  const { slug } = useParams()
  const { search } = useLocation()
  // Пререндер использует обычный URL кейса; после загрузки учитываем источник перехода.
  const fromBankruptcy = useSyncExternalStore(
    subscribeToOrigin,
    () => new URLSearchParams(search).get('from') === 'bankrotstvo',
    serverOrigin,
  )
  const backLink = fromBankruptcy ? '/bankrotstvo#cases' : '/cases'
  const item = findCaseBySlug(slug)

  if (!item) return <NotFoundPage />

  const inProgress = item.status !== 'done'
  const hasMetrics = item.metrics && item.metrics.length > 0
  const isLegal = item.slug === 'legalizaciya-kommercheskih-obektov'
  const description = item.seoDescription || (Array.isArray(item.description) ? item.description.join('. ') : item.description)

  return (
    <>
      <Seo title={item.title} description={description} path={`/cases/${item.slug}`} />
      <Header homeHref={fromBankruptcy ? '/bankrotstvo#cases' : '/'} />
      <main className="section case-detail-page">
        <div className="container">
          <div className="case-detail-header">
            <Link to={backLink} className="case-detail-header__back">
              <span aria-hidden="true">←</span> {fromBankruptcy ? 'Назад к кейсам' : 'Все кейсы'}
            </Link>
            <p className="case-detail-header__eyebrow">{item.eyebrow}</p>
            <h1 className="case-detail-header__title">{item.pageTitle}</h1>
            {item.firstLeadLine && <p className="case-detail-header__first-lead">{item.firstLeadLine}</p>}
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
                <h2 className="case-result__title">{item.resultTitle || (inProgress ? 'Промежуточный результат' : 'Результат')}</h2>
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
              {Array.isArray(item.description) && item.description.length > 0 && (
                <ul className="case-result__list">
                  {item.description.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </section>
          </article>
        </div>

        <div className="container" style={{ paddingTop: 'var(--space-7)' }}>
          <div className="case-cta">
            <h2 className="case-cta__title">Посчитаю, сколько клиентов вашей фирме может дать Яндекс</h2>
            <p className="case-cta__text">
              Оставьте номер телефона, я уточню город и услугу. За 24 часа пришлю план рекламы для вашей фирмы.
            </p>
            <CtaButton source={`s-case-${item.slug}`} href={fromBankruptcy ? '/bankrotstvo#audit' : undefined} style={{ marginTop: 'var(--space-2)' }} />
          </div>
        </div>
      </main>
      <Footer homeHref={fromBankruptcy ? '/bankrotstvo#cases' : '/'} chat={fromBankruptcy ? { href: '/bankrotstvo#audit', source: `s-case-${item.slug}-footer` } : undefined} />
    </>
  )
}
