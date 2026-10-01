import { useId } from 'react'
import { validationMessages } from '../lib/messages'

export function AuditForm({ state, onChange, onSubmit, inputRef, lastResult, onRestore }) {
  const id = useId()
  const loading = state.phase === 'loading'
  const errorText = state.fieldError ? validationMessages[state.fieldError] : ''
  const showLast = lastResult && state.phase === 'idle' && !state.input

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(state.input)
  }

  return (
    <form className="audit-start" onSubmit={handleSubmit} noValidate>
      <label className="audit-start__label" htmlFor={`${id}-url`}>
        Ссылка на страницу
      </label>
      <div className="audit-start__row">
        <input
          id={`${id}-url`}
          ref={inputRef}
          className="audit-start__input"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="https://ваш-сайт.ru/страница"
          value={state.input}
          readOnly={loading}
          aria-invalid={errorText ? 'true' : undefined}
          aria-describedby={errorText ? `${id}-error` : `${id}-note`}
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="submit" className="btn audit-start__submit" disabled={loading}>
          {loading ? 'Проверяю…' : 'Проверить страницу'}
        </button>
      </div>
      {errorText && (
        <p id={`${id}-error`} className="audit-start__note audit-start__note--error" role="alert">
          {errorText}
        </p>
      )}
      <ul className="audit-start__facts">
        <li>Бесплатно</li>
        <li>Около 30 секунд</li>
        <li>Без регистрации и телефона</li>
      </ul>
      <p id={`${id}-note`} className="audit-start__note">
        Разбор смотрит одну страницу. Заявок, продаж и рекламы вашего бизнеса он не видит.
      </p>
      {showLast && (
        <p className="audit-start__last">
          Ваш прошлый аудит:{' '}
          <button type="button" className="audit-linkbutton" onClick={onRestore}>
            {lastResult.hostname}
          </button>
        </p>
      )}
    </form>
  )
}
