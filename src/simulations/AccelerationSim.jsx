import { useState, useRef, useEffect, useCallback } from 'react';
import './simStyles.css';

export default function AccelerationSim() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [initVel, setInitVel] = useState(0);
  const [accel, setAccel] = useState(3);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const stateRef = useRef({ pos: 0, vel: 0, t: 0 });

  const reset = () => {
    setRunning(false);
    setTime(0);
    stateRef.current = { pos: 0, vel: initVel, t: 0 };
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  useEffect(() => { reset(); }, [initVel, accel]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const { pos, vel, t } = stateRef.current;
    const maxPos = 150;

    // Ground
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(0, H - 35, W, 35);
    ctx.strokeStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.moveTo(0, H - 35);
    ctx.lineTo(W, H - 35);
    ctx.stroke();

    // Object
    const objX = 40 + Math.max(0, Math.min(pos, maxPos)) / maxPos * (W - 80);
    const objY = H - 55;

    // Trail dots
    ctx.fillStyle = 'rgba(79, 70, 229, 0.15)';
    for (let ti = 0; ti < t; ti += 0.3) {
      const p = initVel * ti + 0.5 * accel * ti * ti;
      const dx = 40 + Math.max(0, Math.min(p, maxPos)) / maxPos * (W - 80);
      ctx.beginPath();
      ctx.arc(dx, objY + 10, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Object
    ctx.fillStyle = '#4F46E5';
    ctx.beginPath();
    ctx.arc(objX, objY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('m', objX, objY + 4);

    // Velocity arrow (green)
    if (Math.abs(vel) > 0.1) {
      const vLen = vel * 3;
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(objX, objY - 22);
      ctx.lineTo(objX + vLen, objY - 22);
      ctx.stroke();

      const dir = vel > 0 ? 1 : -1;
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.moveTo(objX + vLen, objY - 22);
      ctx.lineTo(objX + vLen - dir * 7, objY - 27);
      ctx.lineTo(objX + vLen - dir * 7, objY - 17);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`v = ${vel.toFixed(1)} m/s`, objX + vLen / 2, objY - 30);
    }

    // Acceleration arrow (red)
    if (Math.abs(accel) > 0.1) {
      const aLen = accel * 8;
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(objX, objY + 28);
      ctx.lineTo(objX + aLen, objY + 28);
      ctx.stroke();
      ctx.setLineDash([]);

      const dir = accel > 0 ? 1 : -1;
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(objX + aLen, objY + 28);
      ctx.lineTo(objX + aLen - dir * 6, objY + 24);
      ctx.lineTo(objX + aLen - dir * 6, objY + 32);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(`a = ${accel} m/s²`, objX + aLen / 2, objY + 44);
    }

    // Legend
    ctx.textAlign = 'left';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#10B981';
    ctx.fillText('— Velocity', 10, 15);
    ctx.fillStyle = '#EF4444';
    ctx.fillText('--- Acceleration', 10, 28);
  }, [initVel, accel]);

  useEffect(() => {
    if (!running) { draw(); return; }

    let lastTime = performance.now();
    const animate = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const s = stateRef.current;
      s.vel = initVel + accel * s.t;
      s.pos = initVel * s.t + 0.5 * accel * s.t * s.t;
      s.t += dt;
      setTime(s.t);

      if (s.pos > 150 || s.pos < -10 || s.t > 12) {
        setRunning(false);
        return;
      }

      draw();
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, initVel, accel, draw]);

  useEffect(() => { draw(); }, [draw]);

  const currentVel = initVel + accel * time;
  const currentPos = initVel * time + 0.5 * accel * time * time;

  return (
    <div className="sim-container">
      <div className="sim-canvas-wrapper">
        <canvas ref={canvasRef} width={600} height={160} />
      </div>

      <div className="sim-controls">
        <div className="sim-control">
          <label>Initial Velocity: {initVel} m/s</label>
          <input type="range" min={-5} max={10} step={1} value={initVel}
            onChange={(e) => setInitVel(Number(e.target.value))} />
        </div>
        <div className="sim-control">
          <label>Acceleration: {accel} m/s²</label>
          <input type="range" min={-5} max={8} step={0.5} value={accel}
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
          <span className="sim-readout-value">{currentPos.toFixed(1)}m</span>
          <span className="sim-readout-label">Position</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{currentVel.toFixed(1)} m/s</span>
          <span className="sim-readout-label">Velocity</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{accel} m/s²</span>
          <span className="sim-readout-label">Acceleration</span>
        </div>
      </div>
    </div>
  );
}
