import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { cases } from '../../../entities/case'
import { packages } from '../../../entities/pricing'
import { contacts } from '../../../shared/config/contacts'
import { Seo } from '../../../shared/lib/seo'
import { Button, CtaButton, LoopVideo, Section } from '../../../shared/ui'
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

const compareRows = [
  ['Чей сайт и рекламный кабинет', 'Поставщика', 'Ваш, зарегистрирован на вас'],
  ['Кто еще получает заявку', 'Зависит от условий поставщика', 'Только вы'],
  ['Что остается, если перестать платить', 'Ничего', 'Сайт, кампании и статистика за все месяцы'],
  ['Цена заявки', 'Фиксирована, на рынке от 150 до 600 ₽ за лид', 'Зависит от вашего региона и сайта, первые 2-4 недели уходят на настройку'],
  ['Гарантия', 'Замена брака', 'Сроки этапов и отчет в договоре'],
  ['Видно ли, какая реклама приносит договоры', 'Нет, видно только заявки', 'Да, цели в Метрике и отчет по каждой кампании'],
]

const process = [
  ['Записываю задачу в цифрах.', 'Средний чек, сколько фирма готова платить за заявку и сколько консультаций доходит до договора.'],
  ['Делю клиентов по типам запросов.', 'В последнем анализе по банкротству вышло пять типов, у каждого свой повод обратиться.'],
  ['Разбираю объявления конкурентов в вашем регионе.', 'Что они обещают, как объясняют цену и соблюдают ли новые правила рекламы банкротства.'],
  ['Считаю прогноз до запуска.', 'Сколько будут стоить переход и заявка в вашем регионе при разных бюджетах.'],
  ['Собираю кампании и предложение.', 'Показываю рекламу тем, кто ищет юриста по банкротству, с предупреждением о последствиях по статье 28.1.'],
  ['Настраиваю цели в Метрике и отчитываюсь.', 'Форма, звонок и мессенджер считаются отдельно, видно, с какой рекламы пришел клиент.'],
]

const aboutItems = [
  'Анапа. Работаю удаленно со всеми регионами, по договору',
  'Полгода практики в маркетинге, два юридических проекта в работе прямо сейчас',
  'Четыре года юридического образования, поэтому понимаю, как устроена практика и как юристы говорят с клиентами',
  'Больше года продуктовой разработки, в том числе в Сбере. Сайт собираю и правлю сам, правка текста занимает день, а не две недели через подрядчика',
  'Веду 2-3 проекта одновременно, каждый лично',
]

const contractItems = ['Состав работ по каждому этапу', 'Срок каждого этапа', 'Отчет о сделанном']

const refusals = [
  'Нужна гарантия цены лида или замена брака',
  'Нужна гарантия по количеству заявок или возврат денег при отсутствии результата',
  'Реклама должна обещать списание долгов',
  'Бюджет на проект меньше 50 000 ₽. Если маркетинговый анализ у вас уже есть, порог 40 000 ₽',
  'Нужна реклама во ВКонтакте. Я работаю только с Яндекс Директом',
]

const faq = [
  [
    'Чем это лучше покупки лидов?',
    'Купленная заявка заканчивается вместе с оплатой. Свой канал остается у вас, а статистика копится в вашем кабинете месяц за месяцем. В первый месяц заявка может стоить дороже, чем у поставщика. Зато дальше вы видите, какие запросы приносят договоры, и не зависите от чужих условий.',
  ],
  [
    'Сколько будет стоить заявка?',
    'До запуска считаю прогноз по вашему региону в трех сценариях бюджета. Реальная цифра появится через 2-4 недели. Первые две недели уходят на сбор данных и чистку площадок, оценивать канал раньше месяца бессмысленно.',
  ],
  [
    'Можно ли сейчас рекламировать банкротство?',
    'Можно, если реклама не обещает освобождение от долгов и предупреждает о последствиях банкротства по статье 28.1 закона о рекламе. Под эти требования собираю объявления и сайт.',
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
          <h1 className="hero__headline">Свои заявки на банкротство из Яндекса вместо покупных лидов</h1>
          <p className="hero__lead">
            Настраиваю рекламу юристам по банкротству физлиц. Сайт и рекламный кабинет регистрируются на вас, заявка приходит только вам, а канал остается, даже когда мы закончим работать.
          </p>
          <p className="hero__proof">
            В легализации коммерческих объектов одна сделка окупила маркетинг минимум в 11 раз за три месяца. В банкротстве работаю тем же методом, сначала разбираю спрос и конкурентов в вашем регионе.
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
      <Button as={Link} to="/audit" className="btn--outline" style={{ alignSelf: 'flex-start' }}>
        Проверить свой сайт за 30 секунд <span aria-hidden="true">→</span>
      </Button>
    </Section>
  )
}

function Compare() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Покупные лиды или свой канал</h2>
      <p className="section-lead">
        Да, у лидогенератора цена заявки предсказуемее, она записана в договоре. Но вы платите за чужой трафик, и когда платежи заканчиваются, заканчивается все.
      </p>
      <table className="rt rt--compare">
        <thead>
          <tr>
            <th scope="col"><span className="visually-hidden">Что сравниваем</span></th>
            <th scope="col">Покупные лиды</th>
            <th scope="col">Свой канал в Яндекс Директе</th>
          </tr>
        </thead>
        <tbody>
          {compareRows.map(([label, leads, own]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td data-label="Покупные лиды">{leads}</td>
              <td data-label="Свой канал в Яндекс Директе">{own}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="lead-conclusion">
        Если нужен поток на месяц, проще купить лиды. Если нужен канал, который будет работать и через год, его строят в своем кабинете.
      </p>
    </Section>
  )
}

function Process() {
  return (
    <Section containerClassName="stack">
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

const bankruptcyCase = cases.find((item) => item.id === 'bankruptcy')
const legalCase = cases.find((item) => item.id === 'legal')

function CasesBlock() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Кейсы в юридической нише</h2>
      <div className="case-preview-grid">
        <CasePreviewCard
          {...bankruptcyCase}
          statusLabel="Анализ завершен"
          description={[
            '5 типов клиентских запросов, у каждого свой повод обратиться',
            'Конкуренты разобраны по одинаковым параметрам',
            'По анализу запускаются реклама, сайт и айдентика',
          ]}
        />
        <CasePreviewCard
          {...legalCase}
          pageTitle="Другая ниша, тот же метод. Одна сделка окупила маркетинг минимум в 11 раз за три месяца"
          description={['Первая заявка в первый же месяц работы', 'Поиск в 18 регионах, 3 цели в Метрике']}
        />
      </div>
    </Section>
  )
}

function Law() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Собираю рекламу банкротства с учетом статьи 28.1</h2>
      <div className="stack" style={{ gap: 'var(--space-4)', maxWidth: '62ch', color: 'var(--text-secondary)' }}>
        <p>
          С 1 января 2026 года в законе о рекламе действует статья 28.1. Реклама услуг по банкротству граждан не может обещать освобождение от долгов и должна предупреждать о последствиях банкротства. Предупреждение занимает не меньше 7% рекламной площади.
        </p>
        <p>
          Объявления и сайт под банкротство собираю с учетом этих требований. В бесплатном разборе отдельно проверяю, как ваша текущая реклама им соответствует.
        </p>
      </div>
    </Section>
  )
}

function Price() {
  const [direct, traffic] = [packages.find((p) => p.id === 'direct'), packages.find((p) => p.id === 'traffic')]
  const rows = [
    [direct.title, 'Сайт есть, заявок мало', 'Анализ и реклама в Яндекс Директе', `${direct.price}, дальше ${direct.monthly} в месяц`, `${direct.duration} рабочих дней`],
    [traffic.title, 'Сайта нет или он не продает', 'Анализ, сайт и реклама', `${traffic.price}, дальше ${traffic.monthly} в месяц`, `${traffic.duration} рабочих дней`],
  ]
  const labels = ['Пакет', 'Когда подходит', 'Что входит', 'Цена', 'Срок до запуска']
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Два варианта старта</h2>
      <p className="section-lead">
        Любая работа начинается с маркетингового анализа. Если актуальный анализ у вас уже есть, работаю по нему.
      </p>
      <table className="rt rt--price">
        <thead>
          <tr>
            {labels.map((label) => (
              <th scope="col" key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td data-label={labels[index]} key={labels[index]}>{index === 0 ? <strong>{cell}</strong> : cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="lead-conclusion">
        Рекламный бюджет вы оплачиваете отдельно, на свой кабинет. Разбор сайта и рекламы бесплатный. Остальные модули и пакеты на <Link to="/">главной странице</Link>.
      </p>
    </Section>
  )
}

function About() {
  return (
    <Section containerClassName="about">
      <div className="about__body">
        <h2 className="section-heading">Со мной вы работаете напрямую, без менеджера между нами</h2>
        <ul className="about__list">
          {aboutItems.map((item) => (
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

function Guarantees() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Не гарантирую цену лида. Фиксирую срок каждого этапа в договоре</h2>
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
    <Section containerClassName="stack stack--tight">
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
      <div>
        <Header />
        <main>
          <Hero />
          <Situations />
          <Compare />
          <Process />
          <CasesBlock />
          <Law />
          <Price />
          <About />
          <Guarantees />
          <Reviews />
          <Faq />
          <Audit
            id="audit"
            pageName="/bankrotstvo"
            copy={{
              eyebrow: 'Разбор',
              heading: 'Покажу, где ваша реклама по банкротству теряет заявки',
              lead: 'Пришлите ссылку на сайт или на кабинет Директа. Посмотрю их вместе с объявлениями конкурентов в вашем регионе, проверю на требования статьи 28.1 и вернусь со списком точек роста. Бесплатно и без обязательств.',
            }}
            cta={cta('s-bankrotstvo-form')}
          />
        </main>
        <Footer />
      </div>
    </>
  )
}
