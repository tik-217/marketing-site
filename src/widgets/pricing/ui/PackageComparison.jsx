import { CtaButton } from '../../../shared/ui'
import { packageSource } from '../../../shared/lib/telegramSource'

function PackageStatus({ included }) {
  return (
    <span className={included ? 'package-status is-included' : 'package-status is-excluded'}>
      {included ? 'входит' : 'не входит'}
    </span>
  )
}

const summaryRows = [
  { key: 'modulesTotal', label: 'Сумма модулей' },
  { key: 'price', label: 'Цена пакета', hint: 'скидка 8%', highlight: true },
  { key: 'monthly', label: 'Дальше в месяц' },
  { key: 'duration', label: 'Срок', hint: 'рабочих дней' },
]

export function PackageComparison({ modules, packages, discount }) {
  return (
    <div className="package-comparison">
      <div className="package-comparison__desktop">
        <table className="package-table">
          <thead>
            <tr>
              <th scope="col" className="package-table__label package-table__corner">
                Ваша ситуация
              </th>
              {packages.map((pkg) => (
                <th scope="col" className="package-table__plan" key={pkg.id}>
                  <span>{pkg.title}</span>
                  <small>{pkg.situation}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.id}>
                <th scope="row" className="package-table__label">
                  <span>{module.label}</span>
                  <small>{module.price}</small>
                </th>
                {packages.map((pkg) => (
                  <td className="package-table__status" key={pkg.id}>
                    <PackageStatus included={pkg.includedModules.includes(module.id)} />
                  </td>
                ))}
              </tr>
            ))}
            {summaryRows.map((row) => (
              <tr key={row.key}>
                <th scope="row" className="package-table__label">
                  <span>{row.label}</span>
                  {row.hint && <small>{row.hint}</small>}
                </th>
                {packages.map((pkg) => (
                  <td
                    className={
                      row.highlight
                        ? 'package-table__value package-table__value--highlight'
                        : 'package-table__value'
                    }
                    key={pkg.id}
                  >
                    {pkg[row.key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="package-table__cta-row">
              <td className="package-table__label" />
              {packages.map((pkg) => (
                <td className="package-table__cta" key={pkg.id}>
                  <CtaButton block source={packageSource(pkg.id)} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="package-comparison__cards">
        {packages.map((pkg) => (
          <article className="package-plan" key={pkg.id}>
            <header className="package-plan__header">
              <h3>{pkg.title}</h3>
              <p>{pkg.situation}</p>
            </header>

            <ul className="package-plan__modules">
              {modules.map((module) => {
                const included = pkg.includedModules.includes(module.id)

                return (
                  <li className={included ? 'is-included' : 'is-excluded'} key={module.id}>
                    <span>
                      <strong>{module.label}</strong>
                      <small>{module.price}</small>
                    </span>
                    <PackageStatus included={included} />
                  </li>
                )
              })}
            </ul>

            <dl className="package-plan__summary">
              {summaryRows.map((row) => (
                <div className={row.highlight ? 'is-highlighted' : undefined} key={row.key}>
                  <dt>
                    {row.label}
                    {row.hint && <small>{row.hint}</small>}
                  </dt>
                  <dd>{pkg[row.key]}</dd>
                </div>
              ))}
            </dl>

            <div className="package-plan__cta">
              <CtaButton block source={packageSource(pkg.id)} />
            </div>
          </article>
        ))}
      </div>

      <aside className="package-comparison__note">
        <strong>{discount.title}</strong>
        <span>{discount.description}</span>
      </aside>
    </div>
  )
}
