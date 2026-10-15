import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './app/App'
import { initLinkGoals } from './shared/lib/analytics/goals'
import { initTheme } from './shared/lib/theme/theme'

// Теги head из пререндера (data-prerender) убираем: актуальные выставит React.
document.head.querySelectorAll('[data-prerender]').forEach((element) => element.remove())

initTheme()
initLinkGoals()

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Страница отрендерена при сборке: подключаемся к готовой разметке, чтобы не перерисовывать ее заново
// (иначе заголовок и картинка первого экрана появляются второй раз только после загрузки JavaScript).
// Остальные адреса (отчеты, политика, 404) приходят с пустой оболочкой, их рисуем как раньше.
if (root.hasAttribute('data-prerendered')) hydrateRoot(root, app)
else createRoot(root).render(app)
