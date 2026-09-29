import caseLegalAudience from '../../../shared/assets/images/case-legal-audience.avif'
import caseLegalBrief from '../../../shared/assets/images/case-legal-brief.avif'
import caseLegalCompetitors from '../../../shared/assets/images/case-legal-competitors.avif'
import caseLegalUsp from '../../../shared/assets/images/case-legal-usp.avif'
import caseLegalDirect from '../../../shared/assets/images/case-legal-direct.avif'
import caseLegalMetrika from '../../../shared/assets/images/case-legal-metrika.avif'
import caseLegalAudienceMobile from '../../../shared/assets/images/case-legal-audience-mobile.png'
import caseLegalBriefMobile from '../../../shared/assets/images/case-legal-brief-mobile.png'
import caseLegalCompetitorsMobile from '../../../shared/assets/images/case-legal-competitors-mobile.png'
import caseLegalUspMobile from '../../../shared/assets/images/case-legal-usp-mobile.png'
import caseLegalDirectMobile from '../../../shared/assets/images/case-legal-direct-mobile.png'
import caseLegalMetrikaMobile from '../../../shared/assets/images/case-legal-metrika-mobile.png'
import caseLegalCover from '../../../shared/assets/images/case-legal-cover.avif'
import caseBankruptcyCover from '../../../shared/assets/images/case-bankruptcy-cover.avif'
import caseBankruptcyBrief from '../../../shared/assets/images/case-bankruptcy-brief.png'
import caseBankruptcyAudience from '../../../shared/assets/images/case-bankruptcy-audience.png'
import caseBankruptcyCompetitors from '../../../shared/assets/images/case-bankruptcy-competitors.png'
import caseBankruptcyUsp from '../../../shared/assets/images/case-bankruptcy-usp.png'
import caseBankruptcyBriefMobile from '../../../shared/assets/images/case-bankruptcy-brief-mobile.png'
import caseBankruptcyAudienceMobile from '../../../shared/assets/images/case-bankruptcy-audience-mobile.png'
import caseBankruptcyCompetitorsMobile from '../../../shared/assets/images/case-bankruptcy-competitors-mobile.png'
import caseBankruptcyUspMobile from '../../../shared/assets/images/case-bankruptcy-usp-mobile.png'
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
          { src: caseLegalBrief, mobileSrc: caseLegalBriefMobile, alt: 'Бриф перед запуском Яндекс Директа', caption: 'Бриф', docHref: documentLinks.legal.brief },
          { src: caseLegalAudience, mobileSrc: caseLegalAudienceMobile, alt: 'Описание целевой аудитории', caption: 'Анализ ЦА', docHref: documentLinks.legal.audience },
          { src: caseLegalCompetitors, mobileSrc: caseLegalCompetitorsMobile, alt: 'Анализ конкурентов', caption: 'Анализ конкурентов', docHref: documentLinks.legal.competitors },
          { src: caseLegalUsp, mobileSrc: caseLegalUspMobile, alt: 'Уникальное торговое предложение', caption: 'УТП', docHref: documentLinks.legal.usp },
        ],
      },
      {
        title: 'Реклама в Яндекс Директе',
        text: 'Запустил кампании и настроил отслеживание конверсий в Яндекс Метрике.',
        images: [
          { src: caseLegalDirect, mobileSrc: caseLegalDirectMobile, alt: 'Кампании в кабинете Яндекс Директа', caption: 'Кампании в Яндекс Директе' },
          { src: caseLegalMetrika, mobileSrc: caseLegalMetrikaMobile, alt: 'Конверсии в Яндекс Метрике', caption: 'Конверсии в Яндекс Метрике' },
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
    status: 'in_progress',
    period: 'в работе',
    scope: ['Маркетинговый анализ'],
    task: 'Запустить продвижение с нуля в нише, где заявки продают поштучно.',
    clientStory: [
      'Ниша банкротства физических лиц — рынок, где заявки продают поштучно. Работа началась с нуля: не было ни прототипа сайта, ни рекламных кампаний.',
    ],
    resultText:
      'Проект в работе. Собран маркетинговый анализ: бриф, портрет аудитории, разбор конкурентов и УТП.',
    solutionSteps: [
      {
        title: 'Маркетинговый анализ',
        text: 'Собрал бриф, описал целевую аудиторию, разобрал конкурентов и сформулировал уникальное торговое предложение.',
        images: [
          { src: caseBankruptcyBrief, mobileSrc: caseBankruptcyBriefMobile, alt: 'Обезличенный бриф по рекламе для банкротства физических лиц', caption: 'Бриф', docHref: documentLinks.bankruptcy.brief },
          { src: caseBankruptcyAudience, mobileSrc: caseBankruptcyAudienceMobile, alt: 'Анализ целевой аудитории для услуги банкротства физических лиц', caption: 'Анализ ЦА', docHref: documentLinks.bankruptcy.audience },
          { src: caseBankruptcyCompetitors, mobileSrc: caseBankruptcyCompetitorsMobile, alt: 'Анализ конкурентов в нише банкротства физических лиц', caption: 'Анализ конкурентов', docHref: documentLinks.bankruptcy.competitors },
          { src: caseBankruptcyUsp, mobileSrc: caseBankruptcyUspMobile, alt: 'Уникальное торговое предложение для услуги банкротства физических лиц', caption: 'УТП', docHref: documentLinks.bankruptcy.usp },
        ],
      },
    ],
    metrics: [],
    description: 'За 14 рабочих дней разобрали клиентов, конкурентов и предложение юридической фирмы. По ним запускаются реклама, сайт и айдентика.',
  },
]
