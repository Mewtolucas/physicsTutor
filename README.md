# AP Physics 1 — Interactive Learning Platform

A web-based physics education app inspired by Duolingo and Brilliant.org, focused on AP Physics 1 curriculum for high school students.

🌐 **Live Demo**: https://mewtolucas.github.io/physicsTutor/

## Features

### Unit 1: Kinematics (Complete MVP)
- **9 bite-sized lessons** covering motion, velocity, acceleration, kinematic equations, graphs, free fall, and projectile motion
- **9 interactive simulations** with real-time animations and adjustable parameters
- **27 practice problems** across multiple types (multiple choice, fill-in-the-blank, slider prediction)
- Immediate feedback on answers with detailed explanations

### Learning Experience
- **Clear explanations** with real-world context and formula cards
- **Visual demonstrations** with Canvas-based simulations
- **Common misconceptions** highlighted
- **Lesson summaries** to reinforce key concepts

### Gamification & Progress
- **XP system** for completing lessons and getting problems right
- **Daily streak counter** to encourage consistent learning
- **Progress bars** showing unit completion
- **Star ratings** (1-3 stars) based on performance
- **localStorage persistence** — progress saves automatically

### Architecture
- **React + Vite** for fast development and production builds
- **React Router** for navigation
- **Responsive design** works on desktop and tablet
- **Foundation ready** to expand to other units (Units 2-7 framework in place)

## Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployed on GitHub Pages
The app automatically deploys to GitHub Pages on each push to the `claude/physics-learning-platform-XB0Gc` branch via GitHub Actions.

## Project Structure
```
src/
├── components/          # React components
│   ├── Dashboard.jsx   # Unit selection screen
│   ├── UnitView.jsx    # Lesson list for a unit
│   ├── LessonViewer.jsx # Main lesson experience
│   ├── Problem.jsx     # Practice problem component
│   └── SimulationRenderer.jsx
├── data/               # Content & configuration
│   ├── units.js        # All 7 AP Physics 1 units
│   └── kinematicsLessons.js # Detailed Unit 1 content
├── simulations/        # Interactive Canvas simulations
│   ├── MotionIntroSim.jsx
│   ├── VelocityBasicsSim.jsx
│   ├── AccelerationSim.jsx
│   ├── KinematicEqSim.jsx
│   ├── PositionTimeGraphSim.jsx
│   ├── VelocityTimeGraphSim.jsx
│   ├── FreeFallSim.jsx
│   ├── ProjectileMotionSim.jsx
│   └── ReviewChallengeSim.jsx
├── hooks/              # Custom React hooks
│   └── useProgress.js  # Progress tracking with localStorage
└── styles/             # Global and component styles
```

## Kinematics Lessons

1. **What is Motion?** — Reference frames, position, displacement
   - Simulation: Draggable position markers on number line

2. **Velocity Basics** — Average vs instantaneous velocity
   - Simulation: Animated car with position-time mini-graph

3. **Acceleration** — Definition and examples
   - Simulation: Object with velocity/acceleration vectors

4. **Kinematic Equations** — All 4 equations with live calculations
   - Simulation: Interactive equation calculator

5. **Position-Time Graphs** — Reading and interpreting
   - Simulation: Dynamic x-t graph with tangent line

6. **Velocity-Time Graphs** — Area under curve = displacement
   - Simulation: v-t graph with shaded displacement area

7. **Free Fall** — Special case of kinematics
   - Simulation: Falling ball with gravity indicator

8. **Projectile Motion** — 2D kinematics
   - Simulation: Full trajectory with velocity components

9. **Unit Review** — Challenge problems
   - Simulation: Multi-scenario physics explorer

## Future Units
The app is designed to scale to all AP Physics 1 units:
- Unit 2: Dynamics (Forces and Newton's Laws)
- Unit 3: Circular Motion and Gravitation
- Unit 4: Energy
- Unit 5: Momentum
- Unit 6: Waves and SHM
- Unit 7: Torque and Rotational Motion

## Technology Stack
- **React 19** — UI library
- **Vite 7** — Build tool
- **React Router 7** — Navigation
- **Canvas API** — Interactive simulations
- **CSS3** — Modern styling with CSS variables
- **localStorage** — Progress persistence

## Browser Support
Works on all modern browsers (Chrome, Firefox, Safari, Edge) supporting ES6 and Canvas API.

## License
Educational use — AP Physics 1 learning platform

---

Made with ❤️ for physics students
