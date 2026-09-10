const analysis = {
  label: 'Маркетинговый анализ',
  note: 'Бриф, анализ ЦА, анализ конкурентов, анализ ниши, формирование УТП',
}

const site = {
  label: 'Сайт',
  note: 'Копирайтинг, последовательность смысловых блоков, прототип, дизайн, верстка, размещение в интернете',
}

const ads = {
  label: 'Реклама в Яндекс Директе',
  note: 'Семантическое ядро, прототипы объявлений, рекламные баннеры, настройка кампаний, ежедневные отчеты. Продлевается ежемесячно, 30 000 ₽/мес',
}

const identity = {
  label: 'Айдентика',
  note: 'Логотип, фирменный стиль, брендбук, адаптация стиля под площадки',
}

export const packages = [
  {
    id: 'start',
    title: 'Старт',
    oldPrice: '120 000 ₽',
    price: '105 000 ₽',
    items: [analysis, site],
    note: 'Ещё нет ни сайта, ни маркетинга',
    inverse: false,
  },
  {
    id: 'traffic',
    title: 'Трафик',
    oldPrice: '150 000 ₽',
    price: '135 000 ₽',
    items: [analysis, site, ads],
    note: 'Нужны заявки сразу после запуска',
    inverse: true,
  },
  {
    id: 'turnkey',
    title: 'Под ключ',
    oldPrice: '190 000 ₽',
    price: '170 000 ₽',
    items: [analysis, site, ads, identity],
    note: 'Бренд, сайт и реклама для нового бизнеса',
    inverse: false,
  },
]
