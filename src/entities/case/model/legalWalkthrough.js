import { DOC_MOBILE_CROP } from './crops'
import brief from '../../../shared/assets/images/case-legal-brief-light.avif'
import briefDark from '../../../shared/assets/images/case-legal-brief-dark.avif'
import audience from '../../../shared/assets/images/case-legal-audience-light.avif'
import audienceDark from '../../../shared/assets/images/case-legal-audience-dark.avif'
import competitors from '../../../shared/assets/images/case-legal-competitors-light.avif'
import competitorsDark from '../../../shared/assets/images/case-legal-competitors-dark.avif'
import usp from '../../../shared/assets/images/case-legal-usp-light.avif'
import uspDark from '../../../shared/assets/images/case-legal-usp-dark.avif'
import direct from '../../../shared/assets/images/case-legal-direct.avif'
import metrika from '../../../shared/assets/images/case-legal-metrika.avif'

// TODO: когда придут числа от Тиграна, вернуть в заголовки шагов 2, 3, 5 числа сегментов, конкурентов,
// ключевых фраз и минус-слов, а также добавить шаг 7 со скриншотом сообщения клиента и сроком до первой заявки.
// Пока стоят варианты "Без данных" из файла правок.
export const legalWalkthrough = {
  title: 'Что я сделал, чтобы первая заявка пришла в первый же месяц',
  screens: [
    {
      id: 'analysis',
      label: 'Анализ',
      steps: [
        {
          image: { src: brief, srcDark: briefDark, alt: 'Бриф перед запуском Яндекс Директа', mobileCrop: DOC_MOBILE_CROP },
          title: 'Записал задачу в цифрах',
          text: 'Средний чек, сроки и сколько фирма готова платить за одну заявку',
        },
        {
          image: { src: audience, srcDark: audienceDark, alt: 'Описание целевой аудитории', mobileCrop: DOC_MOBILE_CROP },
          title: 'Разделил собственников на 2 типа с разными мотивами',
          text: 'У каждого сегмента свой повод узаконить объект',
        },
        {
          image: { src: competitors, srcDark: competitorsDark, alt: 'Анализ конкурентов', mobileCrop: DOC_MOBILE_CROP },
          title: 'Разобрал объявления конкурентов в Яндекс Директе',
          text: 'Что они обещают и чем объясняют свои преимущества',
        },
        {
          image: { src: usp, srcDark: uspDark, alt: 'Уникальное торговое предложение', mobileCrop: DOC_MOBILE_CROP },
          title: 'Собрал предложение фирмы',
          text: 'Из того, что ищут клиенты и чего нет у конкурентов',
        },
      ],
    },
    {
      id: 'ads',
      label: 'Реклама и результат',
      steps: [
        {
          image: { src: direct, alt: 'Кампании в кабинете Яндекс Директа' },
          title: 'Запустил поиск в 18 регионах',
          text: 'Объявления видят те, кто ищет, как узаконить самовольную постройку',
        },
        {
          image: { src: metrika, alt: 'Конверсии в Яндекс Метрике' },
          title: 'Настроил 3 цели в Метрике',
          text: 'Форма, звонок и письмо считаются отдельно, видно, откуда пришел клиент',
        },
      ],
    },
  ],
  footnote: 'Одна сделка окупила маркетинг минимум в 11 раз за три месяца',
}
