import { Link } from 'react-router-dom'
import { cases } from '../../../entities/case'
import { Seo } from '../../../shared/lib/seo'
import { CtaButton } from '../../../shared/ui'
import { Header } from '../../../widgets/header'
import { Footer } from '../../../widgets/footer'

export function CasesPage() {
  return (
    <>
      <Seo
        title="Кейсы"
        description="Проекты для юридических ниш, от брифа до первых обращений."
        path="/cases"
      />
      <Header />
      <main className="section">
        <div className="container stack">
          <div className="cases-page-header">
            <Link to="/" className="case-detail-header__back">
              ← На главную
            </Link>
            <h1 className="cases-page-header__title">Кейсы</h1>
            <p className="cases-page-header__lead">Проекты для юридических ниш, от брифа до первых обращений</p>
          </div>

          <div className="case-preview-grid">
            {cases.map((item) => (
              <Link key={item.id} to={`/cases/${item.slug}`} className="case-preview-card" aria-label={item.title}>
                {item.slides[0] && (
                  <img
                    src={item.slides[0].src}
                    alt={item.slides[0].alt}
                    loading="lazy"
                    decoding="async"
                    className="case-preview-card__cover"
                  />
                )}
                <div className="case-preview-card__body">
                  <div className="case-preview-card__top">
                    <span className="case-badge">{item.niche}</span>
                    <span className="case-status">
                      <span className={item.status === 'done' ? 'case-status__dot case-status__dot--done' : 'case-status__dot'} />
                      {item.status === 'done' ? 'Завершен' : 'В работе'}
                    </span>
                  </div>
                  <h2 className="case-preview-card__title">{item.title}</h2>
                  <p className="case-preview-card__summary">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
          <div className="case-cta">
            <h2 className="case-cta__title">Что в вашем сайте и рекламе можно исправить</h2>
            <p className="case-cta__text">
              Бесплатно пришлю документ с правками по сайту и рекламе. Для этого задам пять вопросов в Telegram-боте.
            </p>
            <CtaButton source="s-cases" style={{ marginTop: 'var(--space-2)' }} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
