import MotionIntroSim from '../simulations/MotionIntroSim';
import VelocityBasicsSim from '../simulations/VelocityBasicsSim';
import AccelerationSim from '../simulations/AccelerationSim';
import KinematicEqSim from '../simulations/KinematicEqSim';
import PositionTimeGraphSim from '../simulations/PositionTimeGraphSim';
import VelocityTimeGraphSim from '../simulations/VelocityTimeGraphSim';
import FreeFallSim from '../simulations/FreeFallSim';
import ProjectileMotionSim from '../simulations/ProjectileMotionSim';
import ReviewChallengeSim from '../simulations/ReviewChallengeSim';

const simMap = {
  'motion-intro': MotionIntroSim,
  'velocity-basics': VelocityBasicsSim,
  'acceleration-sim': AccelerationSim,
  'kinematic-equations': KinematicEqSim,
  'position-time-graph': PositionTimeGraphSim,
  'velocity-time-graph': VelocityTimeGraphSim,
  'free-fall': FreeFallSim,
  'projectile-motion': ProjectileMotionSim,
  'review-challenge': ReviewChallengeSim,
};

export default function SimulationRenderer({ simId }) {
  const SimComponent = simMap[simId];
  if (!SimComponent) {
    return <div style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>Simulation not available</div>;
  }
  return <SimComponent />;
}
