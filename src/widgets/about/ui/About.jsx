import { LoopVideo, Section } from '../../../shared/ui'

const defaultItems = [
  'Анапа. Работаю удаленно со всеми регионами, по договору.',
  'Два юридических проекта в работе прямо сейчас',
  'Больше года продуктовой разработки, в том числе в Сбере.',
  'Юрист по образованию, поэтому понимаю, как устроена практика и как юристы говорят с клиентами',
  'Веду 2-3 проекта одновременно, каждый лично.',
  'Анализ ниши, тексты, прототип, дизайн, верстку и рекламу делаю сам.',
]

/** Видео слева, справа заголовок и список. items меняет список (на /bankrotstvo он короче). */
export function About({ items = defaultItems }) {
  return (
    <Section containerClassName="about">
      <div className="about__body">
        <h2 className="section-heading">Со мной вы работаете напрямую, без менеджера между нами</h2>
        <ul className="about__list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="about__video">
        <LoopVideo className="about__video-el" />
      </div>
    </Section>
  )
}
