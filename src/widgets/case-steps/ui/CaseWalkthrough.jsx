import { Link } from 'react-router-dom'
import { legalWalkthrough } from '../../../entities/case'
import { CropPicture, CtaButton, Section } from '../../../shared/ui'

function StepImage({ src, srcDark, alt, crop, mobileCrop }) {
  if (crop || mobileCrop) {
    return (
      <span className="walk-step__image">
        <CropPicture src={src} srcDark={srcDark} alt={alt} crop={crop} mobileCrop={mobileCrop} />
      </span>
    )
  }
  return (
    <span className="walk-step__image">
      <img src={src} alt={alt} loading="lazy" decoding="async" className={srcDark ? 'theme-image--light' : undefined} />
      {srcDark && <img src={srcDark} alt={alt} loading="lazy" decoding="async" className="theme-image--dark" />}
    </span>
  )
}

function Screens({ large }) {
  let counter = 0
  return legalWalkthrough.screens.map((screen) => (
    <div className="walk-screen" key={screen.id}>
      <h3 className="walk-screen__label">{screen.label}</h3>
      <ol className={large ? 'walk-steps walk-steps--large' : 'walk-steps'}>
        {screen.steps.map((step) => {
          counter += 1
          return (
            <li className="walk-step" key={step.title}>
              <StepImage {...step.image} />
              <p className="walk-step__title">
                <span className="walk-step__num">{counter}</span>
                {step.title}
              </p>
              <p className="walk-step__text">{step.text}</p>
            </li>
          )
        })}
      </ol>
    </div>
  ))
}

/** Блок на главной: кейс по легализации шагами. */
export function CaseWalkthrough() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">{legalWalkthrough.title}</h2>
      <Screens />
      <p className="walk-footnote">{legalWalkthrough.footnote}</p>
      <Link to="/cases/legalizaciya-kommercheskih-obektov" className="walk-link">
        Читать кейс полностью <span aria-hidden="true">→</span>
      </Link>
      <CtaButton source="s-case-steps" style={{ alignSelf: 'flex-start' }} />
    </Section>
  )
}

/** Те же шаги на странице кейса, картинки крупнее. */
export function CaseWalkthroughPage() {
  return (
    <section className="case-walk">
      <h2 className="case-solution__title">Решение</h2>
      <Screens large />
    </section>
  )
}
