import { Helmet } from 'react-helmet-async'
import { contacts } from '../../../shared/config/contacts'
import { siteConfig } from '../../../shared/config/site'
import { Seo } from '../../../shared/lib/seo'
import { Header } from '../../../widgets/header'
import { Hero } from '../../../widgets/hero'
import { Cases } from '../../../widgets/cases'
import { Reviews } from '../../../widgets/reviews'
import { CaseWalkthrough } from '../../../widgets/case-steps'
import { Situations } from '../../../widgets/situations'
import { Pricing } from '../../../widgets/pricing'
import { About } from '../../../widgets/about'
import { Terms } from '../../../widgets/terms'
import { Faq } from '../../../widgets/faq'
import { Audit } from '../../../widgets/audit'
import { Footer } from '../../../widgets/footer'
import { StickyCta } from '../../../widgets/sticky-cta'

const professionalService = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Габулян Тигран',
  telephone: '+7 918 022-09-01',
  address: { '@type': 'PostalAddress', addressLocality: 'Анапа' },
  areaServed: 'RU',
  url: siteConfig.url,
  sameAs: [contacts.telegramUrl, contacts.instagramUrl],
}

export function HomePage() {
  return (
    <>
      <Seo path="/" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(professionalService)}</script>
      </Helmet>
      <div>
        <Header />
        <main>
          <Hero />
          <Cases />
          <CaseWalkthrough />
          <Reviews />
          <Situations />
          <Pricing />
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
