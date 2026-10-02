import { useParams } from 'react-router-dom'
import { useReport } from '../../../features/audit/model/useReport'
import { ReportView } from '../../../features/audit/ui/ReportView'
import { Seo } from '../../../shared/lib/seo'
import { Footer } from '../../../widgets/footer'
import { Header } from '../../../widgets/header'

/**
 * Постоянная ссылка на сохраненный отчет: /audit/report/:reportId.
 * Страница только читает отчет: ни при каких условиях не запускает аудит. Не индексируется, referrer не передается.
 */
export function ReportPage() {
  const { reportId } = useParams()
  const { state, track, pdf, startPdf, copied, copyLink, retry } = useReport(reportId)

  return (
    <div className="ad-page">
      <Seo
        title={state.report ? `Аудит сайта ${state.report.hostname}` : 'Аудит сайта'}
        description="Сохраненный отчет об аудите сайта."
        path="/audit"
        noIndex
        noArchive
        noReferrer
      />
      <Header />
      <main className="ad-main">
        <ReportView
          state={state}
          track={track}
          pdf={{ status: pdf.status, onClick: startPdf }}
          copied={copied}
          onCopy={copyLink}
          onRetry={retry}
        />
      </main>
      <Footer />
    </div>
  )
}
