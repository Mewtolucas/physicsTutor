import { useState, useRef, useEffect } from 'react';
import './simStyles.css';

export default function MotionIntroSim() {
  const canvasRef = useRef(null);
  const [startPos, setStartPos] = useState(100);
  const [endPos, setEndPos] = useState(400);

  const displacement = endPos - startPos;
  const distance = Math.abs(displacement);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Draw number line
    const lineY = H / 2;
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, lineY);
    ctx.lineTo(W - 30, lineY);
    ctx.stroke();

    // Tick marks
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let x = 0; x <= 500; x += 50) {
      const px = 30 + (x / 500) * (W - 60);
      ctx.beginPath();
      ctx.moveTo(px, lineY - 5);
      ctx.lineTo(px, lineY + 5);
      ctx.stroke();
      ctx.fillText(`${x}m`, px, lineY + 20);
    }

    // Draw displacement arrow
    const sx = 30 + (startPos / 500) * (W - 60);
    const ex = 30 + (endPos / 500) * (W - 60);

    if (Math.abs(ex - sx) > 5) {
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sx, lineY - 30);
      ctx.lineTo(ex, lineY - 30);
      ctx.stroke();

      // Arrowhead
      const dir = ex > sx ? 1 : -1;
      ctx.fillStyle = '#4F46E5';
      ctx.beginPath();
      ctx.moveTo(ex, lineY - 30);
      ctx.lineTo(ex - dir * 10, lineY - 36);
      ctx.lineTo(ex - dir * 10, lineY - 24);
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = '#4F46E5';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`Δx = ${displacement}m`, (sx + ex) / 2, lineY - 40);
    }

    // Start marker
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(sx, lineY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('Start', sx, lineY + 38);

    // End marker
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(ex, lineY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#991B1B';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('End', ex, lineY + 38);
  }, [startPos, endPos, displacement]);

  return (
    <div className="sim-container">
      <div className="sim-canvas-wrapper">
        <canvas ref={canvasRef} width={600} height={160} />
      </div>

      <div className="sim-controls">
        <div className="sim-control">
          <label>Start Position: {startPos}m</label>
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={startPos}
            onChange={(e) => setStartPos(Number(e.target.value))}
          />
        </div>
        <div className="sim-control">
          <label>End Position: {endPos}m</label>
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={endPos}
            onChange={(e) => setEndPos(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="sim-readout">
        <div className="sim-readout-item">
          <span className="sim-readout-value">{displacement}m</span>
          <span className="sim-readout-label">Displacement (Δx)</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{distance}m</span>
          <span className="sim-readout-label">Distance</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{displacement >= 0 ? '→ Right' : '← Left'}</span>
          <span className="sim-readout-label">Direction</span>
        </div>
      </div>
    </div>
  );
}
