// Тарифы на главной и на /bankrotstvo. Реклама стоит одинаково на обеих страницах.
export const adsMonthly = '39 000 ₽'
export const adsLaunchDays = 20

const withAds = `первый месяц рекламы включен, дальше ${adsMonthly} в месяц`
const adsItems = ['Семантика, объявления и баннеры', 'Настройка и ведение кампаний', 'Отчеты каждую неделю']

export const homeTariffs = [
  {
    id: 'direct',
    name: 'Реклама в Яндекс Директе',
    price: adsMonthly,
    note: 'в месяц',
    items: adsItems,
    term: `Запуск примерно через ${adsLaunchDays} рабочих дней`,
  },
  {
    id: 'site',
    name: 'Сайт',
    price: '70 000 ₽',
    items: ['Тексты, прототип и дизайн', 'Верстка и подключение заявок'],
    term: 'Готовность примерно через 38 рабочих дней',
  },
  {
    id: 'site-ads',
    name: 'Сайт и реклама',
    price: '109 000 ₽',
    note: withAds,
    items: ['Все, что входит в тарифы Сайт и Реклама в Яндекс Директе'],
    term: 'Запуск примерно через 38 рабочих дней',
  },
]

export const bankruptcyTariffs = [
  {
    id: 'reklama',
    name: 'Реклама',
    price: adsMonthly,
    note: 'в месяц',
    items: adsItems,
    term: `Запуск примерно через ${adsLaunchDays} рабочих дней`,
    recommended: true,
  },
  {
    id: 'lending',
    name: 'Лендинг и реклама',
    price: '109 000 ₽',
    note: withAds,
    items: ['Все, что входит в тариф Реклама', 'Лендинг под банкротство'],
    term: 'Запуск примерно через 35 рабочих дней',
  },
]
