import { Seo } from '../../../shared/lib/seo'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Страница не найдена" path="/404" noIndex />
      <main>
        <h1>Страница не найдена</h1>
        <p>Проверьте адрес или вернитесь на главную.</p>
      </main>
    </>
  )
}
