import { PDF_ERROR, PDF_LOADING } from '../lib/messages'

/** Вторичное действие после Telegram: PDF. Ошибка PDF не затрагивает сам разбор. */
export function PdfAction({ pdf }) {
  const loading = pdf.status === 'loading'

  return (
    <div className="ad-pdf">
      <button type="button" className="btn btn--outline ad-pdf__btn" disabled={loading} onClick={pdf.onClick}>
        {loading ? PDF_LOADING : 'Скачать отчет в PDF'}
      </button>
      <p className="ad-pdf__error" role={pdf.status === 'error' ? 'alert' : undefined}>
        {pdf.status === 'error' ? PDF_ERROR : ''}
      </p>
    </div>
  )
}
