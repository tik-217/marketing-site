import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { initLinkGoals } from './shared/lib/analytics/goals'
import { initTheme } from './shared/lib/theme/theme'

// Теги head из пререндера (data-prerender) убираем: актуальные выставит React.
document.head.querySelectorAll('[data-prerender]').forEach((element) => element.remove())

initTheme()
initLinkGoals()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
