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
import caseBankruptcyBriefLight from '../../../shared/assets/images/case-bankruptcy-brief-light.avif'
import caseBankruptcyBriefDark from '../../../shared/assets/images/case-bankruptcy-brief-dark.avif'
import caseBankruptcyAudienceLight from '../../../shared/assets/images/case-bankruptcy-audience-light.avif'
import caseBankruptcyAudienceDark from '../../../shared/assets/images/case-bankruptcy-audience-dark.avif'
import caseBankruptcyCompetitorsLight from '../../../shared/assets/images/case-bankruptcy-competitors-light.avif'
import caseBankruptcyCompetitorsDark from '../../../shared/assets/images/case-bankruptcy-competitors-dark.avif'
import caseBankruptcyUspLight from '../../../shared/assets/images/case-bankruptcy-usp-light.avif'
import caseBankruptcyUspDark from '../../../shared/assets/images/case-bankruptcy-usp-dark.avif'
import { AUDIENCE_LEGAL_CROP, COMPETITORS_LEGAL_CROP, DOC_CROP, DIRECT_CROP, METRIKA_CROP } from './crops'
import { documentLinks } from '../../../shared/config/documentLinks'

// TODO: под ссылками "Бриф", "Анализ ЦА", "Анализ конкурентов", "УТП" нужна одна находка из каждого документа.
// TODO: у второго кейса добавить цифру по обращениям после первого месяца рекламы, тогда вернуть фразу про тестовый период.
export const cases = [
  {
    id: 'legal',
    slug: 'legalizaciya-kommercheskih-obektov',
    title: 'Легализация коммерческих объектов',
    pageTitle: 'Одна сделка окупила маркетинг минимум в 11 раз за три месяца',
    keyFacts: [],
    firstLeadLine: 'Первая заявка в первый же месяц работы',
    niche: 'Юридические услуги',
    orderedService: 'Анализ и Директ',
    eyebrow: 'Легализация коммерческих объектов',
    cover: { src: caseLegalBriefLight, srcDark: caseLegalBriefDark, alt: 'Бриф перед запуском Яндекс Директа' },
    gallery: [
      { light: caseLegalBriefLight, dark: caseLegalBriefDark, alt: 'Бриф перед запуском Яндекс Директа', crop: DOC_CROP },
      { light: caseLegalAudienceLight, dark: caseLegalAudienceDark, alt: 'Описание целевой аудитории', crop: AUDIENCE_LEGAL_CROP },
      { light: caseLegalCompetitorsLight, dark: caseLegalCompetitorsDark, alt: 'Анализ конкурентов', crop: COMPETITORS_LEGAL_CROP },
      { light: caseLegalUspLight, dark: caseLegalUspDark, alt: 'Уникальное торговое предложение', crop: DOC_CROP },
      { light: caseLegalDirect, alt: 'Кампании в кабинете Яндекс Директа', crop: DIRECT_CROP },
      { light: caseLegalMetrika, alt: 'Конверсии в Яндекс Метрике', crop: METRIKA_CROP },
    ],
    status: 'in_progress',
    period: '3 месяца',
    scope: ['Маркетинговый анализ', 'Реклама в Яндекс Директе'],
    clientStory: [
      'Фирма открыла новое направление, легализацию коммерческих объектов. Никто не знал, ищут ли такую услугу в Яндексе. Нужно было проверить спрос и получить первые обращения.',
    ],
    resultText: '3-й месяц работы. Одна сделка окупила маркетинг минимум в 11 раз за три месяца.',
    solutionSteps: [
      {
        title: 'Маркетинговый анализ',
        text: 'Собрал бриф, описал целевую аудиторию, разобрал конкурентов и сформулировал уникальное торговое предложение.',
        images: [
          { src: caseLegalBriefLight, srcDark: caseLegalBriefDark, wide: true, alt: 'Бриф перед запуском Яндекс Директа', caption: 'Бриф', docHref: documentLinks.legal.brief },
          { src: caseLegalAudienceLight, srcDark: caseLegalAudienceDark, wide: true, alt: 'Описание целевой аудитории', caption: 'Анализ аудитории', docHref: documentLinks.legal.audience },
          { src: caseLegalCompetitorsLight, srcDark: caseLegalCompetitorsDark, wide: true, alt: 'Анализ конкурентов', caption: 'Анализ конкурентов', docHref: documentLinks.legal.competitors },
          { src: caseLegalUspLight, srcDark: caseLegalUspDark, wide: true, alt: 'Уникальное торговое предложение', caption: 'Торговое предложение', docHref: documentLinks.legal.usp },
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
    description: [
      'Первая заявка в первый же месяц работы',
      'Одна сделка окупила маркетинг минимум в 11 раз за три месяца',
    ],
  },
  {
    id: 'bankruptcy',
    slug: 'bankrotstvo-fizicheskih-lic',
    title: 'Банкротство физических лиц',
    pageTitle: 'Анализ ниши для юридической фирмы за 14 рабочих дней',
    niche: 'Списание долгов',
    orderedService: 'Маркетинговый анализ',
    eyebrow: 'Банкротство физических лиц',
    cover: { src: caseBankruptcyAudienceLight, srcDark: caseBankruptcyAudienceDark, alt: 'Анализ целевой аудитории для услуги банкротства физических лиц' },
    gallery: [
      { light: caseBankruptcyAudienceLight, dark: caseBankruptcyAudienceDark, alt: 'Анализ целевой аудитории для услуги банкротства физических лиц', crop: DOC_CROP },
      { light: caseBankruptcyBriefLight, dark: caseBankruptcyBriefDark, alt: 'Обезличенный бриф по рекламе для банкротства физических лиц', crop: DOC_CROP },
      { light: caseBankruptcyCompetitorsLight, dark: caseBankruptcyCompetitorsDark, alt: 'Анализ конкурентов в нише банкротства физических лиц', crop: DOC_CROP },
      { light: caseBankruptcyUspLight, dark: caseBankruptcyUspDark, alt: 'Уникальное торговое предложение для услуги банкротства физических лиц', crop: DOC_CROP },
    ],
    status: 'done',
    period: '14 рабочих дней',
    scope: ['Маркетинговый анализ'],
    clientStory: [
      'В банкротстве физических лиц заявки продают поштучно. Фирма начинала с нуля, без прототипа сайта и рекламных кампаний.',
    ],
    resultText:
      'Анализ сдан за 14 рабочих дней. По нему запускаются реклама, сайт и айдентика, результаты добавлю после запуска.',
    solutionSteps: [
      {
        title: 'Маркетинговый анализ',
        text: 'Собрал бриф, описал целевую аудиторию, разобрал конкурентов и сформулировал уникальное торговое предложение.',
        images: [
          { src: caseBankruptcyBriefLight, srcDark: caseBankruptcyBriefDark, wide: true, alt: 'Обезличенный бриф по рекламе для банкротства физических лиц', caption: 'Бриф', docHref: documentLinks.bankruptcy.brief },
          { src: caseBankruptcyAudienceLight, srcDark: caseBankruptcyAudienceDark, wide: true, alt: 'Анализ целевой аудитории для услуги банкротства физических лиц', caption: 'Анализ аудитории', docHref: documentLinks.bankruptcy.audience },
          { src: caseBankruptcyCompetitorsLight, srcDark: caseBankruptcyCompetitorsDark, wide: true, alt: 'Анализ конкурентов в нише банкротства физических лиц', caption: 'Анализ конкурентов', docHref: documentLinks.bankruptcy.competitors },
          { src: caseBankruptcyUspLight, srcDark: caseBankruptcyUspDark, wide: true, alt: 'Уникальное торговое предложение для услуги банкротства физических лиц', caption: 'Торговое предложение', docHref: documentLinks.bankruptcy.usp },
        ],
      },
    ],
    metrics: [],
    description:
      'За 14 рабочих дней разобрали клиентов, конкурентов и предложение юридической фирмы. По ним запускаются реклама, сайт и айдентика.',
  },
]
