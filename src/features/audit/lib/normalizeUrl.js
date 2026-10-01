const MAX_LENGTH = 2048
const OTHER_SCHEME = /^(?:[a-z][a-z0-9+.-]*:\/\/|(?:javascript|data|mailto|tel|file|blob):)/i

/**
 * Приводит ввод пользователя к URL для аудита.
 * @param {string} raw
 * @returns {{ ok: true, url: string, hostname: string } | { ok: false, reason: 'empty' | 'invalid' }}
 */
export function normalizeUrl(raw) {
  const input = String(raw ?? '').trim()
  if (!input) return { ok: false, reason: 'empty' }
  if (input.length > MAX_LENGTH || /\s/.test(input)) return { ok: false, reason: 'invalid' }

  const hasHttp = /^https?:\/\//i.test(input)
  if (!hasHttp && OTHER_SCHEME.test(input)) return { ok: false, reason: 'invalid' }

  let parsed
  try {
    parsed = new URL(hasHttp ? input : `https://${input}`)
  } catch {
    return { ok: false, reason: 'invalid' }
  }

  if (parsed.username || parsed.password) return { ok: false, reason: 'invalid' }

  const host = parsed.hostname.replace(/\.$/, '')
  const labels = host.split('.')
  const looksLikeDomain =
    labels.length >= 2 &&
    labels.every((label) => /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i.test(label)) &&
    /^(?:[a-z]{2,}|xn--[a-z0-9-]+)$/i.test(labels[labels.length - 1])
  if (!looksLikeDomain) return { ok: false, reason: 'invalid' }

  parsed.hash = ''
  return { ok: true, url: parsed.toString(), hostname: displayHostname(input) }
}

/** Хост для показа пользователю: как введен, без схемы, пути и www. */
export function displayHostname(input) {
  return String(input)
    .trim()
    .replace(/^https?:\/\//i, '')
    .split(/[/?#:]/)[0]
    .toLowerCase()
    .replace(/^www\./, '')
}
