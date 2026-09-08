import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/home'
import { NotFoundPage } from '../pages/not-found'
import { AppProviders } from './providers/AppProviders'
import './styles/index.css'

export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProviders>
  )
}
