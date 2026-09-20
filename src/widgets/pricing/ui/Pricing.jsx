import { useState } from 'react'
import { modules, packages } from '../../../entities/pricing'
import { Section } from '../../../shared/ui'
import { documentLinks } from '../../../shared/config/documentLinks'
import { PackageCard } from './PackageCard'

export function Pricing() {
  const [tab, setTab] = useState('modules')

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
          <div className="pricing-table__head">
            <span>Модуль</span>
            <span>Что входит</span>
            <span style={{ textAlign: 'right' }}>Цена</span>
          </div>
          {modules.map((module) => (
            <div className="pricing-row" key={module.id}>
              <span className="pricing-row__title">{module.title}</span>
              <span className="pricing-row__desc">{module.description}</span>
              <span className="pricing-row__price">{module.price}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="pricing-packages">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} {...pkg} />
          ))}
        </div>
      )}

      <a
        href={documentLinks.bankruptcy.audience}
        target="_blank"
        rel="noopener noreferrer"
        className="pricing-note"
      >
        Пример анализа целевой аудитории, банкротство физических лиц
      </a>
    </Section>
  )
}
