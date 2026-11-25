import { Helmet } from 'react-helmet-async'
import { cases } from '../../../entities/case'
import { homeTariffs } from '../../../entities/pricing'
import { contacts } from '../../../shared/config/contacts'
import { Seo } from '../../../shared/lib/seo'
import { LoopVideo, Section } from '../../../shared/ui'
import { CtaButton } from '../../../features/contact-cta'
import portrait from '../../../shared/assets/images/tigran-portrait.avif'
import portraitSmall from '../../../shared/assets/images/tigran-portrait-480.avif'
import { Audit } from '../../../widgets/audit'
import { CasePreviewCard } from '../../../widgets/cases'
import { Footer } from '../../../widgets/footer'
import { Header } from '../../../widgets/header'
import { TrustRow } from '../../../widgets/hero'
import { TariffCards } from '../../../widgets/pricing'
import { Reviews } from '../../../widgets/reviews'

const TITLE = 'Реклама для юристов по банкротству в Яндекс Директе, Габулян Тигран'
const DESCRIPTION =
  'Свои заявки на банкротство физлиц из Яндекса вместо покупных лидов. Кабинет и сайт остаются у вас, реклама с учетом статьи 28.1 закона о рекламе'

const cta = (source) => ({ source, href: contacts.bankruptcyChatUrl, label: contacts.bankruptcyCtaLabel })

const situations = [
  {
    title: 'Лиды покупаете, а договоров мало',
    text: 'Лид стоит недорого, но до консультации доходит малая часть, и часть этих людей уже говорила с конкурентами. Цена договора выходит совсем другой, чем цена заявки.',
  },
  {
    title: 'Перестали платить поставщику, и поток встал',
    text: 'Лендинг, кампании и статистика остались у него. Каждый новый месяц вы снова зависите от его условий и цен.',
  },
  {
    title: 'Заявки шли через колл-центр, а цену договора никто не считал',
    text: 'Вы платите за заявку и не видите, какая реклама приносит дела, а какая только звонки.',
  },
  {
    title: 'Клиенты идут по сарафану, своего платного канала нет',
    text: 'Пока работают рекомендации, все в порядке. Ушли двое постоянных, и месяц провис.',
  },
]

const process = [
  ['Каждый должник видит объявление про свою ситуацию', 'В последнем анализе по банкротству вышло пять поводов обратиться к юристу, и под каждый пишутся свои объявления'],
  ['Беру из рекламы конкурентов в вашем регионе то, что работает', 'И добавляю то, чего у них нет. Человек сравнивает объявления на одной странице поиска, и у него появляется причина выбрать вас'],
  ['Цену заявки вы знаете до запуска', 'Считаю прогноз по вашему региону при разных бюджетах, и вы заранее сравниваете его с ценой покупного лида'],
  ['Объявления соответствуют статье 28.1', 'С 2026 года она требует предупреждать о последствиях банкротства, и это предупреждение есть в каждом объявлении'],
  ['Видно, какая реклама приносит договоры', 'Форма, звонок и мессенджер считаются отдельно, и бюджет переносится туда, откуда приходят клиенты'],
]

const whoItems = [
  'Работаю один, без менеджера между нами, веду 2-3 проекта одновременно и каждый лично',
  'Четыре года юридического образования, поэтому понимаю, как устроена практика и как юристы говорят с клиентами',
  'Сайт собираю и правлю сам, правка текста занимает день, а не две недели через подрядчика',
]

const faq = [
  [
    'Чем это лучше покупки лидов?',
    'Купленная заявка заканчивается вместе с оплатой. Свой канал остается у вас, а статистика копится в вашем кабинете месяц за месяцем, и через несколько месяцев вы знаете, какие запросы приносят договоры. От чужих условий и цен вы больше не зависите.',
  ],
  [
    'Сколько будет стоить заявка?',
    'До запуска считаю прогноз по вашему региону в трех сценариях бюджета, чтобы вы сравнили цену заявки с ценой лида заранее.',
  ],
  [
    'Я уже покупал рекламу, деньги ушли впустую',
    'Чаще всего кампании настроены без разбора аудитории и ведут на страницу, которая не отвечает на вопросы человека. Бесплатный разбор рекламы покажет, где именно это произошло.',
  ],
  [
    'Вы не в моем городе',
    'Вся работа идет удаленно, договор подписывается электронно. Реклама настраивается на ваш регион, из пяти моих проектов только один в моем городе.',
  ],
  [
    'Что будет после заявки?',
    'Отвечу в течение 30 минут и уточню ваш город. В течение 2 часов пришлю план рекламы по банкротству для вашего региона. Если решите работать, созвонимся, и я пришлю предложение со сроками и ценой. Сайт и рекламный кабинет оформляются на вас.',
  ],
]

function Hero() {
  return (
    <section className="hero">
      <Helmet>
        <link rel="preload" as="image" type="image/avif" href={portraitSmall} media="(max-width: 768px)" />
        <link rel="preload" as="image" type="image/avif" href={portrait} media="(min-width: 769px)" />
      </Helmet>
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__headline">Помогаю юристам по банкротству настроить поток заявок из Яндекса</h1>
          <p className="hero__lead">
              Получайте клиентов из Яндекса уже через 8 рабочих дней. Рекламный кабинет будет вашим и вы видите, сколько стоит каждая заявка.
          </p>
          <div className="hero__cta">
            <CtaButton {...cta('s-bankrotstvo-hero')} label="Получить бесплатный разбор" className="btn--wrap" />
            <p className="hero__help">Бесплатно. Отвечу в течение 30 минут.</p>
            <TrustRow />
          </div>
        </div>
        <picture>
          <source media="(max-width: 768px)" srcSet={portraitSmall} type="image/avif" />
          <img
            src={portrait}
            alt="Габулян Тигран"
            className="hero__portrait"
            width="606"
            height="808"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  )
}

function Situations() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">С чем ко мне приходят юристы по банкротству</h2>
      <div className="situations-grid">
        {situations.map((item) => (
          <div className="situation-card" key={item.title}>
            <h3 className="situation-card__title">{item.title}</h3>
            <p className="situation-card__description">{item.text}</p>
          </div>
        ))}
      </div>
      <CtaButton {...cta('s-bankrotstvo-situations')} style={{ alignSelf: 'flex-start' }} />
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
      <CtaButton {...cta('s-bankrotstvo-process')} style={{ alignSelf: 'flex-start' }} />
    </Section>
  )
}

/** Тот же блок и те же классы, что "Со мной вы работаете напрямую" на главной: видео слева, справа заголовок и список. */
function Who() {
  return (
    <Section id="who" containerClassName="about">
      <div className="about__body">
        <h2 className="section-heading">Со мной вы работаете напрямую, без менеджера между нами</h2>
        <ul className="about__list">
          {whoItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="about__video">
        <LoopVideo className="about__video-el" />
      </div>
    </Section>
  )
}

const bankruptcyCase = cases.find((item) => item.id === 'bankruptcy')
const legalCase = cases.find((item) => item.id === 'legal')

function CasesBlock() {
  return (
    <Section id="cases" containerClassName="stack">
      <h2 className="section-heading">Кейсы в юридической нише</h2>
      <div className="case-preview-grid">
        <CasePreviewCard {...legalCase} />
        <CasePreviewCard {...bankruptcyCase} />
      </div>
    </Section>
  )
}

const tariffHref = () => '/bankrotstvo#audit'

function Price() {
  return (
    <Section id="prices" containerClassName="stack">
      <h2 className="section-heading">Сколько стоит</h2>
      <TariffCards tariffs={homeTariffs} getHref={tariffHref} sourcePrefix="s-bankrotstvo-tariff" />
      <div className="tariffs-foot">
        <p className="tariffs-foot__budget">Рекламный бюджет оплачиваете отдельно, на свой кабинет.</p>
      </div>
    </Section>
  )
}

function Faq() {
  return (
    <Section id="faq" containerClassName="stack stack--tight">
      <h2 className="section-heading">Цена заявки, сроки и чем это лучше покупки лидов</h2>
      <div className="faq-list">
        {faq.map(([question, answer], index) => (
          <details className="faq-item" key={question} open={index === 0}>
            <summary>
              <span>{question}</span>
              <span className="faq-icon">+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

export function BankrotstvoPage() {
  return (
    <>
      <Seo fullTitleText={TITLE} description={DESCRIPTION} path="/bankrotstvo" />
      <div className="bankrotstvo-page">
        <Header />
        <main>
          <Hero />
          <CasesBlock />
          <Reviews id="reviews" />
          <Situations />
          <Price />
          <Process />
          <Who />
          <Faq />
          <Audit
            id="audit"
            pageName="/bankrotstvo"
            help="Отвечу за 30 минут. План пришлю в течение 2 часов."
            copy={{
              heading: 'Посчитаю, сколько будет стоить заявка на банкротство',
              lead: 'Бесплатно рассчитаю приемлемую стоимость заявки и ориентир по бюджету на данных Яндекса.',
            }}
          />
        </main>
        <Footer
          chat={{ href: contacts.bankruptcyChatUrl, label: contacts.bankruptcyCtaLabel, source: 's-bankrotstvo-footer' }}
        />
      </div>
    </>
  )
}
