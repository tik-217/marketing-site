export function ProblemCard({ problem, index }) {
  const hasCompare = problem.currentText || problem.suggestedText

  return (
    <article className="ad-card ad-problem">
      <div className="ad-problem__head">
        <span className="ad-tag">Проблема {index + 1}</span>
        <h3 className="ad-problem__title">{problem.title}</h3>
      </div>
      <div className="ad-field ad-field--muted">
        <span>Что видно на странице</span>
        <p>{problem.observed}</p>
      </div>
      <div className="ad-field ad-field--muted">
        <span>Почему это мешает заявкам</span>
        <p>{problem.reason}</p>
      </div>
      <div className="ad-field">
        <span>Что изменить</span>
        <p>{problem.action}</p>
      </div>
      {hasCompare && (
        <div className="ad-compare">
          {problem.currentText && (
            <div className="ad-compare__box">
              <span className="ad-tag">Сейчас</span>
              <p>{problem.currentText}</p>
            </div>
          )}
          {problem.suggestedText && (
            <div className="ad-compare__box ad-compare__box--new">
              <span className="ad-tag ad-tag--accent">Предложенный вариант</span>
              <p>{problem.suggestedText}</p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
