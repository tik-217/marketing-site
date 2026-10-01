import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cases } from '../../../entities/case'
import portrait from '../../../shared/assets/images/tigran-portrait.avif'

const sample = {
  url: 'https://gabulyan-tigran.ru',
  summary:
    'Страница понятно объясняет, чем занимается автор, и открыто показывает цены. Главная помеха в порядке блоков: кейсы с цифрами стоят ниже середины страницы, а кнопка на первом экране ведет в мессенджер без пояснения, что будет после нажатия.',
  actions: [
    ['Первый экран', 'Под кнопкой написать, что будет после сообщения: ответ в течение дня и бесплатный разбор ниши.'],
    ['Кейсы', 'Поднять кейс Glendale с цифрами 46 заявок по 841 ₽ сразу после первого экрана.'],
    ['Цены', 'Показать состав каждого пакета рядом с суммой, а не в раскрывающемся списке.'],
  ],
  problem: {
    title: 'Кейсы с цифрами видны только после пятого экрана',
    text: 'Холодный посетитель не знает автора и уходит раньше, чем доходит до доказательств.',
  },
  strength: {
    title: 'Цены и условия указаны открыто',
    text: 'Посетитель понимает бюджет до первого сообщения, обращения приходят от тех, кому цена подходит.',
  },
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
              Как выглядит разбор
            </h2>
            <p className="ad-example__sub">Пример на моем собственном сайте gabulyan-tigran.ru</p>
          </div>
          <button
            type="button"
            className="ad-btn ad-btn--outline"
            aria-expanded={open}
            aria-controls="ad-example-body"
            onClick={toggle}
          >
            {open ? 'Свернуть пример' : 'Показать пример'}
          </button>
        </div>
        {open && (
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
              <div className="ad-sample__pair">
                <div className="ad-card ad-sample__mini">
                  <span className="ad-tag">Проблема</span>
                  <h4>{sample.problem.title}</h4>
                  <p>{sample.problem.text}</p>
                </div>
                <div className="ad-card ad-sample__mini">
                  <span className="ad-tag ad-tag--accent">Сильная сторона</span>
                  <h4>{sample.strength.title}</h4>
                  <p>{sample.strength.text}</p>
                </div>
              </div>
            </div>
          </div>
        )}
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
            <span className="ad-eyebrow">Кто делает разбор</span>
            <h2 id="ad-author-title" className="ad-h2 ad-section__title">
              Тигран Габулян
            </h2>
            <p className="ad-author__lead">
              Собираю сайты и настраиваю рекламу в Яндекс Директе для малого бизнеса. По этому
              чек-листу я проверяю страницы клиентов перед запуском рекламы.
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
                <p className="ad-case__text">{item.description}</p>
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
