import { AppRoutes } from './AppRoutes'
import { AppProviders } from './providers/AppProviders'
import './styles/index.css'

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}
