import { Seo } from '../../../shared/lib/seo'
import { NotFoundContent } from '../../../shared/ui'

export function NotFoundPage() {
  return <><Seo title="Страница не найдена" path="/404" noIndex /><NotFoundContent /></>
}
