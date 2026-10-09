import { CtaButton, Section } from '../../../shared/ui'

const contractItems = ['Состав работ по каждому этапу', 'Срок каждого этапа', 'Отчет о сделанном']

const refusals = [
  'Нужна гарантия по количеству заявок или возврат денег при отсутствии результата.',
  'Бюджет на проект меньше 50 000 ₽. Если маркетинговый анализ у вас уже есть, порог 40 000 ₽.',
  'Нужна реклама во ВКонтакте. Я работаю только с Яндекс Директом.',
  'Ниша серая или нелегальная.',
]

export function Terms() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Не обещаю выручку. Фиксирую срок каждого этапа в договоре</h2>
      <p className="section-lead">
        Выручка зависит еще от того, как быстро отвечает ваш менеджер и сколько стоит услуга относительно рынка. Этим я не управляю.
      </p>
      <div className="terms-grid">
        <div className="terms-col">
          <h3 className="terms-col__title">Что записано в договоре</h3>
          <ul className="terms-list">
            {contractItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="terms-col__note">
            Гарантия заявок от подрядчика обычно означает завышенный бюджет или оговорку мелким шрифтом.
          </p>
        </div>
        <div className="terms-col">
          <h3 className="terms-col__title">Не возьмусь за проект, если</h3>
          <ul className="terms-list">
            {refusals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <CtaButton source="s-terms" style={{ alignSelf: 'flex-start' }} />
    </Section>
  )
}
