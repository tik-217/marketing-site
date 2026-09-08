import { useState } from 'react'
import { modules, packages } from '../../../entities/pricing'
import { Section } from '../../../shared/ui'
import { PackageCard } from './PackageCard'

export function Pricing() {
  const [tab, setTab] = useState('modules')

  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Любую услугу начинаю с маркетингового анализа</h2>
      <div className="stack" style={{ gap: 'var(--space-3)', maxWidth: '62ch' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Модуль 0, маркетинговый анализ, входит в любой проект. Бриф по вашему бизнесу, анализ
          целевой аудитории, анализ конкурентов, анализ ниши и УТП.
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>Каждый добавленный модуль включает свою дополнительные этапы.</p>
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
        href="https://disk.yandex.ru/d/zuFRI3cpumXScQ"
        target="_blank"
        rel="noopener noreferrer"
        className="pricing-note"
      >
        Ссылка-превью на публичную страницу анализа ЦА как образец объема работы
      </a>
    </Section>
  )
}
