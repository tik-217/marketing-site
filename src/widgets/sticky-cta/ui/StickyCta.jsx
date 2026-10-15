import { useEffect, useState } from 'react'
import { CtaButton } from '../../../shared/ui'

/**
 * Нижняя панель с кнопкой, только на телефоне (до 768 px). Появляется, когда первый экран прокручен,
 * и прячется, пока в зоне видимости форма в конце страницы или подвал.
 */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false)
  const [endVisible, setEndVisible] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined

    const hero = document.querySelector('.hero')
    const ends = [document.getElementById('audit'), document.querySelector('.site-footer')].filter(Boolean)
    const visibleEnds = new Set()

    const heroObserver = hero
      ? new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0))
      : null
    heroObserver?.observe(hero)

    const endObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleEnds.add(entry.target)
        else visibleEnds.delete(entry.target)
      }
      setEndVisible(visibleEnds.size > 0)
    })
    ends.forEach((element) => endObserver.observe(element))

    return () => {
      heroObserver?.disconnect()
      endObserver.disconnect()
    }
  }, [])

  const visible = pastHero && !endVisible

  return (
    <div className={visible ? 'sticky-cta is-visible' : 'sticky-cta'} aria-hidden={!visible}>
      <CtaButton source="s-sticky" block tabIndex={visible ? 0 : -1} />
    </div>
  )
}
