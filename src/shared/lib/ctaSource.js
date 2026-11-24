// Название блока для аналитики кнопок заявки.
/** "s-hero" -> "hero", "s-pricing__p-direct" -> "pricing-direct", "s-pricing__m-direct" -> "pricing-module-direct". */
export function ctaName(source) {
  return String(source)
    .replace(/^s-/, '')
    .replace('__p-', '-')
    .replace('__m-', '-module-')
}
