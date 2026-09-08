export function Button({ as = 'a', block = false, className = '', ...props }) {
  const Tag = as
  const classes = ['btn', block && 'btn--block', className].filter(Boolean).join(' ')
  return <Tag className={classes} {...props} />
}
