// Сопоставление id пакетов и модулей на сайте (src/entities/pricing) с кодами,
// которые понимает бот (см. PACKAGE_NAMES и MODULE_NAMES в telegram-bot/texts.py).
// Часть id на сайте называется иначе, чем в боте: пакет "launch" на сайте это
// "zero" в боте, модуль "ads" это "direct", модуль "telegram" это "tg".
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
