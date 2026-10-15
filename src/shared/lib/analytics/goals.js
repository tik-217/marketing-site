// Цели Яндекс Метрики (счетчик 112916010), которые не зависят от аудита.
// tg_click: клик по любой ссылке с data-cta, параметр block это значение data-cta.
// phone_click: клик по любой ссылке tel:. form_submit: успешная отправка формы с контактом.
// Счетчик подключен в index.html. Если его нет, события просто не уходят.
export const METRIKA_COUNTER_ID = 112916010

export function reachGoal(name, params) {
  try {
    if (typeof globalThis.ym !== 'function') return
    if (params) globalThis.ym(METRIKA_COUNTER_ID, 'reachGoal', name, params)
    else globalThis.ym(METRIKA_COUNTER_ID, 'reachGoal', name)
  } catch {
    // аналитика не должна ломать страницу
  }
}

/** Определяет цели по клику на ссылку. Вынесено отдельно, чтобы проверять без браузера. */
export function goalsForLink(link) {
  if (!link) return []
  const goals = []
  const cta = link.getAttribute('data-cta')
  if (cta) goals.push({ name: 'tg_click', params: { block: cta } })
  const href = link.getAttribute('href') || ''
  if (href.startsWith('tel:')) goals.push({ name: 'phone_click' })
  return goals
}

/** Один обработчик на весь документ: ничего не нужно вешать на каждую кнопку. */
export function initLinkGoals(doc = document) {
  const onClick = (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null
    for (const goal of goalsForLink(link)) reachGoal(goal.name, goal.params)
  }
  doc.addEventListener('click', onClick)
  return () => doc.removeEventListener('click', onClick)
}
