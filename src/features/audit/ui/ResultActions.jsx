import { CopyLinkButton } from './CopyLinkButton'
import { PdfAction } from './PdfAction'

/**
 * Ряд кнопок под заголовком результата, общий для живого результата и сохраненного отчета:
 * PDF, копирование постоянной ссылки и "Проверить другую страницу". Все кнопки одной высоты.
 */
export function ResultActions({ pdf, copy, children }) {
  return (
    <div className="ad-result__actions">
      {pdf && <PdfAction pdf={pdf} />}
      {copy && <CopyLinkButton label={copy.label} copied={copy.copied} onCopy={copy.onCopy} />}
      {children}
    </div>
  )
}
