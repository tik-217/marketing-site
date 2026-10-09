import { Seo } from '../../../shared/lib/seo'
import { Header } from '../../../widgets/header'
import { Hero } from '../../../widgets/hero'
import { Cases } from '../../../widgets/cases'
import { CaseWalkthrough } from '../../../widgets/case-steps'
import { About } from '../../../widgets/about'
import { Situations } from '../../../widgets/situations'
import { Audit } from '../../../widgets/audit'
import { Comparison } from '../../../widgets/comparison'
import { Phases } from '../../../widgets/phases'
import { Pricing } from '../../../widgets/pricing'
import { Terms } from '../../../widgets/terms'
import { Faq } from '../../../widgets/faq'
import { Footer } from '../../../widgets/footer'

export function HomePage() {
  return (
    <>
      <Seo path="/" />
      <div>
        <Header />
        <main>
          <Hero />
          <Cases />
          <CaseWalkthrough />
          <About />
          <Situations />
          <Audit id="audit-cases" />
          <Comparison />
          <Phases />
          <Pricing />
          <Terms />
          <Faq />
          <Audit id="audit" />
        </main>
        <Footer />
      </div>
    </>
  )
}
