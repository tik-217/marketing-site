import { Link } from 'react-router-dom'
import { cases } from '../../../entities/case'
import { Seo } from '../../../shared/lib/seo'
import { CtaButton } from '../../../shared/ui'
import { Header } from '../../../widgets/header'
import { Footer } from '../../../widgets/footer'
import { CasePreviewCard } from '../../../widgets/cases'

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
              <span aria-hidden="true">←</span> На главную
            </Link>
            <h1 className="cases-page-header__title">Первая заявка в первый же месяц работы в нише, где услугу почти не ищут</h1>
            <p className="cases-page-header__lead">Проекты для юридических ниш, от брифа до первых обращений</p>
          </div>

          <div className="case-preview-grid">
            {cases.map((item) => (
              <CasePreviewCard key={item.id} {...item} TitleTag="h2" />
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
