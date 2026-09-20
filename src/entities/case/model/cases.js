import caseLegalAudience from '../../../shared/assets/images/case-legal-audience.avif'
import caseLegalBrief from '../../../shared/assets/images/case-legal-brief.avif'
import caseLegalCompetitors from '../../../shared/assets/images/case-legal-competitors.avif'
import caseLegalUsp from '../../../shared/assets/images/case-legal-usp.avif'
import caseLegalDirect from '../../../shared/assets/images/case-legal-direct.avif'
import caseLegalMetrika from '../../../shared/assets/images/case-legal-metrika.avif'
import caseBankruptcyBrief from '../../../shared/assets/images/case-bankruptcy-brief.png'
import caseBankruptcyAudience from '../../../shared/assets/images/case-bankruptcy-audience.png'
import caseBankruptcyCompetitors from '../../../shared/assets/images/case-bankruptcy-competitors.png'
import caseBankruptcyUsp from '../../../shared/assets/images/case-bankruptcy-usp.png'
import { documentLinks } from '../../../shared/config/documentLinks'

export const cases = [
  {
    id: 'legal',
    title: 'Легализация коммерческих объектов',
    slides: [
      { src: caseLegalBrief, alt: 'Бриф перед запуском Яндекс Директа' },
      { src: caseLegalAudience, alt: 'Описание целевой аудитории' },
      { src: caseLegalCompetitors, alt: 'Анализ конкурентов' },
      { src: caseLegalUsp, alt: 'Уникальное торговое предложение' },
      { src: caseLegalDirect, alt: 'Кампании в кабинете Яндекс Директа' },
      { src: caseLegalMetrika, alt: 'Конверсии в Яндекс Метрике' },
    ],
    description:
      'Компания запускала новое направление и не знала, есть ли на него спрос. Первый звонок из Директа принес нового клиента.',
    meta: [
      'Срок: 3 месяца. В работе',
      { href: documentLinks.legal.brief, label: 'Бриф' },
      { href: documentLinks.legal.audience, label: 'Анализ ЦА' },
      { href: documentLinks.legal.competitors, label: 'Анализ конкурентов' },
      { href: documentLinks.legal.usp, label: 'УТП' },
    ],
  },
  {
    id: 'bankruptcy',
    title: 'Банкротство физических лиц',
    slides: [
      { src: caseBankruptcyBrief, alt: 'Обезличенный бриф по рекламе для банкротства физических лиц' },
      { src: caseBankruptcyAudience, alt: 'Анализ целевой аудитории для услуги банкротства физических лиц' },
      { src: caseBankruptcyCompetitors, alt: 'Анализ конкурентов в нише банкротства физических лиц' },
      { src: caseBankruptcyUsp, alt: 'Уникальное торговое предложение для услуги банкротства физических лиц' },
    ],
    description: 'Запуск рекламы в Директе с нуля в нише, где рынок продает заявки поштучно. В работе.',
    meta: [
      'Срок: в работе',
      { href: documentLinks.bankruptcy.brief, label: 'Бриф' },
      { href: documentLinks.bankruptcy.audience, label: 'Анализ ЦА' },
      { href: documentLinks.bankruptcy.competitors, label: 'Анализ конкурентов' },
      { href: documentLinks.bankruptcy.usp, label: 'УТП' },
    ],
  },
]
