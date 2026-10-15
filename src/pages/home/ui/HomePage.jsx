import { Seo } from '../../../shared/lib/seo'
import { Header } from '../../../widgets/header'
import { Hero } from '../../../widgets/hero'
import { Cases } from '../../../widgets/cases'
import { Reviews } from '../../../widgets/reviews'
import { CaseWalkthrough } from '../../../widgets/case-steps'
import { Situations } from '../../../widgets/situations'
import { Pricing } from '../../../widgets/pricing'
import { Comparison } from '../../../widgets/comparison'
import { About } from '../../../widgets/about'
import { Terms } from '../../../widgets/terms'
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
          <Reviews />
          <CaseWalkthrough />
          <Situations />
          <Pricing />
          <Comparison />
          <About />
          <Terms />
          <Faq />
          <Audit id="audit" />
        </main>
        <Footer />
        <StickyCta />
      </div>
    </>
  )
}
