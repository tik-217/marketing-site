/**
 * Крупный фрагмент скриншота вместо всего документа. Рамка всегда 16:10,
 * crop = {x, y, w} в долях от исходной картинки 1600x1004 (высота фрагмента ~ равна ширине).
 * У пары светлая/темная версия показывается та, что совпадает с темой сайта.
 */
export function CropPicture({ src, srcDark, alt, crop, className = '', draggable }) {
  const style = { '--crop-x': crop.x, '--crop-y': crop.y, '--crop-w': crop.w }
  return (
    <span className={`crop ${className}`.trim()} style={style}>
      <img src={src} alt={alt} loading="lazy" decoding="async" draggable={draggable} className={srcDark ? 'theme-image--light' : undefined} />
      {srcDark && <img src={srcDark} alt={alt} loading="lazy" decoding="async" draggable={draggable} className="theme-image--dark" />}
    </span>
  )
}
