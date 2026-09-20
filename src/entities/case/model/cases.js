import caseLegalAudience from '../../../shared/assets/images/case-legal-audience.avif'
import caseLegalBrief from '../../../shared/assets/images/case-legal-brief.avif'
import caseLegalCompetitors from '../../../shared/assets/images/case-legal-competitors.avif'
import caseLegalUsp from '../../../shared/assets/images/case-legal-usp.avif'
import caseBarsDirect from '../../../shared/assets/images/case-bars-direct.avif'
import caseBarsMetrika from '../../../shared/assets/images/case-bars-metrika.avif'
import casePetrovBrief from '../../../shared/assets/images/case-petrov-brief.avif'
import casePetrovAnalysis from '../../../shared/assets/images/case-petrov-analysis.avif'

// TODO: у карточки банкротства нужны скриншоты Яндекс Метрики и кабинета Директа, срок результата.
export const cases = [
  {
    id: 'legal',
    title: 'Легализация коммерческих объектов',
    slides: [
      { src: caseLegalBrief, alt: 'Бриф перед запуском Яндекс Директа' },
      { src: caseLegalAudience, alt: 'Описание целевой аудитории' },
      { src: caseLegalCompetitors, alt: 'Анализ конкурентов' },
      { src: caseLegalUsp, alt: 'Уникальное торговое предложение' },
      { src: caseBarsDirect, alt: 'Кампании в кабинете Яндекс Директа' },
      { src: caseBarsMetrika, alt: 'Конверсии в Яндекс Метрике' },
    ],
    description:
      'Компания запускала новое направление и не знала, есть ли на него спрос. Первый звонок из Директа принес нового клиента.',
    meta: [
      'Срок: 3 месяца',
      { href: 'https://app.notion.com/p/3e142da791da81758018e68c178af27e?source=copy_link', label: 'Бриф' },
      { href: 'https://app.notion.com/p/3e142da791da81f68d99f284eb547932?source=copy_link', label: 'Анализ ЦА' },
      { href: 'https://app.notion.com/p/3e142da791da81dea645f771f3e9fcf6?source=copy_link', label: 'Анализ конкурентов' },
      { href: 'https://app.notion.com/p/3e142da791da814d957be6bbca5f7288?source=copy_link', label: 'УТП' },
    ],
  },
  {
    id: 'bankruptcy',
    title: 'Банкротство физлиц, Александр Петров',
    slides: [
      { src: casePetrovBrief, alt: 'Бриф по рекламе для банкротства физлиц' },
      { src: casePetrovAnalysis, alt: 'Анализ целевой аудитории, банкротство физических лиц' },
    ],
    description: 'Запуск рекламы в Директе с нуля в нише, где рынок продает заявки поштучно. В работе.',
    meta: [
      'Срок: в работе',
      { href: 'https://app.notion.com/p/3d742da791da8084b0afce388482a84a?source=copy_link', label: 'Анализ ЦА' },
      { href: 'https://app.notion.com/p/3e142da791da81a29180fdf4d441731f?source=copy_link', label: 'Бриф' },
    ],
  },
]
