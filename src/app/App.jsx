import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/home'
import { NotFoundPage } from '../pages/not-found'
import { PrivacyPage } from '../pages/privacy'
import { AppProviders } from './providers/AppProviders'
import './styles/index.css'

export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProviders>
  )
}
