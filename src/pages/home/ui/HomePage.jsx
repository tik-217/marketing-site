import { Seo } from '../../../shared/lib/seo'
import { CtaButton } from '../../../shared/ui'
import { Header } from '../../../widgets/header'
import { Hero } from '../../../widgets/hero'
import { Cases } from '../../../widgets/cases'
import { Reviews } from '../../../widgets/reviews'
import { Situations } from '../../../widgets/situations'
import { Pricing } from '../../../widgets/pricing'
import { About } from '../../../widgets/about'
import { Faq } from '../../../widgets/faq'
import { Audit } from '../../../widgets/audit'
import { Footer } from '../../../widgets/footer'
import { StickyCta } from '../../../widgets/sticky-cta'

export function HomePage() {
  return (
    <>
      <Seo path="/" />
      <div>
        <Header />
        <main>
          <Hero />
          <Cases />
          {/* Кнопка между кейсами и отзывами, без своей рамки: продолжает блок кейсов. */}
          <section className="section-cta">
            <div className="container">
              <CtaButton source="s-home-cases" className="btn--wrap" />
            </div>
          </section>
          <Reviews id="reviews" />
          <Situations />
          <Pricing />
          <About />
          <Faq />
          <Audit id="razbor" />
        </main>
        <Footer hideCta hideAuditLink />
        <StickyCta endId="razbor" />
      </div>
    </>
  )
}
