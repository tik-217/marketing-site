// Разметка schema.org для главной. Вставляется в <head> при сборке (scripts/prerender.mjs), в React не рендерится:
// скрипт внутри дерева React ломал бы подключение к готовой разметке (hydrate).
export const professionalService = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Габулян Тигран',
  description: 'Маркетинг для юридических фирм: анализ ниши, сайт и Яндекс Директ',
  url: 'https://gabulyan-tigran.ru',
  telephone: '+79180220901',
  address: { '@type': 'PostalAddress', addressLocality: 'Анапа', addressCountry: 'RU' },
  areaServed: 'RU',
  sameAs: ['https://t.me/tigran_front', 'https://www.instagram.com/tigran_pro_marketing/'],
}
