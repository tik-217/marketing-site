import { Helmet } from 'react-helmet-async'
import { cases } from '../../../entities/case'
import { adsLaunchDays, adsMonthly, packages } from '../../../entities/pricing'
import { contacts } from '../../../shared/config/contacts'
import { Seo } from '../../../shared/lib/seo'
import { ctaName } from '../../../shared/lib/telegramSource'
import { CtaButton, LoopVideo, Section } from '../../../shared/ui'
import portrait from '../../../shared/assets/images/tigran-portrait.avif'
import portraitSmall from '../../../shared/assets/images/tigran-portrait-480.avif'
import { Audit } from '../../../widgets/audit'
import { CasePreviewCard } from '../../../widgets/cases'
import { Footer } from '../../../widgets/footer'
import { Header } from '../../../widgets/header'
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

const buyLeads = [
  'Сайт и кабинет у поставщика',
  'Кому еще уйдет заявка, решает поставщик',
  'Перестали платить, и не осталось ничего',
  'Видно заявки, но не договоры',
]

const ownChannel = [
  'Сайт и кабинет ваши',
  'Заявка приходит только вам',
  'Остаются сайт, кампании и статистика',
  'Видно, какая реклама приносит договоры',
]

const process = [
  ['Записываю задачу в цифрах', 'Средний чек, сколько фирма готова платить за заявку и сколько консультаций доходит до договора.'],
  ['Делю клиентов по типам запросов', 'В последнем анализе по банкротству вышло пять типов, у каждого свой повод обратиться.'],
  ['Разбираю объявления конкурентов в вашем регионе', 'Что они обещают, как объясняют цену и соблюдают ли новые правила рекламы банкротства.'],
  ['Считаю прогноз до запуска', 'Сколько будут стоить переход и заявка в вашем регионе при разных бюджетах.'],
  ['Собираю кампании и предложение', 'Реклама для тех, кто ищет юриста по банкротству, с предупреждением о последствиях, которого с 2026 года требует статья 28.1.'],
  ['Настраиваю цели в Метрике и отчитываюсь', 'Форма, звонок и мессенджер считаются отдельно, видно, с какой рекламы пришел клиент.'],
]

const whoItems = [
  'Работаю один, без менеджера между нами, веду 2-3 проекта одновременно и каждый лично',
  'Четыре года юридического образования, поэтому понимаю, как устроена практика и как юристы говорят с клиентами',
  'Сайт собираю и правлю сам, правка текста занимает день, а не две недели через подрядчика',
]

const contractItems = ['Состав работ по каждому этапу', 'Срок каждого этапа', 'Отчет о сделанном']

const refusals = [
  'Нужна гарантия цены лида или замена брака',
  'Нужна гарантия по количеству заявок или возврат денег при отсутствии результата',
  'Реклама должна обещать списание долгов',
  'Бюджет на проект меньше 50 000 ₽. Если маркетинговый анализ у вас уже есть, порог 39 000 ₽',
  'Нужна реклама во ВКонтакте. Я работаю только с Яндекс Директом',
]

const faq = [
  [
    'Чем это лучше покупки лидов?',
    'Купленная заявка заканчивается вместе с оплатой. Свой канал остается у вас, а статистика копится в вашем кабинете месяц за месяцем, и через несколько месяцев вы знаете, какие запросы приносят договоры. От чужих условий и цен вы больше не зависите.',
  ],
  [
    'Сколько будет стоить заявка?',
    'До запуска считаю прогноз по вашему региону в трех сценариях бюджета, чтобы вы сравнили цену заявки с ценой лида заранее. Реальная цифра появится через 2-4 недели. Первые две недели уходят на сбор данных и чистку площадок, оценивать канал раньше месяца бессмысленно.',
  ],
  [
    'Я уже покупал рекламу, деньги ушли впустую',
    'Чаще всего кампании настроены без разбора аудитории и ведут на страницу, которая не отвечает на вопросы человека. Разбор как раз показывает, где именно это произошло.',
  ],
  [
    'Вы не в моем городе',
    'Вся работа идет удаленно, договор подписывается электронно. Реклама настраивается на ваш регион, из пяти моих проектов только один в моем городе.',
  ],
  [
    'Что будет после заявки?',
    'Отвечу в течение 30 минут. Потом 20 минут знакомства, разбор вашего сайта и рекламы документом за 24 часа после доступов, встреча по брифу и видео с предложением. Доступы к сайту и кабинетам регистрируются на вас.',
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
          <h1 className="hero__headline">Помогаю юристам по банкротству получать заявки из Яндекса без зависимости от лидогенераторов</h1>
          <p className="hero__lead">
            Запуск за 20 рабочих дней, кабинет на вашей фирме. В легализации коммерческих объектов одна сделка окупила маркетинг минимум в 11 раз.
          </p>
          <div className="hero__cta">
            <CtaButton {...cta('s-bankrotstvo-hero')} />
            <p className="hero__help">Бесплатно. Откроется чат со мной в Telegram, отвечу в течение 30 минут</p>
            <p className="hero__help hero__direct">
              Или позвоните <a href="tel:+79180220901">{contacts.phone}</a>
            </p>
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
        Да, цена лида записана в договоре. Но вы платите за чужой трафик, и с последним платежом заканчивается все.
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
            <h3 className="vs-card__title">Свой канал в Яндекс Директе</h3>
          </header>
          {ownChannel.map((item) => (
            <p className="vs-card__item" key={item}>
              <CheckIcon />
              <span>{item}</span>
            </p>
          ))}
        </article>
      </div>
      <p className="vs-conclusion">Нужен поток на месяц, проще купить лиды. Нужен канал на годы, его строят в своем кабинете.</p>
    </Section>
  )
}

function Process() {
  return (
    <Section id="steps" containerClassName="stack">
      <h2 className="section-heading">Что происходит до первой заявки</h2>
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
    <Section containerClassName="about">
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
        <CasePreviewCard
          {...legalCase}
          pageTitle="Другая ниша, тот же метод. Одна сделка окупила маркетинг минимум в 11 раз за три месяца"
          description={['Первая заявка в первый же месяц работы', 'Поиск в 18 регионах, 3 цели в Метрике']}
        />
        <CasePreviewCard
          {...bankruptcyCase}
          statusLabel="Анализ завершен"
          description={[
            '5 типов клиентских запросов, у каждого свой повод обратиться',
            'Конкуренты разобраны по одинаковым параметрам',
            'По анализу запускаются реклама, сайт и айдентика',
          ]}
        />
      </div>
    </Section>
  )
}

function daysText(duration) {
  const n = Number(String(duration).replace(/\D/g, ''))
  const last = n % 10
  const word = last === 1 && n % 100 !== 11 ? 'рабочий день' : last >= 2 && last <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'рабочих дня' : 'рабочих дней'
  return `Запуск примерно через ${n} ${word}`
}

const directPackage = packages.find((item) => item.id === 'direct')
const trafficPackage = packages.find((item) => item.id === 'traffic')
const withAds = (monthly) => `первый месяц рекламы включен, дальше ${monthly} в месяц`

// Цены берутся из общих данных (src/entities/pricing), поэтому совпадают с главной.
const tariffs = [
  {
    id: 'reklama',
    name: 'Только реклама',
    price: adsMonthly,
    note: 'в месяц',
    items: ['Семантика, объявления и баннеры', 'Настройка и ведение кампаний', 'Ежедневные отчеты'],
    term: `Запуск примерно через ${adsLaunchDays} рабочих дней`,
  },
  {
    id: 'direkt',
    name: 'Директ',
    price: directPackage.price,
    note: withAds(directPackage.monthly),
    items: ['Все из первого варианта', 'Анализ ниши, конкурентов и аудитории'],
    term: daysText(directPackage.duration),
    recommended: true,
  },
  {
    id: 'trafik',
    name: 'Трафик',
    price: trafficPackage.price,
    note: withAds(trafficPackage.monthly),
    items: ['Все из второго варианта', 'Лендинг под банкротство'],
    term: daysText(trafficPackage.duration),
  },
]

const tariffHref = (name) =>
  `https://t.me/tigran_front?text=${encodeURIComponent(`Здравствуйте, интересует тариф «${name}» для фирмы по банкротству`)}`

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 4.6V8l2.3 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Price() {
  return (
    <Section id="prices" containerClassName="stack">
      <h2 className="section-heading">Три варианта старта</h2>
      <p className="section-lead">Анализ ниши входит в оба пакета. Если свой анализ уже есть, хватит первого варианта.</p>
      <div className="tariffs">
        {tariffs.map((tariff) => (
          <article className={tariff.recommended ? 'tariff tariff--recommended' : 'tariff'} key={tariff.id}>
            <header className="tariff__head">
              <h3 className="tariff__name">{tariff.name}</h3>
              {tariff.recommended && <span className="tariff__badge">Рекомендую</span>}
            </header>
            <p className="tariff__price">{tariff.price}</p>
            <p className="tariff__note">{tariff.note}</p>
            <ul className="tariff__list">
              {tariff.items.map((item) => (
                <li key={item}>
                  <CheckIcon size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="tariff__term">
              <ClockIcon />
              <span>{tariff.term}</span>
            </p>
            <CtaButton
              source={`s-bankrotstvo-tariff-${tariff.id}`}
              href={tariffHref(tariff.name)}
              label="Выбрать"
              className={tariff.recommended ? 'tariff__btn' : 'tariff__btn tariff__btn--outline'}
            />
          </article>
        ))}
      </div>
      <div className="tariffs-foot">
        <p className="tariffs-foot__budget">Рекламный бюджет оплачиваете отдельно, на свой кабинет.</p>
        <div className="tariffs-foot__cta">
          <CtaButton {...cta('s-bankrotstvo-price')} />
          <p className="tariffs-foot__caption">Разбор бесплатный, отвечу за 30 минут</p>
        </div>
      </div>
    </Section>
  )
}

function Guarantees() {
  return (
    <Section id="contract" containerClassName="stack">
      <h2 className="section-heading">Не гарантирую цену лида. Фиксирую срок каждого этапа в договоре</h2>
      <p className="section-lead">
        Лидогенератор может гарантировать цену заявки, потому что продает свой трафик и меняет брак из своего запаса. Я строю канал в вашем кабинете. Цена заявки в нем зависит от рынка вашего региона, от сайта и от того, как быстро ваш менеджер перезванивает. Этим я не управляю, поэтому в договоре фиксирую то, за что отвечаю сам.
      </p>
      <div className="terms-grid">
        <div className="terms-col">
          <h3 className="terms-col__title">Что записано в договоре</h3>
          <ul className="terms-list">
            {contractItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="terms-col">
          <h3 className="terms-col__title">Не возьмусь за проект, если</h3>
          <ul className="terms-list">
            {refusals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
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

/** Отдельная страница под рекламу по банкротству. Главная остается как есть, кампания ведет сюда. */
export function BankrotstvoPage() {
  return (
    <>
      <Seo fullTitleText={TITLE} description={DESCRIPTION} path="/bankrotstvo" />
      <div className="bankrotstvo-page">
        <Header telegram={{ href: contacts.bankruptcyChatUrl, block: ctaName('s-bankrotstvo-header') }} />
        <main>
          <Hero />
          <CasesBlock />
          <Reviews id="reviews" />
          <Situations />
          <Compare />
          <Price />
          <Process />
          <Who />
          <Guarantees />
          <Faq />
          <Audit
            id="audit"
            pageName="/bankrotstvo"
            telegramHref={contacts.bankruptcyChatUrl}
            showAuditLink={false}
            copy={{
              eyebrow: 'Разбор',
              heading: 'Покажу, где ваша реклама по банкротству теряет заявки',
              lead: 'Пришлите ссылку на сайт или на кабинет Директа. Посмотрю их вместе с объявлениями конкурентов в вашем регионе, проверю на требования статьи 28.1 и вернусь со списком точек роста. Бесплатно и без обязательств.',
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
