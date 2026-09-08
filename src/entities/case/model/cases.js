import caseBars from '../../../shared/assets/images/case-bars.avif'
import caseGlendale from '../../../shared/assets/images/case-glendale.avif'
import caseLilart from '../../../shared/assets/images/case-lilart.avif'
import casePetrov from '../../../shared/assets/images/case-petrov.avif'

export const cases = [
  {
    id: 'bars',
    title: 'Bars Pravo, юридические услуги',
    image: caseBars,
    description:
      'Компания запускала новое направление и не знала, есть ли на него спрос. Первый звонок из Директа принес нового клиента.',
    meta: [{ href: 'https://bars-pravo.ru', label: 'bars-pravo.ru' }, 'Срок: 3 месяца'],
  },
  {
    id: 'glendale',
    title: 'Glendale, гостевой дом в Анапе',
    image: caseGlendale,
    description:
      'Гостевого дома не было в интернете вообще, ни сайта, ни карточек, ни рекламы. Собрал сайт, настроил поисковую и тематическую рекламу, добавил ретаргетинг. За два месяца 46 заявок по 841 ₽.',
    meta: [{ href: 'https://hotel-glendale.ru', label: 'hotel-glendale.ru' }, 'Срок: два месяца'],
  },
  {
    id: 'lilart',
    title: 'LilArt, инженерная сантехника',
    image: caseLilart,
    description:
      'Все продажи держались на магазине в Ozon. Был риск потери площадки, а это означала потерять единственный источник продаж. Собираю собственный канал трафика на их магазин. В работе.',
    meta: ['В работе', 'Срок: в работе'],
  },
  {
    id: 'petrov',
    title: 'Банкротство, Александр Петров',
    image: casePetrov,
    description: 'Запуск направления с нуля в нише, где рынок продает заявки поштучно. В работе.',
    meta: ['В работе', 'Срок: в работе'],
  },
]
