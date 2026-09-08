export function ComparisonPanel({ title, rows, footer, inverse, isActive }) {
  const classes = [
    'comparison-panel',
    inverse && 'comparison-panel--inverse',
    isActive && 'is-active',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <h3 className="comparison-panel__title">{title}</h3>
      {rows.map((row) => (
        <div className="comparison-row" key={row.label}>
          <span className="comparison-row__label">{row.label}</span>
          <span className="comparison-row__value">{row.value}</span>
        </div>
      ))}
      <div className="comparison-footer">
        <span className="comparison-row__label">{footer.label}</span>
        <span className="comparison-row__value">{footer.value}</span>
      </div>
    </div>
  )
}
