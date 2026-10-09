import { useId } from 'react'
import { auditsWord, limitWord } from '../lib/dailyLimit'
import { validationMessages } from '../lib/messages'

export function AuditForm({ state, onChange, onSubmit, inputRef }) {
  const id = useId()
  const errorText = state.fieldError ? validationMessages[state.fieldError] : ''
  const usage = state.usage
  const exhausted = Boolean(usage?.exhausted)
  const showRemaining = Boolean(usage?.enabled) && usage.used > 0 && !exhausted

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
        <button type="submit" className="ad-btn ad-form__submit" disabled={exhausted}>
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
      {exhausted ? (
        <div className="ad-form__stop" role="status">
          <strong>Лимит на сегодня закончился</strong>
          <p>
            Вы уже использовали {usage.limit} {auditsWord(usage.limit)}. Каждый разбор я оплачиваю из своих денег, поэтому
            пока ограничил использование {limitWord(usage.limit)} запусками в день с одного браузера. Новый лимит будет
            доступен завтра.
          </p>
        </div>
      ) : (
        showRemaining && (
          <p className="ad-form__note ad-form__limit">
            <span className="ad-form__remaining">
              Осталось сегодня: {usage.remaining} из {usage.limit}
            </span>
          </p>
        )
      )}
    </form>
  )
}
