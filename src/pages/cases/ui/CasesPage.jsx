import { Link } from 'react-router-dom'
import { cases } from '../../../entities/case'
import { Seo } from '../../../shared/lib/seo'
import { CtaButton } from '../../../features/contact-cta'
import { Header } from '../../../widgets/header'
import { Footer } from '../../../widgets/footer'
import { CasePreviewCard } from '../../../widgets/cases'

export function CasesPage() {
  return (
    <>
      <Seo
        title="Кейсы"
        description="Кейсы маркетинга для юридических фирм. Одна сделка окупила маркетинг минимум в 11 раз в нише, где услугу почти не ищут"
        path="/cases"
      />
      <Header />
      <main className="section">
        <div className="container stack">
          <div className="cases-page-header">
            <Link to="/" className="case-detail-header__back">
              <span aria-hidden="true">←</span> На главную
            </Link>
            <h1 className="cases-page-header__title">Кейсы в юридической нише</h1>
            <p className="cases-page-header__lead">Одна сделка окупила маркетинг минимум в 11 раз в нише, где услугу почти не ищут</p>
          </div>

          <div className="case-preview-grid">
            {cases.map((item) => (
              <CasePreviewCard key={item.id} {...item} TitleTag="h2" />
            ))}
          </div>
        </div>

        <div className="container" style={{ paddingTop: 'var(--space-7)' }}>
          <div className="case-cta">
            <h2 className="case-cta__title">Посчитаю, сколько клиентов вашей фирме может дать Яндекс</h2>
            <p className="case-cta__text">
              Напишите город и услугу, остальное посчитаю сам. За 24 часа пришлю план рекламы для вашей фирмы.
            </p>
            <CtaButton source="s-cases" style={{ marginTop: 'var(--space-2)' }} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
