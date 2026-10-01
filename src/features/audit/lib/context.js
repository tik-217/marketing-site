const KEY = 'audit:attribution'
const TAG = /^[\p{L}\p{N}_.+-]{1,64}$/u

/** Метка UTM: короткая, без пробелов и служебных символов. */
export function cleanTag(value) {
  return typeof value === 'string' && TAG.test(value) ? value.toLowerCase() : ''
}

function safeSession() {
  try {
    return globalThis.sessionStorage
  } catch {
    return undefined
  }
}

/** Referrer без query и hash, чтобы в бэкенд и аналитику не попадали чужие параметры. */
export function cleanReferrer(referrer) {
  try {
    if (!referrer) return { referrer: '', referrerHost: '' }
    const url = new URL(referrer)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return { referrer: '', referrerHost: '' }
    return {
      referrer: `${url.origin}${url.pathname === '/' ? '' : url.pathname}`.slice(0, 200),
      referrerHost: url.hostname,
    }
  } catch {
    return { referrer: '', referrerHost: '' }
  }
}

/** Путь внутреннего referrer (например, /cases) для события fromPage. */
export function internalPath(referrer, origin) {
  try {
    const url = new URL(referrer)
    return url.origin === origin && /^\/[\w/-]{0,60}$/.test(url.pathname) ? url.pathname : ''
  } catch {
    return ''
  }
}

/**
 * UTM и referrer читаются при первом заходе на /audit и живут до конца сессии вкладки.
 * Других параметров адреса мы не сохраняем.
 */
export function resolveAttribution(
  search,
  { storage = safeSession(), referrer = globalThis.document?.referrer ?? '', origin = globalThis.location?.origin ?? '' } = {},
) {
  const params = new URLSearchParams(search)
  const fresh = {
    utmSource: cleanTag(params.get('utm_source')),
    utmMedium: cleanTag(params.get('utm_medium')),
    utmCampaign: cleanTag(params.get('utm_campaign')),
  }

  let saved = {}
  try {
    saved = JSON.parse(storage?.getItem(KEY) ?? '{}') ?? {}
  } catch {
    saved = {}
  }

  const hasSaved = Object.keys(saved).length > 0
  const base = hasSaved
    ? saved
    : { ...cleanReferrer(referrer), fromPage: internalPath(referrer, origin) }
  const attribution = {
    utmSource: saved.utmSource || fresh.utmSource || '',
    utmMedium: saved.utmMedium || fresh.utmMedium || '',
    utmCampaign: saved.utmCampaign || fresh.utmCampaign || '',
    referrer: base.referrer ?? '',
    referrerHost: base.referrerHost ?? '',
    fromPage: base.fromPage ?? '',
  }

  try {
    storage?.setItem(KEY, JSON.stringify(attribution))
  } catch {
    // хранилище недоступно: работаем без сохранения
  }
  return attribution
}
