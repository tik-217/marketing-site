import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/home'
import { AuditPage } from '../pages/audit'
import { CasesPage } from '../pages/cases'
import { CasePage } from '../pages/case'
import { NotFoundPage } from '../pages/not-found'
import { PrivacyPage } from '../pages/privacy'
import { ReportPage } from '../pages/report'
import { AppProviders } from './providers/AppProviders'
import { ScrollToTop } from './ScrollToTop'
import './styles/index.css'

export function App() {
  return (
    <AppProviders>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/audit/report/:reportId" element={<ReportPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/:slug" element={<CasePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProviders>
  )
}
