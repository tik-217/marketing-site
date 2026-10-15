import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { initLinkGoals } from './shared/lib/analytics/goals'
import { initTheme } from './shared/lib/theme/theme'

initTheme()
initLinkGoals()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
