// Цели Яндекс Метрики (счетчик 112916010), которые не зависят от аудита.
// bot_click: любая ссылка на tigran_audit_bot. phone_click: любая ссылка tel:.
// sticky_click: кнопка нижней панели. form_submit: успешная отправка формы с контактом.
// Счетчик подключен в index.html. Если его нет, события просто не уходят.
export const METRIKA_COUNTER_ID = 112916010

export function reachGoal(name) {
  try {
    if (typeof globalThis.ym === 'function') globalThis.ym(METRIKA_COUNTER_ID, 'reachGoal', name)
  } catch {
    // аналитика не должна ломать страницу
  }
}

/** Определяет цели по клику на ссылку. Вынесено отдельно, чтобы проверять без браузера. */
export function goalsForLink(link) {
  if (!link) return []
  const goals = []
  const href = link.getAttribute('href') || ''
  if (href.includes('tigran_audit_bot')) goals.push('bot_click')
  if (href.startsWith('tel:')) goals.push('phone_click')
  const own = link.getAttribute('data-goal')
  if (own) goals.push(own)
  return goals
}

/** Один обработчик на весь документ: ничего не нужно вешать на каждую ссылку. */
export function initLinkGoals(doc = document) {
  const onClick = (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null
    for (const goal of goalsForLink(link)) reachGoal(goal)
  }
  doc.addEventListener('click', onClick)
  return () => doc.removeEventListener('click', onClick)
}
