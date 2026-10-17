// Посетители из рекламы ВКонтакте: utm_source, начинающийся с vk (vk, vk_ads и т.п.), запоминаем на время визита (sessionStorage),
// а в ссылках t.me на /bankrotstvo дописываем в текст сообщения, откуда человек пришел.
const STORAGE_KEY = 'utm_source_vk'
const SUFFIX = ', увидел рекламу во ВКонтакте'
const ORIGINAL = 'data-href-original'

export function isVkSearch(search) {
  return (new URLSearchParams(search).get('utm_source') ?? '').toLowerCase().startsWith('vk')
}

function storage() {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function rememberVkSource(search = window.location.search) {
  if (!isVkSearch(search)) return
  try {
    storage()?.setItem(STORAGE_KEY, '1')
  } catch {
    // sessionStorage недоступен: метка живет только на текущей странице
  }
}

function isVisitorFromVk(search) {
  if (isVkSearch(search)) return true
  try {
    return storage()?.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function withVkSuffix(href) {
  let url
  try {
    url = new URL(href)
  } catch {
    return href
  }
  const text = url.searchParams.get('text')
  if (url.hostname !== 't.me' || !text || text.endsWith(SUFFIX)) return href
  // Пробелы в тексте кодируем как %20, как в остальных ссылках на чат.
  const encoded = encodeURIComponent(text + SUFFIX)
  return `${url.origin}${url.pathname}?text=${encoded}`
}

function onBankruptcyPage() {
  return /^\/bankrotstvo\/?$/.test(window.location.pathname)
}

export function syncVkLinks(root = document) {
  const active = onBankruptcyPage() && isVisitorFromVk(window.location.search)
  root.querySelectorAll('a[href*="t.me/"]').forEach((link) => {
    const saved = link.getAttribute(ORIGINAL)
    const current = link.getAttribute('href')
    if (!active) {
      if (saved !== null && current !== saved && current.endsWith(encodeURIComponent(SUFFIX))) link.setAttribute('href', saved)
      return
    }
    const next = withVkSuffix(current)
    if (next === current) return
    if (saved === null) link.setAttribute(ORIGINAL, current)
    link.setAttribute('href', next)
  })
}

/** Вызывать после гидратации: ссылки меняются в разметке сразу и при каждом изменении страницы. */
export function initVkSource() {
  rememberVkSource()
  let queued = false
  const run = () => {
    queued = false
    syncVkLinks()
  }
  const schedule = () => {
    if (queued) return
    queued = true
    queueMicrotask(run)
  }
  run()
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] })
  return () => observer.disconnect()
}
