import { Seo } from '../../../shared/lib/seo'
import { Header } from '../../../widgets/header'
import { Hero } from '../../../widgets/hero'
import { Cases } from '../../../widgets/cases'
import { Situations } from '../../../widgets/situations'
import { Comparison } from '../../../widgets/comparison'
import { Solo } from '../../../widgets/solo'
import { Pricing } from '../../../widgets/pricing'
import { Audit } from '../../../widgets/audit'
import { Process } from '../../../widgets/process'
import { Boundaries } from '../../../widgets/boundaries'
import { About } from '../../../widgets/about'
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
          <Situations />
          <Comparison />
          <Solo />
          <Pricing />
          <Audit id="audit" />
          <Process />
          <Boundaries />
          <About />
          <Faq />
          <Audit />
        </main>
        <Footer />
      </div>
    </>
  )
}
