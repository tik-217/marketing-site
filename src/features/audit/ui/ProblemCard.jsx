export function ProblemCard({ problem, index, label }) {
  return (
    <article className="audit-problem">
      <header className="audit-problem__head">
        {label ? (
          <span className="audit-problem__tag">{label}</span>
        ) : (
          <span className="audit-problem__num">{String(index + 1).padStart(2, '0')}</span>
        )}
        <h3 className="audit-problem__title">{problem.title}</h3>
      </header>
      <dl className="audit-problem__body">
        <div>
          <dt>Что вижу</dt>
          <dd>{problem.observed}</dd>
        </div>
        <div>
          <dt>Почему это важно</dt>
          <dd>{problem.reason}</dd>
        </div>
        <div>
          <dt>Что сделать</dt>
          <dd>{problem.action}</dd>
        </div>
        {problem.currentText && (
          <div>
            <dt>Сейчас</dt>
            <dd>
              <q className="audit-quote">{problem.currentText}</q>
            </dd>
          </div>
        )}
        {problem.suggestedText && (
          <div>
            <dt>Вариант</dt>
            <dd>
              <q className="audit-quote audit-quote--suggested">{problem.suggestedText}</q>
            </dd>
          </div>
        )}
      </dl>
    </article>
  )
}
