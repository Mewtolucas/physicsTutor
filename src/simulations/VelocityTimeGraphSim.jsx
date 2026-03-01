import { useState, useRef, useEffect, useCallback } from 'react';
import './simStyles.css';

export default function VelocityTimeGraphSim() {
  const canvasRef = useRef(null);
  const [v0, setV0] = useState(2);
  const [accel, setAccel] = useState(2);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const animRef = useRef(null);
  const startRef = useRef(null);

  const reset = () => {
    setRunning(false);
    setTime(0);
    startRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  useEffect(() => { reset(); }, [v0, accel]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const gL = 50, gR = W - 20, gT = 20, gB = H - 30;
    const gw = gR - gL, gh = gB - gT;
    const maxT = 8;
    const vRange = 30; // -15 to +15
    const vZeroY = gT + gh / 2; // v=0 line

    // Grid
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      const x = gL + (i / 8) * gw;
      ctx.beginPath(); ctx.moveTo(x, gT); ctx.lineTo(x, gB); ctx.stroke();
    }
    for (let i = 0; i <= 6; i++) {
      const y = gT + (i / 6) * gh;
      ctx.beginPath(); ctx.moveTo(gL, y); ctx.lineTo(gR, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gL, gT); ctx.lineTo(gL, gB); ctx.lineTo(gR, gB);
    ctx.stroke();

    // v=0 line
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(gL, vZeroY);
    ctx.lineTo(gR, vZeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#64748B';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time (s)', (gL + gR) / 2, H - 5);

    ctx.save();
    ctx.translate(12, (gT + gB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Velocity (m/s)', 0, 0);
    ctx.restore();

    // Tick labels
    ctx.font = '10px Inter, sans-serif';
    for (let i = 0; i <= maxT; i++) {
      ctx.textAlign = 'center';
      ctx.fillText(i, gL + (i / maxT) * gw, gB + 14);
    }
    ctx.textAlign = 'right';
    for (let v = -15; v <= 15; v += 5) {
      const y = vZeroY - (v / (vRange / 2)) * (gh / 2);
      if (y >= gT && y <= gB) ctx.fillText(v, gL - 8, y + 4);
    }

    // Draw v-t line
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let ti = 0; ti <= maxT; ti += 0.05) {
      const v = v0 + accel * ti;
      const clampedV = Math.max(-15, Math.min(15, v));
      const px = gL + (ti / maxT) * gw;
      const py = vZeroY - (clampedV / (vRange / 2)) * (gh / 2);
      if (ti === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Shaded area (displacement) up to current time
    if (time > 0) {
      ctx.beginPath();
      ctx.moveTo(gL, vZeroY);
      for (let ti = 0; ti <= time; ti += 0.05) {
        const v = v0 + accel * ti;
        const clampedV = Math.max(-15, Math.min(15, v));
        const px = gL + (ti / maxT) * gw;
        const py = vZeroY - (clampedV / (vRange / 2)) * (gh / 2);
        ctx.lineTo(px, py);
      }
      ctx.lineTo(gL + (time / maxT) * gw, vZeroY);
      ctx.closePath();

      const displacement = v0 * time + 0.5 * accel * time * time;
      ctx.fillStyle = displacement >= 0 ? 'rgba(79, 70, 229, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      ctx.fill();
    }

    // Current point
    if (time > 0) {
      const curV = v0 + accel * time;
      const cx = gL + (time / maxT) * gw;
      const cy = vZeroY - (Math.max(-15, Math.min(15, curV)) / (vRange / 2)) * (gh / 2);
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Area label
    if (time > 0.5) {
      const displacement = v0 * time + 0.5 * accel * time * time;
      ctx.fillStyle = '#4F46E5';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Area = Δx = ${displacement.toFixed(1)}m`, gL + (time / maxT / 2) * gw, vZeroY + (displacement >= 0 ? 15 : -10));
    }

    // Title
    ctx.fillStyle = '#4F46E5';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('v-t Graph: Area = Displacement', gL + 10, gT + 15);
  }, [v0, accel, time]);

  useEffect(() => {
    if (!running) { draw(); return; }
    startRef.current = performance.now() - time * 1000;
    const animate = (now) => {
      const t = (now - startRef.current) / 1000;
      if (t > 8) { setRunning(false); setTime(8); return; }
      setTime(t);
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, draw, time]);

  useEffect(() => { draw(); }, [draw]);

  const curV = v0 + accel * time;
  const displacement = v0 * time + 0.5 * accel * time * time;

  return (
    <div className="sim-container">
      <div className="sim-canvas-wrapper">
        <canvas ref={canvasRef} width={600} height={300} />
      </div>
      <div className="sim-controls">
        <div className="sim-control">
          <label>Initial Velocity: {v0} m/s</label>
          <input type="range" min={-10} max={10} step={1} value={v0}
            onChange={(e) => setV0(Number(e.target.value))} />
        </div>
        <div className="sim-control">
          <label>Acceleration: {accel} m/s²</label>
          <input type="range" min={-5} max={5} step={0.5} value={accel}
            onChange={(e) => setAccel(Number(e.target.value))} />
        </div>
        <button className="sim-btn" onClick={() => setRunning(!running)}>
          {running ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="sim-btn sim-btn-reset" onClick={reset}>↺ Reset</button>
      </div>
      <div className="sim-readout">
        <div className="sim-readout-item">
          <span className="sim-readout-value">{time.toFixed(1)}s</span>
          <span className="sim-readout-label">Time</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{curV.toFixed(1)} m/s</span>
          <span className="sim-readout-label">Velocity</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{displacement.toFixed(1)}m</span>
          <span className="sim-readout-label">Displacement (area)</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{accel} m/s²</span>
          <span className="sim-readout-label">Slope = Accel</span>
        </div>
      </div>
    </div>
  );
}
