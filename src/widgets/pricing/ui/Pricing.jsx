import { useLayoutEffect, useRef, useState } from 'react'
import { modules, packageDiscount, packageModules, packages } from '../../../entities/pricing'
import { CtaButton, Section } from '../../../shared/ui'
import { moduleSource } from '../../../shared/lib/telegramSource'
import { PackageComparison } from './PackageComparison'

export function Pricing() {
  const [tab, setTab] = useState('modules')
  const [openModuleId, setOpenModuleId] = useState(null)
  const moduleRefs = useRef(new Map())
  const pendingScrollId = useRef(null)

  useLayoutEffect(() => {
    if (!pendingScrollId.current || pendingScrollId.current !== openModuleId) return undefined

    const moduleElement = moduleRefs.current.get(openModuleId)
    pendingScrollId.current = null

    const frame = window.requestAnimationFrame(() => {
      moduleElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [openModuleId])

  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Любая услуга начинается с маркетингового анализа</h2>
      <div className="stack" style={{ gap: 'var(--space-3)', maxWidth: '62ch' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Модуль 0, маркетинговый анализ, входит в любой проект. Бриф по вашему бизнесу, анализ
          целевой аудитории, анализ конкурентов, анализ ниши и УТП. Это делается всегда, даже если
          вы заказали только рекламу. Реклама, собранная без разбора аудитории, откручивает бюджет
          на людей, которым продукт не нужен.
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          К модулю 0 добавляется модуль под задачу. Каждый модуль включает анализ и свою часть
          работы. Телеграм-канал, презентации и КП делаю отдельно, по запросу.
        </p>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={tab === 'modules' ? 'tab is-active' : 'tab'}
          onClick={() => setTab('modules')}
        >
          Модули
        </button>
        <button
          type="button"
          className={tab === 'packages' ? 'tab is-active' : 'tab'}
          onClick={() => setTab('packages')}
        >
          Пакеты
        </button>
      </div>

      {tab === 'modules' ? (
        <div className="pricing-table">
          {modules.map((module) => {
            const isOpen = openModuleId === module.id
            const panelId = `module-${module.id}-details`

            return (
              <section
                className={isOpen ? 'pricing-row is-open' : 'pricing-row'}
                key={module.id}
                ref={(element) => {
                  if (element) moduleRefs.current.set(module.id, element)
                  else moduleRefs.current.delete(module.id)
                }}
              >
                <button
                  type="button"
                  className="pricing-row__summary"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => {
                    const nextModuleId = isOpen ? null : module.id
                    pendingScrollId.current = nextModuleId
                    setOpenModuleId(nextModuleId)
                  }}
                >
                  <span className="pricing-row__heading">
                    <span className="pricing-row__title">{module.title}</span>
                    {module.duration && <span className="pricing-row__duration">{module.duration}</span>}
                  </span>
                  <span className="pricing-row__price">{module.price}</span>
                  <span className="pricing-row__toggle" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="pricing-row__panel" id={panelId}>
                    <p className="pricing-row__note">{module.description}</p>
                    {module.phases ? (
                      <div className="pricing-phases">
                        {module.phases.map((phase) => (
                          <section className="pricing-phase" key={phase.title}>
                            <header className="pricing-phase__header">
                              <h3 className="pricing-phase__title">{phase.title}</h3>
                              <span className="pricing-phase__days">{phase.days}</span>
                            </header>
                            <div className="pricing-phase__steps">
                              {phase.steps.map((step) => (
                                <article className="pricing-step" key={step.number}>
                                  <div className="pricing-step__heading">
                                    <h4 className="pricing-step__title">
                                      {step.number}. {step.title}
                                    </h4>
                                    {step.days && <span className="pricing-step__days">{step.days}</span>}
                                  </div>
                                  <p className="pricing-step__description">{step.description}</p>
                                  {step.includes && (
                                    <p className="pricing-step__meta">
                                      <strong>Внутри</strong> {step.includes}
                                    </p>
                                  )}
                                  {step.result && (
                                    <p className="pricing-step__result">
                                      <strong>Результат.</strong> {step.result}
                                    </p>
                                  )}
                                </article>
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    ) : (
                      <div className="pricing-row__details">
                        {module.groups.map((group, index) => (
                          <article className="pricing-detail" key={group.title}>
                            <span className="pricing-detail__index">{String(index + 1).padStart(2, '0')}</span>
                            <h3 className="pricing-detail__title">{group.title}</h3>
                            <ul className="pricing-detail__list">
                              {group.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </article>
                        ))}
                      </div>
                    )}
                    {module.outcome && (
                      <aside className="pricing-outcome">
                        <div>
                          <h3 className="pricing-outcome__title">{module.outcome.title}</h3>
                          <p>{module.outcome.description}</p>
                        </div>
                        <div className="pricing-outcome__terms">
                          <h3>{module.outcome.termsTitle}</h3>
                          <p>{module.outcome.terms}</p>
                        </div>
                      </aside>
                    )}
                    {module.footerBlocks && (
                      <aside className="pricing-outcome pricing-outcome--details">
                        {module.footerBlocks.map((block) => (
                          <div key={block.title}>
                            <h3 className="pricing-outcome__title">{block.title}</h3>
                            <p>{block.description}</p>
                          </div>
                        ))}
                      </aside>
                    )}
                    <CtaButton className="pricing-cta" source={moduleSource(module.id)} />
                  </div>
                )}
              </section>
            )
          })}
        </div>
      ) : (
        <PackageComparison modules={packageModules} packages={packages} discount={packageDiscount} />
      )}

    </Section>
  )
}
