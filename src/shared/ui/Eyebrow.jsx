export function Eyebrow({ inverse = false, children }) {
  return <span className={inverse ? 'eyebrow eyebrow--inverse' : 'eyebrow'}>{children}</span>
}
