import { useState } from 'react';
import './simStyles.css';

export default function KinematicEqSim() {
  const [v0, setV0] = useState(0);
  const [a, setA] = useState(4);
  const [t, setT] = useState(5);

  const v = v0 + a * t;
  const x = v0 * t + 0.5 * a * t * t;
  const v2 = v0 * v0 + 2 * a * x;

  return (
    <div className="sim-container">
      <div style={{
        background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: 'white', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', marginBottom: 4 }}>EQUATION 1</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600 }}>
              v = v₀ + at
            </div>
            <div style={{ fontSize: 13, color: '#4F46E5', fontWeight: 700, marginTop: 4 }}>
              v = {v0} + ({a})({t}) = <strong>{v.toFixed(1)} m/s</strong>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', marginBottom: 4 }}>EQUATION 2</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600 }}>
              x = v₀t + ½at²
            </div>
            <div style={{ fontSize: 13, color: '#4F46E5', fontWeight: 700, marginTop: 4 }}>
              x = {v0}({t}) + ½({a})({t})² = <strong>{x.toFixed(1)} m</strong>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', marginBottom: 4 }}>EQUATION 3</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600 }}>
              v² = v₀² + 2ax
            </div>
            <div style={{ fontSize: 13, color: '#4F46E5', fontWeight: 700, marginTop: 4 }}>
              v² = {v0}² + 2({a})({x.toFixed(1)}) = <strong>{v2.toFixed(1)}</strong>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', marginBottom: 4 }}>EQUATION 4</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600 }}>
              x = ½(v₀ + v)t
            </div>
            <div style={{ fontSize: 13, color: '#4F46E5', fontWeight: 700, marginTop: 4 }}>
              x = ½({v0} + {v.toFixed(1)})({t}) = <strong>{(0.5 * (v0 + v) * t).toFixed(1)} m</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="sim-controls">
        <div className="sim-control">
          <label>Initial Velocity (v₀): {v0} m/s</label>
          <input type="range" min={-10} max={20} step={1} value={v0}
            onChange={(e) => setV0(Number(e.target.value))} />
        </div>
        <div className="sim-control">
          <label>Acceleration (a): {a} m/s²</label>
          <input type="range" min={-10} max={10} step={0.5} value={a}
            onChange={(e) => setA(Number(e.target.value))} />
        </div>
        <div className="sim-control">
          <label>Time (t): {t} s</label>
          <input type="range" min={0} max={10} step={0.5} value={t}
            onChange={(e) => setT(Number(e.target.value))} />
        </div>
      </div>

      <div className="sim-readout">
        <div className="sim-readout-item">
          <span className="sim-readout-value">{x.toFixed(1)}m</span>
          <span className="sim-readout-label">Displacement</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{v.toFixed(1)} m/s</span>
          <span className="sim-readout-label">Final Velocity</span>
        </div>
        <div className="sim-readout-item">
          <span className="sim-readout-value">{a} m/s²</span>
          <span className="sim-readout-label">Acceleration</span>
        </div>
      </div>
    </div>
  );
}
