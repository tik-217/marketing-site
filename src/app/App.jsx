import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/home'
import { CasesPage } from '../pages/cases'
import { CasePage } from '../pages/case'
import { NotFoundPage } from '../pages/not-found'
import { PrivacyPage } from '../pages/privacy'
import { AppProviders } from './providers/AppProviders'
import { ScrollToTop } from './ScrollToTop'
import './styles/index.css'

export function App() {
  return (
    <AppProviders>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/:slug" element={<CasePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProviders>
  )
}
