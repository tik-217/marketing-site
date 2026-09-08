import { Section } from '../../../shared/ui'
import diagram from '../../../shared/assets/images/stages-diagram.avif'
import { stages } from '../model/stages'

export function Solo() {
  return (
    <Section containerClassName="stack">
      <div className="stack" style={{ maxWidth: '62ch' }}>
        <h2 className="section-heading">Смыслы, сайт и трафик делаю лично я</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Сайт делаю сам, потому что до маркетинга три года писал код, два из них коммерчески,
          включая головной офис Сбербанка. Обычно собираю на Tilda, чтобы вы могли зайти и
          поправить текст без меня. Также, могу дособрать сложное через код.
        </p>
      </div>

      <img
        src={diagram}
        alt="Этапы работы: анализ ниши, смыслы, прототип, дизайн, верстка, трафик"
        className="solo__diagram"
      />

      <div className="solo__steps">
        {stages.map((stage) => (
          <div className="solo-step" key={stage.index}>
            <span className="solo-step__index">{stage.index}</span>
            <span className="solo-step__title">{stage.title}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}
