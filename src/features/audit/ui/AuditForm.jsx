import { useId } from 'react'
import { validationMessages } from '../lib/messages'

export function AuditForm({ state, onChange, onSubmit, inputRef }) {
  const id = useId()
  const errorText = state.fieldError ? validationMessages[state.fieldError] : ''

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(state.input)
  }

  return (
    <form className="ad-form" onSubmit={handleSubmit} noValidate>
      <label className="ad-form__label" htmlFor={`${id}-url`}>
        Ссылка на страницу
      </label>
      <div className="ad-form__row">
        <input
          id={`${id}-url`}
          ref={inputRef}
          className="ad-form__input"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="https://ваш-сайт.ru/страница"
          value={state.input}
          aria-invalid={errorText ? 'true' : 'false'}
          aria-describedby={`${id}-error`}
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="submit" className="ad-btn ad-form__submit">
          Проверить страницу
        </button>
      </div>
      {errorText && (
        <p id={`${id}-error`} role="alert" className="ad-form__error">
          {errorText}
        </p>
      )}
      <div className="ad-form__facts">
        <span>Бесплатно</span>
        <span aria-hidden="true" className="ad-form__dot">·</span>
        <span>Около 30 секунд</span>
        <span aria-hidden="true" className="ad-form__dot">·</span>
        <span>Без регистрации и телефона</span>
      </div>
      <p className="ad-form__note">
        Разбор смотрит одну страницу. Заявок, продаж и рекламы вашего бизнеса он не видит.
      </p>
    </form>
  )
}
