import { useState, useRef, useEffect, useCallback } from 'react';
import './simStyles.css';

export default function VelocityBasicsSim() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [velocity, setVelocity] = useState(5);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [position, setPosition] = useState(0);
  const startTimeRef = useRef(null);
  const positionRef = useRef(0);

  const reset = () => {
    setRunning(false);
    setTime(0);
    setPosition(0);
    positionRef.current = 0;
    startTimeRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(0, H - 40, W, 40);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 40);
    ctx.lineTo(W, H - 40);
    ctx.stroke();

    // Distance markers
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let d = 0; d <= 100; d += 10) {
      const px = 30 + (d / 100) * (W - 60);
      ctx.beginPath();
      ctx.moveTo(px, H - 40);
      ctx.lineTo(px, H - 35);
      ctx.stroke();
      ctx.fillText(`${d}m`, px, H - 22);
    }

    // Car (simple rectangle)
    const carX = 30 + (positionRef.current / 100) * (W - 60);
    const carY = H - 60;

    ctx.fillStyle = '#4F46E5';
    ctx.beginPath();
    ctx.roundRect(carX - 20, carY - 12, 40, 20, 4);
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(carX - 10, carY + 10, 5, 0, Math.PI * 2);
    ctx.arc(carX + 10, carY + 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Velocity arrow
    if (Math.abs(velocity) > 0) {
      const arrowLen = velocity * 4;
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(carX, carY - 20);
      ctx.lineTo(carX + arrowLen, carY - 20);
      ctx.stroke();

      const dir = velocity > 0 ? 1 : -1;
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(carX + arrowLen, carY - 20);
      ctx.lineTo(carX + arrowLen - dir * 8, carY - 25);
      ctx.lineTo(carX + arrowLen - dir * 8, carY - 15);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`v = ${velocity} m/s`, carX + arrowLen / 2, carY - 28);
    }

    // Position-time mini-graph
    const gx = W - 150;
    const gy = 10;
    const gw = 130;
    const gh = 70;

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(gx, gy, gw, gh);

    ctx.fillStyle = '#64748B';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Position vs Time', gx + 5, gy + 12);

    // Graph line
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const t = time;
    const maxT = 10;
    for (let i = 0; i <= Math.min(t, maxT); i += 0.1) {
      const px = gx + 5 + (i / maxT) * (gw - 10);
      const py = gy + gh - 5 - ((velocity * i) / 100) * (gh - 15);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }, [velocity, time]);

  useEffect(() => {
    if (!running) {
      draw();
      return;
    }

    startTimeRef.current = performance.now() - time * 1000;

    const animate = (now) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const newPos = velocity * elapsed;

      if (newPos >= 100 || newPos <= -10) {
        setRunning(false);
        return;
      }

      positionRef.current = newPos;
      setTime(elapsed);
      setPosition(newPos);
      draw();
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [running, velocity, draw, time]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="sim-container">
      <div className="sim-canvas-wrapper">
        <canvas ref={canvasRef} width={600} height={180} />
      </div>

      <div className="sim-controls">
        <div className="sim-control">
          <label>Velocity: {velocity} m/s</label>
          <input
            type="range"
            min={-10}
            max={15}
            step={1}
            value={velocity}
            onChange={(e) => { setVelocity(Number(e.target.value)); if (!running) reset(); }}
          />
        </div>
        <button className="sim-btn" onClick={() => running ? setRunning(false) : setRunning(true)}>
          {running ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="sim-btn sim-btn-reset" onClick={reset}>↺ Reset</button>
      </div>

      <div className="sim-readout">
        <div className="sim-readout-item">
          <span className="sim-readout-value">{position.toFixed(1)}m</span>
          <span className="sim-readout-label">Position</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{time.toFixed(1)}s</span>
          <span className="sim-readout-label">Time</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{velocity} m/s</span>
          <span className="sim-readout-label">Velocity</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{time > 0 ? (position / time).toFixed(1) : '0.0'} m/s</span>
          <span className="sim-readout-label">Avg Velocity</span>
        </div>
      </div>
    </div>
  );
}
