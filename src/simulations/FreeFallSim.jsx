import { useState, useRef, useEffect, useCallback } from 'react';
import './simStyles.css';

export default function FreeFallSim() {
  const canvasRef = useRef(null);
  const [height, setHeight] = useState(80);
  const [initVel, setInitVel] = useState(0); // positive = upward
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const animRef = useRef(null);
  const startRef = useRef(null);
  const g = 10;

  const getY = (t) => height + initVel * t - 0.5 * g * t * t;
  const getV = (t) => initVel - g * t;

  const reset = () => {
    setRunning(false);
    setTime(0);
    startRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  useEffect(() => { reset(); }, [height, initVel]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const maxH = 120;
    const groundY = H - 30;
    const topY = 20;
    const scaleY = (groundY - topY) / maxH;

    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#DBEAFE');
    grad.addColorStop(1, '#F1F5F9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = '#86EFAC';
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    // Height markers
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let h = 0; h <= maxH; h += 20) {
      const y = groundY - h * scaleY;
      ctx.beginPath();
      ctx.moveTo(25, y);
      ctx.lineTo(35, y);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillText(`${h}m`, 23, y + 4);
    }

    // Ball position
    const curY = getY(time);
    const curV = getV(time);
    const ballScreenY = groundY - Math.max(0, curY) * scaleY;
    const ballX = W / 2;

    // Trail
    ctx.fillStyle = 'rgba(79, 70, 229, 0.08)';
    for (let t = 0; t < time; t += 0.08) {
      const y = getY(t);
      if (y >= 0) {
        const sy = groundY - y * scaleY;
        ctx.beginPath();
        ctx.arc(ballX, sy, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Ball
    if (curY >= 0) {
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.beginPath();
      ctx.ellipse(ballX, groundY - 2, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#4F46E5';
      ctx.beginPath();
      ctx.arc(ballX, ballScreenY, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(ballX - 4, ballScreenY - 4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Velocity arrow
      if (Math.abs(curV) > 0.5) {
        const arrowLen = curV * 2;
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ballX + 22, ballScreenY);
        ctx.lineTo(ballX + 22, ballScreenY - arrowLen);
        ctx.stroke();

        const dir = curV > 0 ? -1 : 1;
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.moveTo(ballX + 22, ballScreenY - arrowLen);
        ctx.lineTo(ballX + 17, ballScreenY - arrowLen + dir * 8);
        ctx.lineTo(ballX + 27, ballScreenY - arrowLen + dir * 8);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`v = ${curV.toFixed(1)} m/s`, ballX + 32, ballScreenY);
      }

      // g arrow (always down)
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ballX - 22, ballScreenY);
      ctx.lineTo(ballX - 22, ballScreenY + 30);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(ballX - 22, ballScreenY + 30);
      ctx.lineTo(ballX - 27, ballScreenY + 22);
      ctx.lineTo(ballX - 17, ballScreenY + 22);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('g = 10 m/s²', ballX - 30, ballScreenY + 20);
    }

    // Impact text
    if (curY <= 0 && time > 0) {
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('IMPACT!', ballX, groundY - 10);
    }
  }, [time, height, initVel, g]);

  useEffect(() => {
    if (!running) { draw(); return; }
    startRef.current = performance.now() - time * 1000;
    const animate = (now) => {
      const t = (now - startRef.current) / 1000;
      const y = getY(t);
      if (y <= 0 && t > 0.1) {
        setTime(t);
        setRunning(false);
        return;
      }
      setTime(t);
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, draw, time]);

  useEffect(() => { draw(); }, [draw]);

  const curY = Math.max(0, getY(time));
  const curV = getV(time);
  const speed = Math.abs(curV);

  return (
    <div className="sim-container">
      <div className="sim-canvas-wrapper">
        <canvas ref={canvasRef} width={600} height={300} />
      </div>
      <div className="sim-controls">
        <div className="sim-control">
          <label>Drop Height: {height}m</label>
          <input type="range" min={10} max={100} step={5} value={height}
            onChange={(e) => setHeight(Number(e.target.value))} />
        </div>
        <div className="sim-control">
          <label>Initial Velocity: {initVel} m/s {initVel > 0 ? '(up)' : initVel < 0 ? '(down)' : ''}</label>
          <input type="range" min={-15} max={20} step={1} value={initVel}
            onChange={(e) => setInitVel(Number(e.target.value))} />
        </div>
        <button className="sim-btn" onClick={() => setRunning(!running)}>
          {running ? '⏸ Pause' : '▶ Drop'}
        </button>
        <button className="sim-btn sim-btn-reset" onClick={reset}>↺ Reset</button>
      </div>
      <div className="sim-readout">
        <div className="sim-readout-item">
          <span className="sim-readout-value">{time.toFixed(2)}s</span>
          <span className="sim-readout-label">Time</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{curY.toFixed(1)}m</span>
          <span className="sim-readout-label">Height</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{curV.toFixed(1)} m/s</span>
          <span className="sim-readout-label">Velocity</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{speed.toFixed(1)} m/s</span>
          <span className="sim-readout-label">Speed</span>
        </div>
      </div>
    </div>
  );
}
