import { formatSavedAt } from '../lib/formatSavedAt'

/** Плашка над результатом, когда из-за лимита показан разбор, сохраненный на этом устройстве. */
export function SavedNotice({ savedAt }) {
  return (
    <div className="ad-saved" role="status">
      <strong>Эту страницу уже проверяли сегодня</strong>
      <span>
        Показываю сохраненный разбор от {formatSavedAt(savedAt)}. Новая проверка этой страницы будет
        доступна завтра.
      </span>
    </div>
  )
}
