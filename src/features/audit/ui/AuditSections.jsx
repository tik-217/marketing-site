import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cases } from '../../../entities/case'
import { CtaButton } from '../../../shared/ui'
import portrait from '../../../shared/assets/images/tigran-portrait.avif'

// Реальный разбор главной gabulyan-tigran.ru, выполненный 9 октября 2026. Тексты ответа сервиса без правок.
const sample = {
  "url": "https://gabulyan-tigran.ru",
  "summary": "Страница выстроена логично: понятный оффер на первом экране, кейсы с конкретными результатами, цены и условия работы без скрытых оговорок. Главная проблема - из заголовка первого экрана не ясно, чем именно Тигран отличается от других маркетологов для юристов: он делает сайт и рекламу вместе, опираясь на анализ ниши, а это нигде не зафиксировано как отличие в явном виде на первом экране. Блок с сравнением четырех способов получить заявки спрятан глубоко на странице, хотя там есть сильный аргумент в пользу работы напрямую.",
  "actions": [
    [
      "Первый экран",
      "Переписать подзаголовок так, чтобы он раскрывал, что именно дает анализ ниши на практике - например, через результат из кейса или конкретное следствие для клиента."
    ],
    [
      "Кейсы",
      "Переделать заголовки кейсов так, чтобы в них был вынесен ключевой результат, а не только название ниши."
    ],
    [
      "Сравнение",
      "Поднять блок сравнения выше на странице - разместить его сразу после раздела с болями клиентов или после первого кейса, пока интерес еще высок."
    ]
  ],
  "problem": {
    "title": "Подзаголовок не добавляет конкретики к офферу",
    "text": "Подзаголовок пересказывает ту же мысль, что и заголовок, только другими словами. Посетитель не получает ответа на вопрос, почему этот подход дает результат и чем он отличается от стандартного маркетолога, который тоже делает сайт и рекламу."
  },
  "strength": {
    "text": "Конкретный результат кейса вынесен на страницу с числом: \"Одна сделка окупила маркетинг минимум в 11 раз за три месяца\" - это проверяемое утверждение, а не оценочное суждение."
  }
}

export function ExampleSection({ track }) {
  const [open, setOpen] = useState(false)

  function toggle() {
    track(open ? 'audit_example_close' : 'audit_example_open')
    setOpen(!open)
  }

  return (
    <section className="ad-section" aria-labelledby="ad-example-title">
      <div className="ad-example__in">
        <div className="ad-example__head">
          <div className="ad-example__titles">
            <h2 id="ad-example-title" className="ad-h2">
              Вот что разбор нашел на моем собственном сайте
            </h2>
            <p className="ad-example__sub">gabulyan-tigran.ru</p>
          </div>
        </div>
        <div id="ad-example-body" className="ad-sample">
          <div className="ad-sample__in">
            <div className="ad-sample__head">
              <span className="ad-eyebrow">Пример разбора</span>
              <h3 className="ad-sample__title">Что на странице может мешать заявкам</h3>
              <span className="ad-sample__url">{sample.url}</span>
            </div>
            <p className="ad-sample__summary">{sample.summary}</p>
            <div className="ad-card ad-sample__box">
              <h4>Что исправить в первую очередь</h4>
              {sample.actions.map(([label, text], index) => (
                <div key={label} className="ad-sample__row">
                  <span className="ad-sample__num">{index + 1}</span>
                  <div>
                    <strong>{label}.</strong> {text}
                  </div>
                </div>
              ))}
            </div>
            {open && (
              <div className="ad-sample__pair">
                <div className="ad-card ad-sample__mini">
                  <span className="ad-tag">Проблема</span>
                  <h4>{sample.problem.title}</h4>
                  <p>{sample.problem.text}</p>
                </div>
                <div className="ad-card ad-sample__mini">
                  <span className="ad-tag ad-tag--accent">Сильная сторона</span>
                  <p>{sample.strength.text}</p>
                </div>
              </div>
            )}
            <button
              type="button"
              className="ad-btn ad-btn--outline ad-sample__more"
              aria-expanded={open}
              onClick={toggle}
            >
              {open ? 'Свернуть пример' : 'Показать весь пример'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const checks = [
  ['Первый экран и оффер', 'Понятно ли за несколько секунд, что предлагают и кому'],
  ['Понятность предложения', 'Цена, сроки, состав услуги'],
  ['Кнопки и формы', 'Где стоят, что на них написано, сколько полей'],
  ['Тексты', 'Говорят ли о задаче клиента или о компании'],
  ['Доверие', 'Кейсы, отзывы, контакты, реквизиты'],
  ['Мобильная версия', 'Читается ли текст, удобно ли нажимать'],
]

const unknowns = [
  'Реальную конверсию страницы',
  'Продажи и выручку',
  'Качество заявок',
  'Рекламу: какие запросы и аудитории ведут на страницу',
  'Внутреннюю аналитику и CRM',
]

export function ChecksSection() {
  return (
    <section className="ad-section" aria-labelledby="ad-checks-title">
      <div className="ad-section__in">
        <h2 id="ad-checks-title" className="ad-h2 ad-section__title">
          Что проверяется и чего не видно
        </h2>
        <div className="ad-checks">
          <div className="ad-card ad-checks__card">
            <h3 className="ad-checks__title">Что смотрит разбор</h3>
            {checks.map(([title, text]) => (
              <div key={title} className="ad-checks__row">
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div className="ad-checks__card--muted">
            <h3 className="ad-checks__title">Чего разбор не знает</h3>
            {unknowns.map((item) => (
              <div key={item} className="ad-checks__row">
                {item}
              </div>
            ))}
            <p className="ad-checks__note">
              Эти данные я смотрю на личном разборе, когда вы открываете доступ к рекламе и
              аналитике.
            </p>
          </div>
        </div>
        <CtaButton source="s-audit-limits" className="ad-checks__cta" />
      </div>
    </section>
  )
}

export function AuthorSection() {
  return (
    <section className="ad-section" aria-labelledby="ad-author-title">
      <div className="ad-section__in">
        <div className="ad-author">
          <img src={portrait} alt="Тигран Габулян" className="ad-author__photo" />
          <div className="ad-author__text">
            <span className="ad-eyebrow">Тигран Габулян</span>
            <h2 id="ad-author-title" className="ad-h2 ad-section__title">
              Этим чек-листом я проверяю страницы клиентов перед запуском рекламы
            </h2>
            <p className="ad-author__lead">
              Собираю сайты и настраиваю рекламу в Яндекс Директе для малого бизнеса.
            </p>
          </div>
        </div>
        <div className="ad-cases">
          {cases.map((item) => (
            <Link key={item.id} to={`/cases/${item.slug}`} className="ad-card ad-case">
              <img src={item.cover.src} alt={item.cover.alt} className="ad-case__img" loading="lazy" />
              <div className="ad-case__body">
                <span className={item.status === 'done' ? 'ad-case__badge' : 'ad-case__badge ad-case__badge--work'}>
                  {item.status === 'done' ? 'Завершен' : 'В работе'}
                </span>
                <h3 className="ad-case__title">{item.title}</h3>
                {Array.isArray(item.description) ? (
                  <ul className="ad-case__text ad-case__list">
                    {item.description.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="ad-case__text">{item.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <Link to="/cases" className="ad-link">
          Все кейсы →
        </Link>
      </div>
    </section>
  )
}

const faq = [
  ['Это бесплатно?', 'Да. Оплаты, подписки и платных функций нет.'],
  [
    'Сохраняется ли моя ссылка?',
    'Адрес страницы и готовый разбор сохраняются на стороне сервиса. Ваших контактов сервис не получает.',
  ],
  [
    'Чем разбор отличается от личного?',
    'Автоматический разбор смотрит одну публичную страницу. На личном разборе я смотрю сайт вместе с рекламой, аналитикой и заявками, которые вы получаете, и обсуждаю с вами результат.',
  ],
  ['Можно ли проверить чужой сайт?', 'Да. Подойдет любая открытая страница, например страница конкурента.'],
  [
    'Сколько раз в сутки можно проверять?',
    'Есть дневной лимит бесплатных разборов. Повторная проверка той же страницы в тот же день может показать сохраненный разбор. Если лимит закончится, напишите мне в Telegram, посмотрю страницу сам.',
  ],
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <section className="ad-section" aria-labelledby="ad-faq-title">
      <div className="ad-section__in ad-faq">
        <h2 id="ad-faq-title" className="ad-h2 ad-section__title">
          Частые вопросы
        </h2>
        <div className="ad-faq__list">
          {faq.map(([question, answer], index) => {
            const open = openIndex === index
            return (
              <div key={question} className={open ? 'ad-faq__item ad-faq__item--open' : 'ad-faq__item'}>
                <button
                  type="button"
                  className="ad-faq__q"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <span>{question}</span>
                  <span aria-hidden="true" className="ad-faq__icon">
                    +
                  </span>
                </button>
                {open && <p className="ad-faq__a">{answer}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
