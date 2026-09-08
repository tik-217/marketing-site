import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'

export function AppProviders({ children }) {
  return (
    <HelmetProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </HelmetProvider>
  )
}
