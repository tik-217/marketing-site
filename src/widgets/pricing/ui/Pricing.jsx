import { homeTariffs } from '../../../entities/pricing'
import { Section } from '../../../shared/ui'
import { TariffCards } from './TariffCards'

const tariffHref = (tariff) =>
  `https://t.me/tigran_front?text=${encodeURIComponent(`Здравствуйте, интересует тариф «${tariff.name}»`)}`

/** Три тарифа на главной. Те же карточки, что на /bankrotstvo. Якорь #direct ведет сюда. */
export function Pricing() {
  return (
    <Section id="direct" containerClassName="stack">
      <h2 className="section-heading">Разбор вашей ниши уже входит в каждый тариф</h2>
      <p className="section-lead">
        Перед запуском разбираю спрос и конкурентов в вашей нише, поэтому сайт и реклама собираются под ваших клиентов. Презентации и КП делаю отдельно, по запросу.
      </p>
      <TariffCards tariffs={homeTariffs} getHref={tariffHref} sourcePrefix="s-pricing-tariff" />
      <div className="tariffs-foot">
        <div className="stack stack--tight">
          <p className="tariffs-foot__budget">Рекламный бюджет оплачиваете отдельно, на свой кабинет.</p>
          <p className="tariffs-foot__budget">Айдентику и ведение Телеграм-канала делаю по запросу.</p>
        </div>
      </div>
    </Section>
  )
}
