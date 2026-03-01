import { useState, useRef, useEffect, useCallback } from 'react';
import './simStyles.css';

export default function PositionTimeGraphSim() {
  const canvasRef = useRef(null);
  const [motionType, setMotionType] = useState('constant'); // constant, accelerating, decelerating
  const [speed, setSpeed] = useState(5);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const animRef = useRef(null);
  const startRef = useRef(null);

  const getPosition = useCallback((t) => {
    switch (motionType) {
      case 'constant': return speed * t;
      case 'accelerating': return 0.5 * speed * 0.5 * t * t;
      case 'decelerating': return speed * t - 0.25 * t * t;
      default: return 0;
    }
  }, [motionType, speed]);

  const getVelocity = useCallback((t) => {
    switch (motionType) {
      case 'constant': return speed;
      case 'accelerating': return speed * 0.5 * t;
      case 'decelerating': return speed - 0.5 * t;
      default: return 0;
    }
  }, [motionType, speed]);

  const reset = () => {
    setRunning(false);
    setTime(0);
    startRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const graphLeft = 50;
    const graphRight = W - 20;
    const graphTop = 20;
    const graphBottom = H - 30;
    const gw = graphRight - graphLeft;
    const gh = graphBottom - graphTop;
    const maxT = 10;
    const maxX = 60;

    // Grid
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = graphTop + (i / 10) * gh;
      ctx.beginPath();
      ctx.moveTo(graphLeft, y);
      ctx.lineTo(graphRight, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
      const x = graphLeft + (i / 10) * gw;
      ctx.beginPath();
      ctx.moveTo(x, graphTop);
      ctx.lineTo(x, graphBottom);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(graphLeft, graphTop);
    ctx.lineTo(graphLeft, graphBottom);
    ctx.lineTo(graphRight, graphBottom);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#64748B';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time (s)', (graphLeft + graphRight) / 2, H - 5);

    ctx.save();
    ctx.translate(12, (graphTop + graphBottom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Position (m)', 0, 0);
    ctx.restore();

    // Tick labels
    ctx.font = '10px Inter, sans-serif';
    for (let i = 0; i <= 10; i += 2) {
      const x = graphLeft + (i / maxT) * gw;
      ctx.fillText(i, x, graphBottom + 14);
    }
    ctx.textAlign = 'right';
    for (let i = 0; i <= maxX; i += 10) {
      const y = graphBottom - (i / maxX) * gh;
      ctx.fillText(i, graphLeft - 8, y + 4);
    }

    // Draw the curve
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const drawUpTo = running ? time : maxT;
    for (let ti = 0; ti <= drawUpTo; ti += 0.05) {
      const pos = Math.max(0, Math.min(getPosition(ti), maxX));
      const px = graphLeft + (ti / maxT) * gw;
      const py = graphBottom - (pos / maxX) * gh;
      if (ti === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current point
    if (running || time > 0) {
      const curPos = Math.max(0, Math.min(getPosition(time), maxX));
      const cx = graphLeft + (time / maxT) * gw;
      const cy = graphBottom - (curPos / maxX) * gh;

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();

      // Tangent line (slope = velocity)
      const vel = getVelocity(time);
      const slope = vel / (maxX / gh) * (gw / maxT);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy + 40 * slope / (gw / maxT) * (maxX / gh));
      ctx.lineTo(cx + 40, cy - 40 * slope / (gw / maxT) * (maxX / gh));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Title on graph
    ctx.fillStyle = '#4F46E5';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    const label = motionType === 'constant' ? 'Constant Velocity' :
      motionType === 'accelerating' ? 'Accelerating' : 'Decelerating';
    ctx.fillText(`x-t Graph: ${label}`, graphLeft + 10, graphTop + 15);
  }, [time, motionType, speed, running, getPosition, getVelocity]);

  useEffect(() => {
    if (!running) { draw(); return; }

    startRef.current = performance.now() - time * 1000;
    const animate = (now) => {
      const t = (now - startRef.current) / 1000;
      if (t > 10) { setRunning(false); setTime(10); return; }
      setTime(t);
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, draw, time]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { reset(); }, [motionType, speed]);

  const curPos = getPosition(time);
  const curVel = getVelocity(time);

  return (
    <div className="sim-container">
      <div className="sim-canvas-wrapper">
        <canvas ref={canvasRef} width={600} height={300} />
      </div>

      <div className="sim-controls">
        <div className="sim-control" style={{ minWidth: 200 }}>
          <label>Motion Type</label>
          <select
            value={motionType}
            onChange={(e) => setMotionType(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <option value="constant">Constant Velocity</option>
            <option value="accelerating">Accelerating</option>
            <option value="decelerating">Decelerating</option>
          </select>
        </div>
        <div className="sim-control">
          <label>Speed: {speed} m/s</label>
          <input type="range" min={1} max={10} step={1} value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))} />
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
          <span className="sim-readout-value">{curPos.toFixed(1)}m</span>
          <span className="sim-readout-label">Position</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{curVel.toFixed(1)} m/s</span>
          <span className="sim-readout-label">Slope = Velocity</span>
        </div>
      </div>
    </div>
  );
}
