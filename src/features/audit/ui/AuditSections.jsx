import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cases } from '../../../entities/case'
import { CasePreviewCard } from '../../../widgets/cases'
import portrait from '../../../shared/assets/images/tigran-portrait.avif'

const sample = {
  url: 'https://gabulyan-tigran.ru',
  summary:
    'Страница понятно объясняет, чем занимается автор, и открыто показывает цены. Главная помеха в порядке блоков: кейсы с цифрами стоят ниже середины страницы, а кнопка на первом экране ведет в мессенджер без пояснения, что будет после нажатия.',
  actions: [
    ['Первый экран.', 'Под кнопкой написать, что будет после сообщения: ответ в течение дня и бесплатный разбор ниши.'],
    ['Кейсы.', 'Поднять кейс Glendale с цифрами 46 заявок по 841 ₽ сразу после первого экрана.'],
    ['Цены.', 'Показать состав каждого пакета рядом с суммой, а не в раскрывающемся списке.'],
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
      <div className="ad-col">
        <div className="ad-example__head">
          <div>
            <h2 id="ad-example-title" className="ad-h2">
              Как выглядит разбор
            </h2>
            <p className="ad-muted">Пример на моем собственном сайте gabulyan-tigran.ru</p>
          </div>
          <button
            type="button"
            className="btn btn--outline"
            aria-expanded={open}
            aria-controls="ad-example-body"
            onClick={toggle}
          >
            {open ? 'Свернуть пример' : 'Показать пример'}
          </button>
        </div>
        {open && (
          <div id="ad-example-body" className="ad-sample">
            <span className="ad-tag">Пример разбора</span>
            <h3 className="ad-sample__title">Что на странице может мешать заявкам</h3>
            <p className="ad-sample__url">{sample.url}</p>
            <p className="ad-sample__summary">{sample.summary}</p>
            <div className="ad-sample__card">
              <h4>Что исправить в первую очередь</h4>
              <ol>
                {sample.actions.map(([label, text], index) => (
                  <li key={label}>
                    <span className="ad-sample__num">{index + 1}</span>
                    <p>
                      <strong>{label}</strong> {text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="ad-sample__pair">
              <div className="ad-sample__card">
                <span className="ad-tag">Проблема</span>
                <h4>{sample.problem.title}</h4>
                <p>{sample.problem.text}</p>
              </div>
              <div className="ad-sample__card">
                <span className="ad-tag">Сильная сторона</span>
                <h4>{sample.strength.title}</h4>
                <p>{sample.strength.text}</p>
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
      <div className="ad-col">
        <h2 id="ad-checks-title" className="ad-h2 ad-h2--big">
          Что проверяется и чего не видно
        </h2>
        <div className="ad-checks">
          <div className="ad-card">
            <h3 className="ad-card__title">Что смотрит разбор</h3>
            <ul className="ad-rows">
              {checks.map(([title, text]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ad-card ad-card--muted">
            <h3 className="ad-card__title">Чего разбор не знает</h3>
            <ul className="ad-rows">
              {unknowns.map((item) => (
                <li key={item}>
                  <strong>{item}</strong>
                </li>
              ))}
            </ul>
            <p className="ad-card__note">
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
      <div className="ad-col">
        <div className="ad-author">
          <img src={portrait} alt="Тигран Габулян" className="ad-author__photo" />
          <div className="ad-author__body">
            <span className="ad-eyebrow">Кто делает разбор</span>
            <h2 id="ad-author-title" className="ad-h2 ad-h2--big">
              Тигран Габулян
            </h2>
            <p className="ad-author__text">
              Собираю сайты и настраиваю рекламу в Яндекс Директе для малого бизнеса. По этому
              чек-листу я проверяю страницы клиентов перед запуском рекламы.
            </p>
          </div>
        </div>
        <div className="ad-cases">
          {cases.map((item) => (
            <CasePreviewCard key={item.id} {...item} />
          ))}
        </div>
        <Link to="/cases" className="ad-more">
          Все кейсы <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

const faq = [
  ['Это бесплатно?', 'Да. Разбор бесплатный, без регистрации, телефона и почты.'],
  [
    'Сохраняется ли моя ссылка?',
    'Для разбора используется только публичная страница. Повторная проверка той же страницы может показать уже готовый разбор.',
  ],
  [
    'Чем разбор отличается от личного?',
    'Разбор смотрит одну публичную страницу. На личном разборе я смотрю еще рекламу, аналитику и путь заявки до продажи.',
  ],
  [
    'Можно ли проверить чужой сайт?',
    'Да, подойдет любая публичная страница, например страница конкурента или подрядчика.',
  ],
  [
    'Сколько раз в сутки можно проверять?',
    'Есть дневной лимит бесплатных разборов. Если он закончится, напишите мне в Telegram, посмотрю страницу вручную.',
  ],
]

export function FaqSection() {
  return (
    <section className="ad-section" aria-labelledby="ad-faq-title">
      <div className="ad-col ad-faq">
        <h2 id="ad-faq-title" className="ad-h2 ad-h2--big">
          Частые вопросы
        </h2>
        <div className="faq-list">
          {faq.map(([question, answer]) => (
            <details className="faq-item" key={question}>
              <summary>
                <span>{question}</span>
                <span className="faq-icon">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
