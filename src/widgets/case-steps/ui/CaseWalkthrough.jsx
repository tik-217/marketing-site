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

function Screens({ large, walkthrough = legalWalkthrough }) {
  let counter = 0
  return walkthrough.screens.map((screen) => (
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

/** Блок на главной: короткий нумерованный список шагов без картинок. Картинки остаются на странице кейса. */
export function CaseWalkthrough() {
  const steps = legalWalkthrough.screens.flatMap((screen) => screen.steps)
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">{legalWalkthrough.title}</h2>
      <ol className="steps-list">
        {steps.map((step) => (
          <li className="steps-list__item" key={step.title}>
            <span className="steps-list__title">{step.title}</span>
            <span className="steps-list__text">{step.text}</span>
          </li>
        ))}
      </ol>
      <Link to="/cases/legalizaciya-kommercheskih-obektov" className="walk-link">
        Подробно в кейсе <span aria-hidden="true">→</span>
      </Link>
      <p className="walk-footnote">{legalWalkthrough.footnote}</p>
      <CtaButton source="s-case-steps" style={{ alignSelf: 'flex-start' }} />
    </Section>
  )
}

/** Те же шаги на странице кейса, картинки крупнее. */
export function CaseWalkthroughPage({ walkthrough }) {
  return (
    <section className="case-walk">
      <h2 className="case-solution__title">Решение</h2>
      <Screens large walkthrough={walkthrough} />
    </section>
  )
}
