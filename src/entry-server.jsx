import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './app/AppRoutes'

/**
 * Рендер страницы в строку HTML для пререндера при сборке (scripts/prerender.mjs).
 * В React 19 теги <title>, <meta>, <link> и <script> из Helmet попадают прямо в эту строку,
 * скрипт пререндера переносит их в <head>.
 */
export function render(url) {
  return renderToString(
    <HelmetProvider>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </HelmetProvider>,
  )
}
