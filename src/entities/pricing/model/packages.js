// Цена рекламы в месяц. Одно значение для модуля, пакетов и страницы /bankrotstvo.
export const adsMonthly = '39 000 ₽'

// Срок запуска рекламы при готовом анализе, рабочих дней.
export const adsLaunchDays = 14

export const packageModules = [
  { id: 'analysis', label: 'Анализ', price: '50 000 ₽' },
  { id: 'ads', label: 'Реклама', price: `${adsMonthly}/мес` },
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
    modulesTotal: '89 000 ₽',
    price: '89 000 ₽',
    monthly: adsMonthly,
    duration: 'около 20',
  },
  {
    id: 'traffic',
    title: 'Трафик',
    situation: 'Сайта нет, нужны заявки',
    includedModules: ['analysis', 'ads', 'site'],
    modulesTotal: '159 000 ₽',
    price: '159 000 ₽',
    monthly: adsMonthly,
    duration: 'около 35',
  },
  {
    id: 'system',
    title: 'Система',
    situation: 'Нужны заявки и место приземления клиентов',
    includedModules: ['analysis', 'ads', 'site', 'telegram'],
    modulesTotal: '229 000 ₽',
    price: '229 000 ₽',
    monthly: '109 000 ₽',
    duration: 'около 42',
  },
  {
    id: 'launch',
    title: 'Запуск с нуля',
    situation: 'Новый бизнес',
    includedModules: ['analysis', 'ads', 'site', 'telegram', 'identity'],
    modulesTotal: '269 000 ₽',
    price: '269 000 ₽',
    monthly: '109 000 ₽',
    duration: 'около 55',
  },
]
