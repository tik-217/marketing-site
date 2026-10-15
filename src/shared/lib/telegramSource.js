// Названия блоков для кнопок: source вида "s-hero" превращается в data-cta="hero".
// Коды пакетов и модулей сохранены прежними ("launch" это "zero", "ads" это "direct", "telegram" это "tg"),
// чтобы названия блоков в Метрике совпадали со старыми метками start.
const packageCodes = {
  direct: 'direct',
  traffic: 'traffic',
  system: 'system',
  launch: 'zero',
}

const moduleCodes = {
  analysis: 'analysis',
  ads: 'direct',
  site: 'site',
  identity: 'identity',
  telegram: 'tg',
}

export function packageSource(packageId) {
  const code = packageCodes[packageId]
  return code ? `s-pricing__p-${code}` : 's-pricing'
}

export function moduleSource(moduleId) {
  const code = moduleCodes[moduleId]
  return code ? `s-pricing__m-${code}` : 's-pricing'
}

/** "s-hero" -> "hero", "s-pricing__p-direct" -> "pricing-direct", "s-pricing__m-direct" -> "pricing-module-direct". */
export function ctaName(source) {
  return String(source)
    .replace(/^s-/, '')
    .replace('__p-', '-')
    .replace('__m-', '-module-')
}
