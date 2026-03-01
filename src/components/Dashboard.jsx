import { useNavigate } from 'react-router-dom';
import { units } from '../data/units';
import './Dashboard.css';

export default function Dashboard({ getUnitProgress }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h1>AP Physics 1</h1>
        <p>Master physics through interactive lessons, simulations, and practice problems.</p>
      </div>

      <div className="units-grid">
        {units.map((unit) => {
          const progress = getUnitProgress(unit.id, unit.lessons.length);
          const progressPercent = Math.round(progress * 100);
          return (
            <div
              key={unit.id}
              className={`unit-card ${!unit.available ? 'unit-locked' : ''}`}
              style={{ '--unit-color': unit.color }}
              onClick={() => unit.available && navigate(`/unit/${unit.id}`)}
            >
              <div className="unit-card-header">
                <span className="unit-icon">{unit.icon}</span>
                <span className="unit-number">Unit {unit.id}</span>
                {!unit.available && <span className="unit-lock">🔒</span>}
              </div>
              <h3 className="unit-title">{unit.title}</h3>
              <p className="unit-desc">{unit.description}</p>
              <div className="unit-meta">
                <span className="unit-lessons">{unit.lessons.length} lessons</span>
                {unit.available && progressPercent > 0 && (
                  <span className="unit-progress-text">{progressPercent}%</span>
                )}
              </div>
              {unit.available && (
                <div className="unit-progress-bar">
                  <div
                    className="unit-progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              )}
              {!unit.available && (
                <div className="unit-coming-soon">Coming Soon</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
