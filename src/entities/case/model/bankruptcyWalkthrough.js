import { DOC_MOBILE_CROP } from './crops'
import brief from '../../../shared/assets/images/case-bankruptcy-brief-light.avif'
import briefDark from '../../../shared/assets/images/case-bankruptcy-brief-dark.avif'
import audience from '../../../shared/assets/images/case-bankruptcy-audience-light.avif'
import audienceDark from '../../../shared/assets/images/case-bankruptcy-audience-dark.avif'
import competitors from '../../../shared/assets/images/case-bankruptcy-competitors-light.avif'
import competitorsDark from '../../../shared/assets/images/case-bankruptcy-competitors-dark.avif'
import usp from '../../../shared/assets/images/case-bankruptcy-usp-light.avif'
import uspDark from '../../../shared/assets/images/case-bankruptcy-usp-dark.avif'

// Шаги кейса по банкротству в том же формате, что и у легализации. Чисел нет: в файле правок их не дали.
export const bankruptcyWalkthrough = {
  screens: [
    {
      id: 'analysis',
      label: 'Анализ',
      steps: [
        {
          image: { src: brief, srcDark: briefDark, alt: 'Обезличенный бриф по рекламе для банкротства физических лиц', mobileCrop: DOC_MOBILE_CROP },
          title: 'Собрал бриф по рекламе',
          text: 'Задача фирмы и вопросы, которые нужно закрыть до запуска',
        },
        {
          image: { src: audience, srcDark: audienceDark, alt: 'Анализ целевой аудитории для услуги банкротства физических лиц', mobileCrop: DOC_MOBILE_CROP },
          title: 'Разделил запросы клиентов на 5 типов',
          text: 'У каждого типа свой повод обратиться',
        },
        {
          image: { src: competitors, srcDark: competitorsDark, alt: 'Анализ конкурентов в нише банкротства физических лиц', mobileCrop: DOC_MOBILE_CROP },
          title: 'Разобрал конкурентов по одинаковым параметрам',
          text: 'Что они предлагают и чем отличаются друг от друга',
        },
        {
          image: { src: usp, srcDark: uspDark, alt: 'Уникальное торговое предложение для услуги банкротства физических лиц', mobileCrop: DOC_MOBILE_CROP },
          title: 'Сформулировал торговое предложение',
          text: 'Чем фирма отличается от других и почему выбрать ее',
        },
      ],
    },
  ],
}
