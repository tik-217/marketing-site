import { bankruptcyTariffs } from '../../../entities/pricing'
import { contacts } from '../../../shared/config/contacts'
import { Seo } from '../../../shared/lib/seo'
import { ctaName } from '../../../shared/lib/telegramSource'
import { CtaButton, Section } from '../../../shared/ui'
import { About } from '../../../widgets/about'
import { Audit } from '../../../widgets/audit'
import { Cases } from '../../../widgets/cases'
import { Faq } from '../../../widgets/faq'
import { Footer } from '../../../widgets/footer'
import { Header } from '../../../widgets/header'
import { HeroPortrait, TrustRow } from '../../../widgets/hero'
import { TariffCards } from '../../../widgets/pricing'
import { Reviews } from '../../../widgets/reviews'

const TITLE = 'Реклама для юристов по банкротству в Яндекс Директе, Габулян Тигран'
const DESCRIPTION =
  'Свои заявки на банкротство физлиц из Яндекса вместо покупных лидов. Кабинет и сайт остаются у вас, реклама с учетом статьи 28.1 закона о рекламе'

const cta = (source) => ({ source, href: contacts.bankruptcyChatUrl, label: contacts.bankruptcyCtaLabel })

const situations = [
  {
    title: 'Лиды покупаете, а договоров мало',
    text: 'Лид стоит недорого, но до консультации доходит малая часть, и часть этих людей уже говорила с конкурентами. Цена договора выходит совсем другой, чем цена заявки.',
  },
  {
    title: 'Перестали платить поставщику, и поток встал',
    text: 'Лендинг, кампании и статистика остались у него. Каждый новый месяц вы снова зависите от его условий и цен.',
  },
  {
    title: 'Заявки шли через колл-центр, а цену договора никто не считал',
    text: 'Вы платите за заявку и не видите, какая реклама приносит дела, а какая только звонки.',
  },
  {
    title: 'Клиенты идут по сарафану, своего платного канала нет',
    text: 'Пока работают рекомендации, все в порядке. Ушли двое постоянных, и месяц провис.',
  },
]

const buyLeads = [
  'Сайт и кабинет у поставщика',
  'Кому еще уйдет заявка, решает поставщик',
  'Перестали платить, и не осталось ничего',
  'Видно заявки, но не договоры',
]

const ownChannel = [
  'Сайт и кабинет ваши',
  'Заявка приходит только вам',
  'Остаются сайт, кампании и статистика',
  'Видно, какая реклама приносит договоры',
]

const process = [
  [
    'Каждый должник видит объявление про свою ситуацию',
    'В последнем анализе по банкротству вышло пять поводов обратиться к юристу. Кампания разбивается по темам запросов, и человек видит объявление про свою ситуацию, а не общее про банкротство',
  ],
  [
    'Объявление выделяется среди конкурентов в вашем регионе',
    'Разбираю, что обещают конкуренты, и собираю предложение из того, чего у них нет. Человек сравнивает объявления на одной странице поиска, и у него появляется причина выбрать вас',
  ],
  ['Цену заявки вы знаете до запуска', 'Считаю прогноз по вашему региону при разных бюджетах, и вы заранее сравниваете его с ценой покупного лида'],
  ['Объявления соответствуют статье 28.1', 'С 2026 года она требует предупреждать о последствиях банкротства, и это предупреждение есть в каждом объявлении'],
  ['Видно, какая реклама приносит договоры', 'Форма, звонок и мессенджер считаются отдельно, и бюджет переносится туда, откуда приходят клиенты'],
]

const whoItems = [
  'Работаю один, без менеджера между нами, веду 2-3 проекта одновременно и каждый лично',
  'Юрист по образованию, поэтому понимаю, как устроена практика и как юристы говорят с клиентами',
]

const faq = [
  {
    id: 'vs-leads',
    question: 'Чем это лучше покупки лидов?',
    answer:
      'Купленная заявка заканчивается вместе с оплатой. Свой канал остается у вас, а статистика копится в вашем кабинете месяц за месяцем, и через несколько месяцев вы знаете, какие запросы приносят договоры. От чужих условий и цен вы больше не зависите.',
    defaultOpen: true,
  },
  {
    id: 'lead-price',
    question: 'Сколько будет стоить заявка?',
    answer: 'До запуска считаю прогноз по вашему региону в трех сценариях бюджета, чтобы вы сравнили цену заявки с ценой лида заранее.',
  },
  {
    id: 'bad-experience',
    question: 'Я уже покупал рекламу, деньги ушли впустую',
    answer:
      'Чаще всего кампании настроены без разбора аудитории и ведут на страницу, которая не отвечает на вопросы человека. Пришлите ссылку на сайт в Telegram, покажу, где именно это произошло.',
  },
  {
    id: 'remote',
    question: 'Вы не в моем городе',
    answer:
      'Вся работа идет удаленно, договор подписывается электронно. Реклама настраивается на ваш регион, большинство клиентов из других городов.',
  },
  {
    id: 'after-lead',
    question: 'Что будет после заявки?',
    answer:
      'Отвечу в течение 30 минут и уточню ваш город. В течение 24 часов пришлю план рекламы по банкротству для вашего региона. Если решите работать, созвонимся, и я пришлю предложение со сроками и ценой. Сайт и рекламный кабинет оформляются на вас.',
  },
]

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__headline">Помогаю юристам по банкротству получать заявки из Яндекса без зависимости от лидогенераторов</h1>
          <p className="hero__lead">
            Запуск за 20 рабочих дней, кабинет на вашей фирме. В легализации коммерческих объектов одна сделка окупила маркетинг минимум в 11 раз.
          </p>
          <div className="hero__cta">
            <CtaButton {...cta('s-bankrotstvo-hero')} className="btn--wrap" />
            <p className="hero__help">Бесплатно. Напишите свой город, остальное посчитаю сам. Отвечу в течение 30 минут</p>
            <p className="hero__help hero__direct">
              Или позвоните <a href="tel:+79180220901">{contacts.phone}</a>
            </p>
            <TrustRow />
          </div>
        </div>
        <HeroPortrait />
      </div>
    </section>
  )
}

function Situations() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">С чем ко мне приходят юристы по банкротству</h2>
      <div className="situations-grid">
        {situations.map((item) => (
          <div className="situation-card" key={item.title}>
            <h3 className="situation-card__title">{item.title}</h3>
            <p className="situation-card__description">{item.text}</p>
          </div>
        ))}
      </div>
      <CtaButton {...cta('s-bankrotstvo-situations')} className="btn--wrap" style={{ alignSelf: 'flex-start' }} />
    </Section>
  )
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true" focusable="false">
      <circle cx="14" cy="14" r="14" fill="currentColor" opacity="0.14" />
      <path d="M9 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon({ size = 28 }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="14" cy="14" r="14" fill="var(--accent)" />
      <path d="M8.5 14.5l3.8 3.8 7.2-7.6" fill="none" stroke="var(--text-on-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Две карточки: покупные лиды (приглушенная) и свой канал (акцентная). Пункты стоят на одной высоте за счет общей сетки. */
function Compare() {
  return (
    <Section id="leads" containerClassName="stack">
      <h2 className="section-heading">Покупные лиды или свой канал</h2>
      <p className="section-lead">
        Да, цена лида записана в договоре. Но вы платите за чужой трафик, и с последним платежом заканчивается все.
      </p>
      <div className="vs">
        <article className="vs-card vs-card--muted">
          <header className="vs-card__head">
            <h3 className="vs-card__title">Покупные лиды</h3>
          </header>
          {buyLeads.map((item) => (
            <p className="vs-card__item" key={item}>
              <MinusIcon />
              <span>{item}</span>
            </p>
          ))}
        </article>
        <article className="vs-card vs-card--accent">
          <header className="vs-card__head">
            <h3 className="vs-card__title">Свой канал в Яндекс Директе</h3>
          </header>
          {ownChannel.map((item) => (
            <p className="vs-card__item" key={item}>
              <CheckIcon />
              <span>{item}</span>
            </p>
          ))}
        </article>
      </div>
      <p className="vs-conclusion">Нужен поток на месяц, проще купить лиды. Нужен канал на годы, его строят в своем кабинете.</p>
    </Section>
  )
}

function Process() {
  return (
    <Section id="steps" containerClassName="stack">
      <h2 className="section-heading">Как строится ваш канал заявок по банкротству</h2>
      <ol className="steps-list">
        {process.map(([title, text]) => (
          <li className="steps-list__item" key={title}>
            <span className="steps-list__title">{title}</span>
            <span className="steps-list__text">{text}</span>
          </li>
        ))}
      </ol>
      <CtaButton {...cta('s-bankrotstvo-process')} className="btn--wrap" style={{ alignSelf: 'flex-start' }} />
    </Section>
  )
}

function Price() {
  return (
    <Section id="prices" containerClassName="stack">
      <h2 className="section-heading">Сколько стоит</h2>
      <TariffCards
        tariffs={bankruptcyTariffs}
        source="s-bankrotstvo-tariff"
        message={(name) => `Здравствуйте, интересует тариф «${name}» для фирмы по банкротству`}
        className="tariffs--two"
      />
      <div className="tariffs-foot">
        <p className="tariffs-foot__budget">Рекламный бюджет оплачиваете отдельно, на свой кабинет.</p>
        <div className="tariffs-foot__cta">
          <CtaButton {...cta('s-bankrotstvo-price')} />
          <p className="tariffs-foot__caption">План бесплатный, отвечу за 30 минут</p>
        </div>
      </div>
    </Section>
  )
}

/** Отдельная страница под рекламу по банкротству. Главная остается как есть, кампания ведет сюда. */
export function BankrotstvoPage() {
  return (
    <>
      <Seo fullTitleText={TITLE} description={DESCRIPTION} path="/bankrotstvo" />
      <div className="bankrotstvo-page">
        <Header telegram={{ href: contacts.bankruptcyChatUrl, block: ctaName('s-bankrotstvo-header') }} />
        <main>
          <Hero />
          <Cases
            showAllLink={false}
            titles={{ legal: 'Другая ниша, тот же метод. Реклама окупилась минимум в 11 раз и продолжает приносить заявки' }}
          />
          <Reviews id="reviews" />
          <Situations />
          <Compare />
          <Price />
          <Process />
          <About items={whoItems} />
          <Faq heading="Цена заявки, сроки и чем это лучше покупки лидов" questions={faq} />
          <Audit
            id="audit"
            pageName="/bankrotstvo"
            telegramHref={contacts.bankruptcyChatUrl}
            copy={{
              eyebrow: 'План рекламы',
              heading: 'Посчитаю, сколько клиентов по банкротству вам может дать Яндекс',
              lead: 'Напишите свой город. За 24 часа пришлю план с тремя цифрами. Сколько человек в месяц ищут юриста по банкротству в вашем городе, примерная цена заявки и бюджет на первый месяц. Цену заявки сравните с ценой покупного лида до того, как что-то платить. Бесплатно и без обязательств.',
              hint: 'Если не пользуетесь Telegram, оставьте телефон или почту',
              contactPlaceholder: 'Телефон, Telegram или почта',
              submitLabel: 'Оставить контакт, свяжусь сам',
              help: 'Отвечу в течение 30 минут. План пришлю в течение 24 часов.',
            }}
          />
        </main>
        <Footer
          hideAuditLink
          chat={{ href: contacts.bankruptcyChatUrl, label: contacts.bankruptcyCtaLabel, source: 's-bankrotstvo-footer' }}
        />
      </div>
    </>
  )
}
