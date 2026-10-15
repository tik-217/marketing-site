// Блок отзывов с Профи.ру на главной. Показывается, только если ссылка на профиль заполнена
// и переключатель включен. Иначе блока нет в разметке совсем.
export const reviewsConfig = {
  // Ссылка на вкладку отзывов в профиле на Профи.ру
  profileUrl: 'https://profi.ru/profile/GabulyanTD/#reviews-tab',
  // Переключатель показа блока
  enabled: true,
}

export function isReviewsVisible(config = reviewsConfig) {
  return config.enabled === true && String(config.profileUrl).trim() !== ''
}
