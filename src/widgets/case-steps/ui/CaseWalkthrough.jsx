import { useEffect, useState } from 'react'
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

function GalleryImage({ item, className }) {
  return (
    <>
      <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className={[className, item.srcDark && 'theme-image--light'].filter(Boolean).join(' ')} />
      {item.srcDark && <img src={item.srcDark} alt={item.alt} loading="lazy" decoding="async" className={[className, 'theme-image--dark'].filter(Boolean).join(' ')} />}
    </>
  )
}

/** Три скриншота в ряд одной высоты, по клику или тапу открываются на весь экран. */
function Gallery({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    if (openIndex === null) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpenIndex(null)
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [openIndex])

  const current = openIndex === null ? null : items[openIndex]

  return (
    <>
      <ul className="walk-gallery">
        {items.map((item, index) => (
          <li className="walk-gallery__item" key={item.caption}>
            <button type="button" className="walk-gallery__open" onClick={() => setOpenIndex(index)} aria-label={`Открыть на весь экран: ${item.caption}`}>
              <GalleryImage item={item} className="walk-gallery__image" />
            </button>
            <span className="walk-gallery__caption">{item.caption}</span>
          </li>
        ))}
      </ul>
      {current && (
        <div className="walk-lightbox" role="dialog" aria-modal="true" aria-label={current.caption} onClick={() => setOpenIndex(null)}>
          <button type="button" className="walk-lightbox__close" aria-label="Закрыть" onClick={() => setOpenIndex(null)}>
            ×
          </button>
          <GalleryImage item={current} className="walk-lightbox__image" />
        </div>
      )}
    </>
  )
}

function Screens({ large, walkthrough = legalWalkthrough }) {
  let counter = 0
  return walkthrough.screens.map((screen) => (
    <div className="walk-screen" key={screen.id}>
      <h3 className="walk-screen__label">{screen.label}</h3>
      {screen.gallery && <Gallery items={screen.gallery} />}
      <ol className={large ? 'walk-steps walk-steps--large' : 'walk-steps'}>
        {screen.steps.map((step) => {
          counter += 1
          return (
            <li className="walk-step" key={step.title}>
              {step.image && <StepImage {...step.image} />}
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
