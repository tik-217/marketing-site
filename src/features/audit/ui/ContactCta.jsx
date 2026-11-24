import { ContactLink } from './ContactLink'

/** Блок после списка приоритетов. Как в макете, виден только на узких экранах. */
export function MidCta({ hostname, code, auditId, track }) {
  return (
    <aside className="ad-mid">
      <p>Помогу расставить эти пункты по порядку под ваш бюджет.</p>
      <ContactLink
        intent="deeper"
        position="actions"
        hostname={hostname}
        code={code}
        auditId={auditId}
        track={track}
        className="ad-btn"
      >
        Обсудить разбор
      </ContactLink>
    </aside>
  )
}

/** Главный блок после результата: заявка. */
export function FinalCta({ hostname, code, auditId, track }) {
  return (
    <section className="ad-final" aria-labelledby="ad-final-title">
      <h2 id="ad-final-title" className="ad-h2 ad-final__title">
        Следующий шаг: посмотреть страницу вместе с рекламой
      </h2>
      <p className="ad-final__text">
        Разбор видит только страницу. Я могу посмотреть сайт вместе с рекламой и аналитикой и
        показать, на каком этапе уходят обращения.
      </p>
      <ContactLink
        intent="deeper"
        position="final"
        hostname={hostname}
        code={code}
        auditId={auditId}
        track={track}
        className="ad-btn ad-final__btn"
      >
        Оставить заявку
      </ContactLink>
      <p className="ad-final__note">
        Разбор построен по публичной странице на момент проверки. Он не учитывает рекламу,
        аналитику и данные о заявках и не гарантирует результат.
      </p>
    </section>
  )
}
