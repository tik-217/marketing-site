import audience from '../../../shared/assets/images/case-legal-audience-light.avif'
import audienceDark from '../../../shared/assets/images/case-legal-audience-dark.avif'
import competitors from '../../../shared/assets/images/case-legal-competitors-light.avif'
import competitorsDark from '../../../shared/assets/images/case-legal-competitors-dark.avif'
import usp from '../../../shared/assets/images/case-legal-usp-light.avif'
import uspDark from '../../../shared/assets/images/case-legal-usp-dark.avif'
import direct from '../../../shared/assets/images/case-legal-direct.avif'
import metrika from '../../../shared/assets/images/case-legal-metrika.avif'

// Скриншоты для галереи: пока отдельных вертикальных файлов нет, стоят текущие картинки ЦА, конкурентов и УТП.
// Пункт "Каждый клиент видит объявление про свою ситуацию" не выводится, пока не заданы два повода обратиться.
export const legalWalkthrough = {
  title: 'Как реклама новой услуги окупилась минимум в 11 раз за три месяца',
  screens: [
    {
      id: 'analysis',
      label: 'Анализ',
      gallery: [
        { src: audience, srcDark: audienceDark, alt: 'Описание целевой аудитории', caption: 'Сегменты клиентов' },
        { src: competitors, srcDark: competitorsDark, alt: 'Анализ конкурентов', caption: 'Реклама конкурентов' },
        { src: usp, srcDark: uspDark, alt: 'Уникальное торговое предложение', caption: 'Предложение фирмы' },
      ],
      steps: [
        {
          title: 'Беру из рекламы конкурентов то, что уже работает',
          text: 'И добавляю то, чего у них нет. В поиске ваше объявление стоит рядом с конкурентами, и у человека появляется причина выбрать вас',
        },
      ],
    },
    {
      id: 'ads',
      label: 'Реклама и результат',
      steps: [
        {
          image: { src: direct, alt: 'Кампании в кабинете Яндекс Директа' },
          title: 'Реклама видна только тем, кто ищет услугу',
          text: 'Показы в 18 регионах тем, кто ищет, как узаконить постройку. Вы платите за людей, которым нужна услуга',
        },
        {
          image: { src: metrika, alt: 'Конверсии в Яндекс Метрике' },
          title: 'Видно, какая реклама приводит клиентов',
          text: 'Звонки, заявки и письма считаются отдельно, и бюджет переносится туда, откуда приходят обращения',
        },
      ],
    },
  ],
}
