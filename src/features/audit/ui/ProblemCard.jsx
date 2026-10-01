export function ProblemCard({ problem, index, label }) {
  const hasCompare = problem.currentText || problem.suggestedText

  return (
    <article className="ad-problem">
      <span className="ad-tag">{label ?? `Проблема ${index + 1}`}</span>
      <h3 className="ad-problem__title">{problem.title}</h3>
      <dl className="ad-problem__body">
        <div>
          <dt>Что видно на странице</dt>
          <dd>{problem.observed}</dd>
        </div>
        <div>
          <dt>Почему это мешает заявкам</dt>
          <dd>{problem.reason}</dd>
        </div>
        <div>
          <dt>Что изменить</dt>
          <dd>{problem.action}</dd>
        </div>
      </dl>
      {hasCompare && (
        <div className="ad-compare">
          {problem.currentText && (
            <div className="ad-compare__box">
              <span className="ad-compare__label">Сейчас</span>
              <q>{problem.currentText}</q>
            </div>
          )}
          {problem.suggestedText && (
            <div className="ad-compare__box ad-compare__box--new">
              <span className="ad-compare__label">Предложенный вариант</span>
              <q>{problem.suggestedText}</q>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
