/** Вторичное действие: скопировать постоянную ссылку. Результат озвучивается через aria-live. */
export function CopyLinkButton({ label, copied, onCopy, className = 'ad-btn ad-btn--outline' }) {
  return (
    <div className="ad-copylink">
      <button type="button" className={className} onClick={onCopy}>
        {label}
      </button>
      <span className="ad-copylink__status" role="status" aria-live="polite">
        {copied ? 'Ссылка скопирована' : ''}
      </span>
    </div>
  )
}
