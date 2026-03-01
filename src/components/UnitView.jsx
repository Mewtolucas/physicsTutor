import { useParams, useNavigate } from 'react-router-dom';
import { units } from '../data/units';
import './UnitView.css';

export default function UnitView({ isLessonCompleted, getLessonScore, getUnitProgress }) {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const unit = units.find((u) => u.id === Number(unitId));

  if (!unit) return <div className="not-found">Unit not found</div>;

  const progress = getUnitProgress(unit.id, unit.lessons.length);
  const progressPercent = Math.round(progress * 100);

  return (
    <div className="unit-view">
      <div className="unit-view-header" style={{ '--unit-color': unit.color }}>
        <div className="unit-view-icon">{unit.icon}</div>
        <div>
          <div className="unit-view-label">Unit {unit.id}</div>
          <h1 className="unit-view-title">{unit.title}</h1>
          <p className="unit-view-desc">{unit.description}</p>
        </div>
      </div>

      <div className="unit-overall-progress">
        <div className="unit-overall-bar">
          <div
            className="unit-overall-fill"
            style={{ width: `${progressPercent}%`, background: unit.color }}
          />
        </div>
        <span className="unit-overall-text">{progressPercent}% complete</span>
      </div>

      <div className="lessons-list">
        {unit.lessons.map((lesson, idx) => {
          const completed = isLessonCompleted(unit.id, lesson.id);
          const score = getLessonScore(unit.id, lesson.id);
          const isAvailable = unit.available;

          return (
            <div
              key={lesson.id}
              className={`lesson-item ${completed ? 'lesson-completed' : ''} ${!isAvailable ? 'lesson-locked' : ''}`}
              onClick={() => isAvailable && navigate(`/unit/${unit.id}/lesson/${lesson.id}`)}
            >
              <div className="lesson-number" style={{ background: completed ? unit.color : undefined }}>
                {completed ? '✓' : idx + 1}
              </div>
              <div className="lesson-info">
                <h3 className="lesson-title">{lesson.title}</h3>
                <p className="lesson-subtitle">{lesson.subtitle}</p>
              </div>
              <div className="lesson-right">
                {completed && (
                  <div className="lesson-score">
                    <span className="lesson-score-stars">
                      {score >= 100 ? '★★★' : score >= 66 ? '★★☆' : '★☆☆'}
                    </span>
                  </div>
                )}
                {!completed && isAvailable && (
                  <span className="lesson-start">Start →</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
