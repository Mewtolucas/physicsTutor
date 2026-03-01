import { useState } from 'react';
import './Problem.css';

export default function Problem({ problem, onComplete, onNext }) {
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [sliderValue, setSliderValue] = useState(
    problem.type === 'slider-predict' ? problem.sliderMin : 0
  );
  const [showHint, setShowHint] = useState(false);

  const checkAnswer = () => {
    let isCorrect = false;

    switch (problem.type) {
      case 'multiple-choice':
        isCorrect = selectedOption === problem.correctIndex;
        break;
      case 'fill-in': {
        const val = parseFloat(inputValue);
        const ans = parseFloat(problem.answer);
        isCorrect = !isNaN(val) && Math.abs(val - ans) <= (problem.tolerance || 0.01);
        break;
      }
      case 'slider-predict': {
        isCorrect = Math.abs(sliderValue - problem.answer) <= (problem.tolerance || 1);
        break;
      }
      default:
        break;
    }

    setCorrect(isCorrect);
    setAnswered(true);
    onComplete(isCorrect, isCorrect ? problem.xp : 0);
  };

  const canSubmit = () => {
    switch (problem.type) {
      case 'multiple-choice':
        return selectedOption !== null;
      case 'fill-in':
        return inputValue.trim() !== '';
      case 'slider-predict':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="problem">
      <h3 className="problem-question">{problem.question}</h3>

      {problem.type === 'multiple-choice' && (
        <div className="mc-options">
          {problem.options.map((option, idx) => {
            let className = 'mc-option';
            if (answered) {
              if (idx === problem.correctIndex) className += ' mc-correct';
              else if (idx === selectedOption) className += ' mc-incorrect';
            } else if (idx === selectedOption) {
              className += ' mc-selected';
            }

            return (
              <button
                key={idx}
                className={className}
                onClick={() => !answered && setSelectedOption(idx)}
                disabled={answered}
              >
                <span className="mc-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="mc-text">{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {problem.type === 'fill-in' && (
        <div className="fill-in-area">
          <div className="fill-in-input-group">
            <input
              type="number"
              className={`fill-in-input ${answered ? (correct ? 'input-correct' : 'input-incorrect') : ''}`}
              value={inputValue}
              onChange={(e) => !answered && setInputValue(e.target.value)}
              placeholder="Your answer"
              disabled={answered}
              onKeyDown={(e) => e.key === 'Enter' && canSubmit() && !answered && checkAnswer()}
            />
            {problem.unit && <span className="fill-in-unit">{problem.unit}</span>}
          </div>
          {answered && !correct && (
            <div className="correct-answer">
              Correct answer: {problem.answer} {problem.unit}
            </div>
          )}
        </div>
      )}

      {problem.type === 'slider-predict' && (
        <div className="slider-area">
          <div className="slider-display">
            <span className="slider-value">{sliderValue} {problem.unit}</span>
          </div>
          <input
            type="range"
            className="slider-input"
            min={problem.sliderMin}
            max={problem.sliderMax}
            step={problem.sliderStep}
            value={sliderValue}
            onChange={(e) => !answered && setSliderValue(Number(e.target.value))}
            disabled={answered}
          />
          <div className="slider-range">
            <span>{problem.sliderMin} {problem.unit}</span>
            <span>{problem.sliderMax} {problem.unit}</span>
          </div>
          {answered && !correct && (
            <div className="correct-answer">
              Correct answer: {problem.answer} {problem.unit}
            </div>
          )}
        </div>
      )}

      {!answered && (
        <div className="problem-actions">
          <button
            className="btn-primary"
            onClick={checkAnswer}
            disabled={!canSubmit()}
          >
            Check Answer
          </button>
          {!showHint && problem.explanation && (
            <button className="btn-hint" onClick={() => setShowHint(true)}>
              💡 Show Hint
            </button>
          )}
        </div>
      )}

      {showHint && !answered && (
        <div className="hint-box">
          <span className="hint-label">Hint:</span> Think about the relationship between the variables in the problem.
        </div>
      )}

      {answered && (
        <div className={`feedback ${correct ? 'feedback-correct' : 'feedback-incorrect'}`}>
          <div className="feedback-header">
            <span className="feedback-icon">{correct ? '✅' : '❌'}</span>
            <span className="feedback-title">
              {correct ? 'Correct!' : 'Not quite'}
              {correct && ` +${problem.xp} XP`}
            </span>
          </div>
          <p className="feedback-explanation">{problem.explanation}</p>
          <button className="btn-primary" onClick={onNext}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
