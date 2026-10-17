import { useEffect } from 'react'
import { initVkSource } from '../shared/lib/vkSource'
import { AppRoutes } from './AppRoutes'
import { AppProviders } from './providers/AppProviders'
import './styles/index.css'

export function App() {
  // Эффект срабатывает после гидратации, когда разметку уже можно менять.
  useEffect(() => initVkSource(), [])

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}
