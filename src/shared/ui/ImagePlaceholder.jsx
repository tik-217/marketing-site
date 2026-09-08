export function ImagePlaceholder({ label = 'фото', className = '', style }) {
  const classes = ['image-placeholder', className].filter(Boolean).join(' ')
  return (
    <div className={classes} style={style}>
      {label}
    </div>
  )
}
