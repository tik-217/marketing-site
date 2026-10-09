/**
 * Крупный фрагмент скриншота вместо всего документа. Рамка всегда 16:10,
 * crop = {x, y, w} в долях от исходной картинки 1600x1004 (высота фрагмента ~ равна ширине).
 * У пары светлая/темная версия показывается та, что совпадает с темой сайта.
 */
export function CropPicture({ src, srcDark, alt, crop = { x: 0, y: 0, w: 1 }, mobileCrop, className = '', draggable }) {
  const style = mobileCrop
    ? { '--d-x': crop.x, '--d-y': crop.y, '--d-w': crop.w, '--m-x': mobileCrop.x, '--m-y': mobileCrop.y, '--m-w': mobileCrop.w }
    : { '--crop-x': crop.x, '--crop-y': crop.y, '--crop-w': crop.w }
  return (
    <span className={`crop ${mobileCrop ? 'crop--m' : ''} ${className}`.trim()} style={style}>
      <img src={src} alt={alt} loading="lazy" decoding="async" draggable={draggable} className={srcDark ? 'theme-image--light' : undefined} />
      {srcDark && <img src={srcDark} alt={alt} loading="lazy" decoding="async" draggable={draggable} className="theme-image--dark" />}
    </span>
  )
}
