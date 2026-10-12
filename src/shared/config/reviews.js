// Блок отзывов с Яндекс Карт на главной. Показывается, только если номер организации заполнен
// и переключатель включен. Иначе блока нет в разметке совсем.
export const reviewsConfig = {
  // Номер организации на Яндекс Картах, число из адреса yandex.ru/maps/org/.../<номер>/
  orgId: '137750161957',
  // Переключатель показа блока
  enabled: true,
}

export function isReviewsVisible(config = reviewsConfig) {
  return config.enabled === true && String(config.orgId).trim() !== ''
}
