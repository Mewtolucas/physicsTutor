import { useState, useRef, useEffect, useCallback } from 'react';
import './simStyles.css';

export default function ProjectileMotionSim() {
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(20);
  const [angle, setAngle] = useState(45);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const animRef = useRef(null);
  const startRef = useRef(null);
  const g = 10;

  const rad = (angle * Math.PI) / 180;
  const v0x = speed * Math.cos(rad);
  const v0y = speed * Math.sin(rad);
  const totalTime = (2 * v0y) / g;
  const maxHeight = (v0y * v0y) / (2 * g);
  const range = (speed * speed * Math.sin(2 * rad)) / g;

  const getX = (t) => v0x * t;
  const getY = (t) => v0y * t - 0.5 * g * t * t;

  const reset = () => {
    setRunning(false);
    setTime(0);
    startRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  useEffect(() => { reset(); }, [speed, angle]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Sky
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#DBEAFE');
    grad.addColorStop(1, '#F1F5F9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const groundY = H - 40;
    const leftPad = 60;
    const maxRange = Math.max(range, 50);
    const maxH = Math.max(maxHeight, 20);
    const scaleX = (W - leftPad - 20) / (maxRange * 1.2);
    const scaleY = (groundY - 30) / (maxH * 1.4);

    // Ground
    ctx.fillStyle = '#86EFAC';
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    // Full trajectory (dashed)
    ctx.strokeStyle = 'rgba(79, 70, 229, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let t = 0; t <= totalTime; t += 0.02) {
      const px = leftPad + getX(t) * scaleX;
      const py = groundY - getY(t) * scaleY;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Traveled trajectory
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let t = 0; t <= Math.min(time, totalTime); t += 0.02) {
      const px = leftPad + getX(t) * scaleX;
      const py = groundY - Math.max(0, getY(t)) * scaleY;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current ball
    const curT = Math.min(time, totalTime);
    const cx = leftPad + getX(curT) * scaleX;
    const cy = groundY - Math.max(0, getY(curT)) * scaleY;

    // Velocity components
    const vx = v0x;
    const vy = v0y - g * curT;
    const arrowScale = 1.5;

    // vx arrow (horizontal, blue)
    if (Math.abs(vx) > 0.5) {
      ctx.strokeStyle = '#0891B2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + vx * arrowScale, cy);
      ctx.stroke();
      ctx.fillStyle = '#0891B2';
      ctx.beginPath();
      ctx.moveTo(cx + vx * arrowScale, cy);
      ctx.lineTo(cx + vx * arrowScale - 6, cy - 4);
      ctx.lineTo(cx + vx * arrowScale - 6, cy + 4);
      ctx.closePath();
      ctx.fill();
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`vₓ=${vx.toFixed(1)}`, cx + vx * arrowScale / 2, cy + 15);
    }

    // vy arrow (vertical, red)
    if (Math.abs(vy) > 0.5) {
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - vy * arrowScale);
      ctx.stroke();
      ctx.fillStyle = '#EF4444';
      const dir = vy > 0 ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy - vy * arrowScale);
      ctx.lineTo(cx - 4, cy - vy * arrowScale + dir * 6);
      ctx.lineTo(cx + 4, cy - vy * arrowScale + dir * 6);
      ctx.closePath();
      ctx.fill();
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`vᵧ=${vy.toFixed(1)}`, cx + 8, cy - vy * arrowScale / 2);
    }

    // Ball
    ctx.fillStyle = '#4F46E5';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    // Range marker
    if (range > 0) {
      const rx = leftPad + range * scaleX;
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(rx, groundY);
      ctx.lineTo(rx, groundY - 10);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#64748B';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`R = ${range.toFixed(1)}m`, rx, groundY + 14);
    }

    // Max height marker
    if (maxHeight > 0) {
      const hy = groundY - maxHeight * scaleY;
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(leftPad, hy);
      ctx.lineTo(leftPad + range * scaleX / 2, hy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#64748B';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`H = ${maxHeight.toFixed(1)}m`, leftPad - 5, hy + 4);
    }

    // Launch angle indicator
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(leftPad, groundY, 30, -rad, 0);
    ctx.stroke();
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${angle}°`, leftPad + 34, groundY - 5);
  }, [time, speed, angle, v0x, v0y, totalTime, maxHeight, range, g]);

  useEffect(() => {
    if (!running) { draw(); return; }
    startRef.current = performance.now() - time * 1000;
    const animate = (now) => {
      const t = (now - startRef.current) / 1000;
      if (t >= totalTime) {
        setTime(totalTime);
        setRunning(false);
        return;
      }
      setTime(t);
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, draw, time, totalTime]);

  useEffect(() => { draw(); }, [draw]);

  const curX = getX(Math.min(time, totalTime));
  const curY = Math.max(0, getY(Math.min(time, totalTime)));
  const curVy = v0y - g * Math.min(time, totalTime);

  return (
    <div className="sim-container">
      <div className="sim-canvas-wrapper">
        <canvas ref={canvasRef} width={600} height={300} />
      </div>
      <div className="sim-controls">
        <div className="sim-control">
          <label>Launch Speed: {speed} m/s</label>
          <input type="range" min={5} max={40} step={1} value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))} />
        </div>
        <div className="sim-control">
          <label>Launch Angle: {angle}°</label>
          <input type="range" min={5} max={85} step={1} value={angle}
            onChange={(e) => setAngle(Number(e.target.value))} />
        </div>
        <button className="sim-btn" onClick={() => setRunning(!running)}>
          {running ? '⏸ Pause' : '▶ Launch'}
        </button>
        <button className="sim-btn sim-btn-reset" onClick={reset}>↺ Reset</button>
      </div>
      <div className="sim-readout">
        <div className="sim-readout-item">
          <span className="sim-readout-value">{Math.min(time, totalTime).toFixed(2)}s</span>
          <span className="sim-readout-label">Time</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{curX.toFixed(1)}m</span>
          <span className="sim-readout-label">Horizontal</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{curY.toFixed(1)}m</span>
          <span className="sim-readout-label">Height</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{range.toFixed(1)}m</span>
          <span className="sim-readout-label">Range</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{maxHeight.toFixed(1)}m</span>
          <span className="sim-readout-label">Max Height</span>
        </div>
      </div>
    </div>
  );
}
