export function Section({ id, inverse = false, flush = false, containerClassName = '', children }) {
  const classes = ['section', inverse && 'section--inverse', flush && 'section--flush']
    .filter(Boolean)
    .join(' ')
  const containerClasses = ['container', containerClassName].filter(Boolean).join(' ')

  return (
    <section id={id} className={classes}>
      <div className={containerClasses}>{children}</div>
    </section>
  )
}
