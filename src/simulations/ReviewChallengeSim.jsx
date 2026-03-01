import { useState, useRef, useEffect, useCallback } from 'react';
import './simStyles.css';

export default function ReviewChallengeSim() {
  const canvasRef = useRef(null);
  const [scenario, setScenario] = useState('drop');
  const [v0, setV0] = useState(10);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const animRef = useRef(null);
  const startRef = useRef(null);
  const g = 10;

  const scenarios = {
    drop: { name: 'Free Fall Drop', height: 45, angle: 0, launchV: 0 },
    throwUp: { name: 'Throw Up', height: 0, angle: 90, launchV: v0 },
    horizontal: { name: 'Horizontal Launch', height: 40, angle: 0, launchV: v0 },
    projectile: { name: 'Projectile 45°', height: 0, angle: 45, launchV: v0 },
  };

  const sc = scenarios[scenario];
  const rad = (sc.angle * Math.PI) / 180;
  const vx0 = scenario === 'horizontal' ? sc.launchV : sc.launchV * Math.cos(rad);
  const vy0 = scenario === 'drop' ? 0 : sc.launchV * Math.sin(rad);

  const getX = (t) => vx0 * t;
  const getY = (t) => sc.height + vy0 * t - 0.5 * g * t * t;

  // Calculate total time
  let maxTime;
  if (scenario === 'drop') {
    maxTime = Math.sqrt(2 * sc.height / g);
  } else if (scenario === 'throwUp') {
    maxTime = 2 * vy0 / g;
  } else {
    // Solve height + vy0*t - 0.5*g*t^2 = 0
    const disc = vy0 * vy0 + 2 * g * sc.height;
    maxTime = (vy0 + Math.sqrt(Math.max(0, disc))) / g;
  }
  maxTime = Math.max(0.5, maxTime);

  const reset = () => {
    setRunning(false);
    setTime(0);
    startRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  useEffect(() => { reset(); }, [scenario, v0]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#DBEAFE');
    grad.addColorStop(1, '#F1F5F9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const groundY = H - 35;
    const leftPad = 50;

    // Ground
    ctx.fillStyle = '#86EFAC';
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    // Calculate max extents for scaling
    let maxXExtent = 0;
    let maxYExtent = 0;
    for (let t = 0; t <= maxTime; t += 0.02) {
      maxXExtent = Math.max(maxXExtent, getX(t));
      maxYExtent = Math.max(maxYExtent, getY(t));
    }
    maxXExtent = Math.max(maxXExtent, 10);
    maxYExtent = Math.max(maxYExtent, 10);

    const scaleX = (W - leftPad - 20) / (maxXExtent * 1.2 || 1);
    const scaleY = (groundY - 30) / (maxYExtent * 1.3);

    // Full path (faded)
    ctx.strokeStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let t = 0; t <= maxTime; t += 0.02) {
      const px = leftPad + getX(t) * scaleX;
      const py = groundY - Math.max(0, getY(t)) * scaleY;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Current path
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let t = 0; t <= Math.min(time, maxTime); t += 0.02) {
      const px = leftPad + getX(t) * scaleX;
      const py = groundY - Math.max(0, getY(t)) * scaleY;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Ball
    const ct = Math.min(time, maxTime);
    const bx = leftPad + getX(ct) * scaleX;
    const by = groundY - Math.max(0, getY(ct)) * scaleY;

    ctx.fillStyle = '#4F46E5';
    ctx.beginPath();
    ctx.arc(bx, by, 8, 0, Math.PI * 2);
    ctx.fill();

    // Info box
    const curY = Math.max(0, getY(ct));
    const curVx = vx0;
    const curVy = vy0 - g * ct;
    const curSpeed = Math.sqrt(curVx * curVx + curVy * curVy);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(W - 170, 10, 160, 75);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.strokeRect(W - 170, 10, 160, 75);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(sc.name, W - 162, 26);

    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`x: ${getX(ct).toFixed(1)}m  y: ${curY.toFixed(1)}m`, W - 162, 42);
    ctx.fillText(`vₓ: ${curVx.toFixed(1)}  vᵧ: ${curVy.toFixed(1)} m/s`, W - 162, 56);
    ctx.fillText(`speed: ${curSpeed.toFixed(1)} m/s`, W - 162, 70);
    ctx.fillText(`t: ${ct.toFixed(2)}s`, W - 162, 82);
  }, [time, scenario, v0, vx0, vy0, maxTime, g, sc]);

  useEffect(() => {
    if (!running) { draw(); return; }
    startRef.current = performance.now() - time * 1000;
    const animate = (now) => {
      const t = (now - startRef.current) / 1000;
      if (t >= maxTime) {
        setTime(maxTime);
        setRunning(false);
        return;
      }
      setTime(t);
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, draw, time, maxTime]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="sim-container">
      <div className="sim-canvas-wrapper">
        <canvas ref={canvasRef} width={600} height={280} />
      </div>
      <div className="sim-controls">
        <div className="sim-control" style={{ minWidth: 180 }}>
          <label>Scenario</label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <option value="drop">Free Fall Drop</option>
            <option value="throwUp">Throw Upward</option>
            <option value="horizontal">Horizontal Launch</option>
            <option value="projectile">Projectile 45°</option>
          </select>
        </div>
        {scenario !== 'drop' && (
          <div className="sim-control">
            <label>Launch Speed: {v0} m/s</label>
            <input type="range" min={5} max={25} step={1} value={v0}
              onChange={(e) => setV0(Number(e.target.value))} />
          </div>
        )}
        <button className="sim-btn" onClick={() => setRunning(!running)}>
          {running ? '⏸ Pause' : '▶ Go'}
        </button>
        <button className="sim-btn sim-btn-reset" onClick={reset}>↺ Reset</button>
      </div>
    </div>
  );
}
