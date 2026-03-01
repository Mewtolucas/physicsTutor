import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useProgress } from './hooks/useProgress';
import Dashboard from './components/Dashboard';
import UnitView from './components/UnitView';
import LessonViewer from './components/LessonViewer';
import './App.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const progressHook = useProgress();
  const { progress } = progressHook;

  const showBack = location.pathname !== '/';

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          {showBack && (
            <button className="header-back" onClick={() => navigate(-1)}>
              ← Back
            </button>
          )}
          <div className="header-logo" onClick={() => navigate('/')}>
            Physics<span>Tutor</span>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <span>{progress.xp}</span>
            <span className="stat-label">XP</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span>{progress.streak}</span>
            <span className="stat-label">day streak</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard {...progressHook} />} />
          <Route path="/unit/:unitId" element={<UnitView {...progressHook} />} />
          <Route path="/unit/:unitId/lesson/:lessonId" element={<LessonViewer {...progressHook} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
