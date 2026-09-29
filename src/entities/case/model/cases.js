import caseLegalBriefLight from '../../../shared/assets/images/case-legal-brief-light.avif'
import caseLegalBriefDark from '../../../shared/assets/images/case-legal-brief-dark.avif'
import caseLegalAudienceLight from '../../../shared/assets/images/case-legal-audience-light.avif'
import caseLegalAudienceDark from '../../../shared/assets/images/case-legal-audience-dark.avif'
import caseLegalCompetitorsLight from '../../../shared/assets/images/case-legal-competitors-light.avif'
import caseLegalCompetitorsDark from '../../../shared/assets/images/case-legal-competitors-dark.avif'
import caseLegalUspLight from '../../../shared/assets/images/case-legal-usp-light.avif'
import caseLegalUspDark from '../../../shared/assets/images/case-legal-usp-dark.avif'
import caseLegalDirect from '../../../shared/assets/images/case-legal-direct.avif'
import caseLegalMetrika from '../../../shared/assets/images/case-legal-metrika.avif'
import caseLegalCover from '../../../shared/assets/images/case-legal-cover.avif'
import caseBankruptcyCover from '../../../shared/assets/images/case-bankruptcy-cover.avif'
import caseBankruptcyBriefLight from '../../../shared/assets/images/case-bankruptcy-brief-light.avif'
import caseBankruptcyBriefDark from '../../../shared/assets/images/case-bankruptcy-brief-dark.avif'
import caseBankruptcyAudienceLight from '../../../shared/assets/images/case-bankruptcy-audience-light.avif'
import caseBankruptcyAudienceDark from '../../../shared/assets/images/case-bankruptcy-audience-dark.avif'
import caseBankruptcyCompetitorsLight from '../../../shared/assets/images/case-bankruptcy-competitors-light.avif'
import caseBankruptcyCompetitorsDark from '../../../shared/assets/images/case-bankruptcy-competitors-dark.avif'
import caseBankruptcyUspLight from '../../../shared/assets/images/case-bankruptcy-usp-light.avif'
import caseBankruptcyUspDark from '../../../shared/assets/images/case-bankruptcy-usp-dark.avif'
import { documentLinks } from '../../../shared/config/documentLinks'

// TODO: под ссылками "Бриф", "Анализ ЦА", "Анализ конкурентов", "УТП" нужна одна находка из каждого документа.
// TODO: у второго кейса добавить цифру по обращениям после первого месяца рекламы, тогда вернуть фразу про тестовый период.
export const cases = [
  {
    id: 'legal',
    slug: 'legalizaciya-kommercheskih-obektov',
    title: 'Легализация коммерческих объектов',
    niche: 'Юридические услуги',
    orderedService: 'Пакет Директ',
    cover: { src: caseLegalCover, alt: 'Складской комплекс — коммерческий объект под легализацию' },
    gallery: [
      { light: caseLegalCover, alt: 'Складской комплекс — коммерческий объект под легализацию' },
      { light: caseLegalBriefLight, dark: caseLegalBriefDark, alt: 'Бриф перед запуском Яндекс Директа' },
      { light: caseLegalAudienceLight, dark: caseLegalAudienceDark, alt: 'Описание целевой аудитории' },
      { light: caseLegalCompetitorsLight, dark: caseLegalCompetitorsDark, alt: 'Анализ конкурентов' },
      { light: caseLegalUspLight, dark: caseLegalUspDark, alt: 'Уникальное торговое предложение' },      { light: caseLegalDirect, alt: 'Кампании в кабинете Яндекс Директа' },
      { light: caseLegalMetrika, alt: 'Конверсии в Яндекс Метрике' },
    ],
    status: 'in_progress',
    period: '3 месяца',
    scope: ['Маркетинговый анализ', 'Реклама в Яндекс Директе'],
    task: 'Проверить спрос на новое направление и получить первые обращения.',
    clientStory: [
      'Новое направление без проверенного спроса — легализация коммерческих объектов. Нужно было понять, ищут ли услугу в Яндексе, и получить первые обращения.',
    ],
    resultText:
      '3-й месяц работы. Одна сделка окупила маркетинг минимум в 11 раз за три месяца.',
    solutionSteps: [
      {
        title: 'Маркетинговый анализ',
        text: 'Собрал бриф, описал целевую аудиторию, разобрал конкурентов и сформулировал уникальное торговое предложение.',
        images: [
          { src: caseLegalBriefLight, srcDark: caseLegalBriefDark, wide: true, alt: 'Бриф перед запуском Яндекс Директа', caption: 'Бриф', docHref: documentLinks.legal.brief },
          { src: caseLegalAudienceLight, srcDark: caseLegalAudienceDark, wide: true, alt: 'Описание целевой аудитории', caption: 'Анализ ЦА', docHref: documentLinks.legal.audience },
          { src: caseLegalCompetitorsLight, srcDark: caseLegalCompetitorsDark, wide: true, alt: 'Анализ конкурентов', caption: 'Анализ конкурентов', docHref: documentLinks.legal.competitors },
          { src: caseLegalUspLight, srcDark: caseLegalUspDark, wide: true, alt: 'Уникальное торговое предложение', caption: 'УТП', docHref: documentLinks.legal.usp },
        ],
      },
      {
        title: 'Реклама в Яндекс Директе',
        text: 'Запустил кампании и настроил отслеживание конверсий в Яндекс Метрике.',
        images: [
          { src: caseLegalDirect, wide: true, alt: 'Кампании в кабинете Яндекс Директа', caption: 'Кампании в Яндекс Директе' },
          { src: caseLegalMetrika, wide: true, alt: 'Конверсии в Яндекс Метрике', caption: 'Конверсии в Яндекс Метрике' },
        ],
      },
    ],
    metrics: [],
    description:
      'Пришла 1 квалифицированная заявка в первый же месяц в нише, где запросов в месяц единицы. Только 1 сделка окупила маркетинг минимум в 11 раз за три месяца.',
  },
  {
    id: 'bankruptcy',
    slug: 'bankrotstvo-fizicheskih-lic',
    title: 'Банкротство физических лиц',
    niche: 'Списание долгов',
    orderedService: 'Модуль 0. Маркетинговый анализ',
    cover: { src: caseBankruptcyCover, alt: 'Документы и расчеты по делу о банкротстве физического лица' },
    gallery: [
      { light: caseBankruptcyCover, alt: 'Документы и расчеты по делу о банкротстве физического лица' },
      { light: caseBankruptcyBriefLight, dark: caseBankruptcyBriefDark, alt: 'Обезличенный бриф по рекламе для банкротства физических лиц' },
      { light: caseBankruptcyAudienceLight, dark: caseBankruptcyAudienceDark, alt: 'Анализ целевой аудитории для услуги банкротства физических лиц' },
      { light: caseBankruptcyCompetitorsLight, dark: caseBankruptcyCompetitorsDark, alt: 'Анализ конкурентов в нише банкротства физических лиц' },
      { light: caseBankruptcyUspLight, dark: caseBankruptcyUspDark, alt: 'Уникальное торговое предложение для услуги банкротства физических лиц' },
    ],
    status: 'done',
    period: '14 рабочих дней',
    scope: ['Маркетинговый анализ'],
    task: 'Запустить продвижение с нуля в нише, где заявки продают поштучно.',
    clientStory: [
      'Ниша банкротства физических лиц — рынок, где заявки продают поштучно. Работа началась с нуля: не было ни прототипа сайта, ни рекламных кампаний.',
    ],
    resultText:
      'Собран маркетинговый анализ: бриф, портрет аудитории, разбор конкурентов и УТП.',
    solutionSteps: [
      {
        title: 'Маркетинговый анализ',
        text: 'Собрал бриф, описал целевую аудиторию, разобрал конкурентов и сформулировал уникальное торговое предложение.',
        images: [
          { src: caseBankruptcyBriefLight, srcDark: caseBankruptcyBriefDark, wide: true, alt: 'Обезличенный бриф по рекламе для банкротства физических лиц', caption: 'Бриф', docHref: documentLinks.bankruptcy.brief },
          { src: caseBankruptcyAudienceLight, srcDark: caseBankruptcyAudienceDark, wide: true, alt: 'Анализ целевой аудитории для услуги банкротства физических лиц', caption: 'Анализ ЦА', docHref: documentLinks.bankruptcy.audience },
          { src: caseBankruptcyCompetitorsLight, srcDark: caseBankruptcyCompetitorsDark, wide: true, alt: 'Анализ конкурентов в нише банкротства физических лиц', caption: 'Анализ конкурентов', docHref: documentLinks.bankruptcy.competitors },
          { src: caseBankruptcyUspLight, srcDark: caseBankruptcyUspDark, wide: true, alt: 'Уникальное торговое предложение для услуги банкротства физических лиц', caption: 'УТП', docHref: documentLinks.bankruptcy.usp },
        ],
      },
    ],
    metrics: [],
    description: 'За 14 рабочих дней разобрали клиентов, конкурентов и предложение юридической фирмы. По ним запускаются реклама, сайт и айдентика.',
  },
]
