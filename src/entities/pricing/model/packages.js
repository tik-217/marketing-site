export const packageModules = [
  { id: 'analysis', label: 'Анализ', price: '50 000 ₽' },
  { id: 'ads', label: 'Реклама', price: '40 000 ₽/мес' },
  { id: 'site', label: 'Сайт', price: '70 000 ₽' },
  { id: 'telegram', label: 'ТГ-канал', price: '70 000 ₽/мес' },
  { id: 'identity', label: 'Айдентика', price: '40 000 ₽' },
]

export const packages = [
  {
    id: 'direct',
    title: 'Директ',
    situation: 'Сайт есть, заявок мало',
    includedModules: ['analysis', 'ads'],
    modulesTotal: '90 000 ₽',
    price: '82 800 ₽',
    monthly: '40 000 ₽',
    duration: 'около 28',
  },
  {
    id: 'traffic',
    title: 'Трафик',
    situation: 'Сайта нет, нужны заявки',
    includedModules: ['analysis', 'ads', 'site'],
    modulesTotal: '160 000 ₽',
    price: '147 200 ₽',
    monthly: '40 000 ₽',
    duration: 'около 42',
  },
  {
    id: 'system',
    title: 'Система',
    situation: 'Нужны заявки и доверие',
    includedModules: ['analysis', 'ads', 'site', 'telegram'],
    modulesTotal: '230 000 ₽',
    price: '211 600 ₽',
    monthly: '110 000 ₽',
    duration: 'около 42',
  },
  {
    id: 'launch',
    title: 'Запуск с нуля',
    situation: 'Новый бизнес',
    includedModules: ['analysis', 'ads', 'site', 'telegram', 'identity'],
    modulesTotal: '270 000 ₽',
    price: '248 400 ₽',
    monthly: '110 000 ₽',
    duration: 'около 55',
  },
]

export const packageDiscount = {
  title: 'Скидка 8% действует только при заказе пакетом',
  description: 'Услуги можно собрать раздельно, но скидка тогда не сохраняется.',
}
