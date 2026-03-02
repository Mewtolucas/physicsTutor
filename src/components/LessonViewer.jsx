import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { units } from '../data/units';
import { kinematicsLessons } from '../data/kinematicsLessons';
import Problem from './Problem';
import SimulationRenderer from './SimulationRenderer';
import AIChat from './AIChat';
import './LessonViewer.css';

const lessonDataMap = {
  1: kinematicsLessons,
};

function shuffleAndPick(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function LessonViewer({ addXP, completeLesson, saveProblemResult }) {
  const { unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const uid = Number(unitId);
  const lid = Number(lessonId);

  const unit = units.find((u) => u.id === uid);
  const lessonMeta = unit?.lessons.find((l) => l.id === lid);
  const lessonContent = lessonDataMap[uid]?.[lid];

  const [step, setStep] = useState(0);
  const [problemsDone, setProblemsDone] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [currentSet, setCurrentSet] = useState(-1); // -1 = instructional, 0/1/2 = practice sets
  const [sessionKey, setSessionKey] = useState(0);

  // Randomly select 5 problems from each practice set pool
  const selectedProblems = useMemo(() => {
    if (!lessonContent) return [];
    return lessonContent.practiceSets.map((set) => shuffleAndPick(set.pool, 5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, lid, sessionKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setStep(0);
    setProblemsDone(0);
    setCorrectCount(0);
    setShowComplete(false);
    setXpEarned(0);
    setCurrentSet(-1);
    setSessionKey((k) => k + 1);
  }, [unitId, lessonId]);

  if (!unit || !lessonMeta || !lessonContent) {
    return <div className="not-found">Lesson not found</div>;
  }

  // Build steps: sections → instructional problem → practice set intros + problems → complete
  const allSteps = [];

  // Instructional sections
  lessonContent.sections.forEach((s, i) => {
    allSteps.push({ type: 'section', data: s, index: i });
  });

  // Instructional problem
  allSteps.push({ type: 'instructional', data: lessonContent.instructionalProblem });

  // Practice sets
  lessonContent.practiceSets.forEach((set, setIdx) => {
    allSteps.push({ type: 'set-intro', setIndex: setIdx, data: set });
    const problems = selectedProblems[setIdx] || [];
    problems.forEach((p, pIdx) => {
      allSteps.push({ type: 'practice', data: p, setIndex: setIdx, problemIndex: pIdx });
    });
  });

  allSteps.push({ type: 'complete' });

  const totalProblems = 1 + selectedProblems.reduce((sum, set) => sum + set.length, 0);
  const totalSteps = allSteps.length;
  const currentStep = allSteps[step];
  const progressPercent = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkipSet = () => {
    // Find the next set-intro or complete step
    for (let i = step + 1; i < totalSteps; i++) {
      if (allSteps[i].type === 'set-intro' || allSteps[i].type === 'complete') {
        setStep(i);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    // Fallback: go to last step
    setStep(totalSteps - 1);
  };

  const handleProblemComplete = (correct, xp) => {
    setProblemsDone((d) => d + 1);
    if (correct) {
      setCorrectCount((c) => c + 1);
      setXpEarned((x) => x + xp);
      addXP(xp);
    }
    saveProblemResult(uid, lid, problemsDone, correct);
  };

  const handleFinishLesson = () => {
    const score = totalProblems > 0 ? Math.round((correctCount / totalProblems) * 100) : 100;
    const completionXP = 25;
    addXP(completionXP);
    setXpEarned((x) => x + completionXP);
    completeLesson(uid, lid, score);
    setShowComplete(true);
  };

  const goToNextLesson = () => {
    const nextLesson = unit.lessons.find((l) => l.id === lid + 1);
    if (nextLesson) {
      navigate(`/unit/${uid}/lesson/${nextLesson.id}`);
    } else {
      navigate(`/unit/${uid}`);
    }
  };

  const renderSection = (section) => {
    switch (section.type) {
      case 'explanation':
        return (
          <div className="section-explanation">
            <h2 className="section-title">{section.title}</h2>
            <div className="section-content">
              {section.content.split('\n\n').map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: formatText(p) }} />
              ))}
            </div>
          </div>
        );

      case 'concept':
        return (
          <div className="section-concept">
            <h2 className="section-title">{section.title}</h2>
            <div className="section-content">
              {section.content.split('\n\n').map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: formatText(p) }} />
              ))}
            </div>
            {section.formula && (
              <div className="formula-card">
                <div className="formula-label">{section.formulaLabel}</div>
                <div className="formula-content">
                  {section.formula.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            )}
            {section.misconception && (
              <div className="misconception-box">
                <div className="misconception-label">Common Misconception</div>
                <p dangerouslySetInnerHTML={{ __html: formatText(section.misconception) }} />
              </div>
            )}
          </div>
        );

      case 'keyIdea':
        return (
          <div className="section-key-idea">
            <div className="key-idea-icon">💡</div>
            <div className="key-idea-content">
              <h3>Key Idea</h3>
              <p dangerouslySetInnerHTML={{ __html: formatText(section.content) }} />
            </div>
          </div>
        );

      case 'simulation':
        return (
          <div className="section-simulation">
            <h3 className="sim-header">Interactive Simulation</h3>
            <p className="sim-instruction">Adjust the controls and observe how the variables change!</p>
            <SimulationRenderer simId={section.id} />
          </div>
        );

      case 'summary':
        return (
          <div className="section-summary">
            <h3 className="summary-title">Lesson Summary</h3>
            <ul className="summary-list">
              {section.points.map((point, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: formatText(point) }} />
              ))}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Beginner';
      case 'medium': return 'Intermediate';
      case 'hard': return 'Advanced';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#059669';
      case 'medium': return '#D97706';
      case 'hard': return '#DC2626';
      default: return '#6366F1';
    }
  };

  if (showComplete) {
    const score = totalProblems > 0 ? Math.round((correctCount / totalProblems) * 100) : 100;
    return (
      <div className="lesson-complete">
        <div className="complete-celebration">
          {score >= 100 ? '🏆' : score >= 66 ? '🎉' : '👍'}
        </div>
        <h2>Lesson Complete!</h2>
        <p className="complete-lesson-name">{lessonMeta.title}</p>

        <div className="complete-stats">
          <div className="complete-stat">
            <span className="complete-stat-value">{correctCount}/{problemsDone}</span>
            <span className="complete-stat-label">Correct</span>
          </div>
          <div className="complete-stat">
            <span className="complete-stat-value">{score}%</span>
            <span className="complete-stat-label">Score</span>
          </div>
          <div className="complete-stat">
            <span className="complete-stat-value">+{xpEarned}</span>
            <span className="complete-stat-label">XP Earned</span>
          </div>
        </div>

        <div className="complete-stars">
          {score >= 33 ? '★' : '☆'}
          {score >= 66 ? '★' : '☆'}
          {score >= 100 ? '★' : '☆'}
        </div>

        <div className="complete-actions">
          <button className="btn-primary" onClick={goToNextLesson}>
            {unit.lessons.find((l) => l.id === lid + 1) ? 'Next Lesson →' : 'Back to Unit'}
          </button>
          <button className="btn-secondary" onClick={() => {
            setStep(0);
            setProblemsDone(0);
            setCorrectCount(0);
            setShowComplete(false);
            setXpEarned(0);
            setCurrentSet(-1);
            setSessionKey((k) => k + 1);
          }}>
            Retry Lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-viewer">
      <div className="lesson-progress">
        <div className="lesson-progress-bar">
          <div className="lesson-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="lesson-progress-text">
          {step + 1} / {totalSteps}
        </span>
      </div>

      <div className="lesson-header-info">
        <span className="lesson-unit-badge" style={{ background: unit.color }}>
          Unit {uid}
        </span>
        <h1 className="lesson-view-title">{lessonMeta.title}</h1>
      </div>

      <div className="lesson-step-content">
        {currentStep.type === 'section' && renderSection(currentStep.data)}

        {currentStep.type === 'instructional' && (
          <div className="problem-wrapper">
            <div className="problem-label instructional-label">
              Guided Problem
            </div>
            <Problem
              key={`${uid}-${lid}-instructional-${sessionKey}`}
              problem={currentStep.data}
              onComplete={handleProblemComplete}
              onNext={handleNext}
            />
          </div>
        )}

        {currentStep.type === 'set-intro' && (
          <div className="set-intro">
            <div
              className="set-difficulty-badge"
              style={{ background: getDifficultyColor(currentStep.data.difficulty) }}
            >
              {getDifficultyLabel(currentStep.data.difficulty)}
            </div>
            <h2 className="set-intro-title">
              Practice Set {currentStep.setIndex + 1}: {currentStep.data.title}
            </h2>
            <p className="set-intro-desc">
              {currentStep.data.required
                ? '5 randomly selected problems. Complete this set to finish the lesson.'
                : '5 randomly selected problems. This set is optional — skip if you\'re confident.'}
            </p>
            <div className="set-intro-actions">
              <button className="btn-primary" onClick={handleNext}>
                Start Set →
              </button>
              {!currentStep.data.required && (
                <button className="btn-secondary" onClick={handleSkipSet}>
                  Skip This Set →
                </button>
              )}
            </div>
          </div>
        )}

        {currentStep.type === 'practice' && (
          <div className="problem-wrapper">
            <div className="problem-label-row">
              <span
                className="set-difficulty-badge set-badge-small"
                style={{ background: getDifficultyColor(lessonContent.practiceSets[currentStep.setIndex].difficulty) }}
              >
                Set {currentStep.setIndex + 1}
              </span>
              <span className="problem-counter">
                Problem {currentStep.problemIndex + 1} of 5
              </span>
            </div>
            <Problem
              key={`${uid}-${lid}-set${currentStep.setIndex}-p${currentStep.problemIndex}-${sessionKey}`}
              problem={currentStep.data}
              onComplete={handleProblemComplete}
              onNext={handleNext}
            />
          </div>
        )}

        {currentStep.type === 'complete' && (
          <div className="lesson-finish-prompt">
            <h2>Ready to finish?</h2>
            <p>You've completed all sections and problems in this lesson.</p>
            <button className="btn-primary btn-large" onClick={handleFinishLesson}>
              Complete Lesson
            </button>
          </div>
        )}
      </div>

      <div className="lesson-nav">
        <button
          className="btn-secondary"
          onClick={handlePrev}
          disabled={step === 0}
        >
          ← Previous
        </button>
        {currentStep.type === 'section' && (
          <button className="btn-primary" onClick={handleNext}>
            Continue →
          </button>
        )}
      </div>

      <AIChat lessonTitle={lessonMeta.title} lessonContent={lessonContent} />
    </div>
  );
}

function formatText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}
