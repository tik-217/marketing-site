import { Helmet } from 'react-helmet-async'
import { siteConfig } from '../../config/site'

export function Seo({
  title,
  description = siteConfig.description,
  path = '/',
  image = siteConfig.ogImage,
  noIndex = false,
}) {
  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title
  const canonicalUrl = new URL(path, siteConfig.url).toString()
  const imageUrl = new URL(image, siteConfig.url).toString()

  return (
    <Helmet>
      <html lang={siteConfig.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  )
}
