import { Section } from '../../../shared/ui'
import portrait from '../../../shared/assets/images/tigran-portrait.avif'

export function About() {
  return (
    <Section containerClassName="about">
      <img src={portrait} alt="Габулян Тигран" className="about__media" />
      <div className="about__body">
        <h2 className="section-heading">Вы работаете лично со мной</h2>
        <p>Меня зовут Тигран, я из Анапы. Работаю удаленно со всеми регионами, по договору, налог на профессиональный доход.</p>
        <p>Два года в маркетинге. До этого три года фронтенд-разработки, два из них коммерчески, включая головной офис Сбербанка.</p>
        <p>Веду 2-3 проекта одновременно.</p>
      </div>
    </Section>
  )
}
