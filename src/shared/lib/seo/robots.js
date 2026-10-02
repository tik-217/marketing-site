/** Значение meta robots для закрытых страниц. */
export function robotsContent({ noArchive = false } = {}) {
  return noArchive ? 'noindex, nofollow, noarchive' : 'noindex, nofollow'
}
