export const kinematicsLessons = {
  1: {
    title: 'What is Motion?',
    subtitle: 'Reference frames, position, displacement',
    sections: [
      {
        type: 'explanation',
        title: 'Everything is Relative',
        content: `Imagine you're sitting on a train. To someone standing on the platform, you're moving at 60 mph. But to the person sitting next to you, you're perfectly still. Who's right? Both are!

**Motion** is the change in an object's position over time — but position depends on your **reference frame**: the point of view from which you observe.`,
      },
      {
        type: 'concept',
        title: 'Position and Displacement',
        content: `**Position (x)** tells you where an object is relative to a chosen origin (reference point). We measure it in meters (m).

**Displacement (Δx)** is the *change* in position — how far and in what direction you've moved from start to finish.`,
        formula: 'Δx = x_final − x_initial',
        formulaLabel: 'Displacement',
        misconception: 'Displacement is NOT the same as distance! If you walk 3 m east and then 3 m west, your distance is 6 m but your displacement is 0 m.',
      },
      {
        type: 'keyIdea',
        content: 'Displacement is a **vector** — it has both magnitude (size) and direction. Distance is a **scalar** — it only has magnitude.',
      },
      {
        type: 'simulation',
        id: 'motion-intro',
      },
      {
        type: 'summary',
        points: [
          'Motion is relative — it depends on your reference frame',
          'Position (x) is measured from a chosen origin',
          'Displacement (Δx) = final position − initial position',
          'Displacement is a vector; distance is a scalar',
          'Displacement can be negative (opposite direction)',
        ],
      },
    ],
    problems: [
      {
        type: 'multiple-choice',
        question: 'A runner jogs 400 m around a circular track and returns to their starting point. What is their displacement?',
        options: ['400 m', '200 m', '0 m', '800 m'],
        correctIndex: 2,
        explanation: 'Displacement measures the change in position from start to finish. Since the runner returned to the starting point, their final position equals their initial position, so Δx = 0 m. Note: the distance traveled is 400 m, but displacement is 0!',
        xp: 10,
      },
      {
        type: 'fill-in',
        question: 'A cat walks 5 m to the right from the origin, then 8 m to the left. What is the cat\'s displacement in meters? (Use negative for left)',
        answer: '-3',
        tolerance: 0,
        unit: 'm',
        explanation: 'Starting at 0 m, the cat goes to +5 m, then moves 8 m left to −3 m. Displacement = −3 m − 0 m = −3 m.',
        xp: 15,
      },
      {
        type: 'multiple-choice',
        question: 'Which of the following is a vector quantity?',
        options: ['Speed', 'Distance', 'Displacement', 'Time'],
        correctIndex: 2,
        explanation: 'Displacement is a vector because it has both magnitude and direction. Speed, distance, and time are all scalar quantities — they only have magnitude.',
        xp: 10,
      },
    ],
  },

  2: {
    title: 'Velocity Basics',
    subtitle: 'Average vs instantaneous velocity',
    sections: [
      {
        type: 'explanation',
        title: 'How Fast and Which Way?',
        content: `Now that we know about displacement, let's talk about how quickly things move.

**Velocity** tells you how fast an object's position is changing and in what direction. It's the rate of change of displacement.

There's an important difference between **speed** and **velocity**:
- **Speed** = how fast (scalar, always positive)
- **Velocity** = how fast *and* in what direction (vector, can be negative)`,
      },
      {
        type: 'concept',
        title: 'Average Velocity',
        content: `**Average velocity** is the total displacement divided by the total time. It tells you the overall rate of position change during a trip.`,
        formula: 'v_avg = Δx / Δt = (x_final − x_initial) / (t_final − t_initial)',
        formulaLabel: 'Average Velocity',
        misconception: 'Average velocity is NOT always the same as average speed! A round trip has zero average velocity (displacement = 0) but nonzero average speed.',
      },
      {
        type: 'concept',
        title: 'Instantaneous Velocity',
        content: `**Instantaneous velocity** is the velocity at a single moment in time — like what your speedometer reads right now.

Mathematically, it's the limit of average velocity as the time interval approaches zero. On a position-time graph, it equals the **slope** of the tangent line at that point.`,
        formula: 'v = lim(Δt→0) Δx/Δt',
        formulaLabel: 'Instantaneous Velocity',
      },
      {
        type: 'keyIdea',
        content: 'On a **position-time graph**, the slope gives you velocity. A steeper slope = faster motion. A horizontal line = at rest. A negative slope = moving in the negative direction.',
      },
      {
        type: 'simulation',
        id: 'velocity-basics',
      },
      {
        type: 'summary',
        points: [
          'Velocity = displacement / time (vector)',
          'Speed = distance / time (scalar)',
          'Average velocity: v_avg = Δx / Δt',
          'Instantaneous velocity = slope of position-time graph',
          'Velocity can be positive, negative, or zero',
        ],
      },
    ],
    problems: [
      {
        type: 'fill-in',
        question: 'A car travels 150 m east in 10 seconds. What is its average velocity in m/s?',
        answer: '15',
        tolerance: 0,
        unit: 'm/s',
        explanation: 'Average velocity = Δx / Δt = 150 m / 10 s = 15 m/s east.',
        xp: 10,
      },
      {
        type: 'multiple-choice',
        question: 'A student walks 100 m north in 50 s, then 100 m south in 50 s, returning to start. What is their average velocity?',
        options: ['2 m/s', '1 m/s', '0 m/s', '4 m/s'],
        correctIndex: 2,
        explanation: 'Total displacement = 0 m (returned to start). Average velocity = 0 m / 100 s = 0 m/s. Note: average speed would be 200 m / 100 s = 2 m/s.',
        xp: 10,
      },
      {
        type: 'multiple-choice',
        question: 'On a position-time graph, what does a steeper positive slope indicate?',
        options: [
          'The object is slowing down',
          'The object has greater positive velocity',
          'The object is accelerating',
          'The object is at rest',
        ],
        correctIndex: 1,
        explanation: 'The slope of a position-time graph equals velocity. A steeper positive slope means a larger positive velocity — the object is moving faster in the positive direction.',
        xp: 10,
      },
    ],
  },

  3: {
    title: 'Acceleration',
    subtitle: 'Definition and examples',
    sections: [
      {
        type: 'explanation',
        title: 'Changing Velocity',
        content: `You're in a car at a red light. The light turns green, and you press the gas pedal. You feel pushed back into your seat. What's happening?

Your velocity is changing — you're **accelerating**.

**Acceleration** is the rate of change of velocity. Just as velocity tells you how position changes, acceleration tells you how velocity changes.`,
      },
      {
        type: 'concept',
        title: 'Defining Acceleration',
        content: `Acceleration measures how quickly velocity changes over time. Like velocity, it's a **vector** — it has magnitude and direction.`,
        formula: 'a = Δv / Δt = (v_final − v_initial) / (t_final − t_initial)',
        formulaLabel: 'Average Acceleration',
        misconception: 'Negative acceleration does NOT always mean slowing down! A car moving in the negative direction with negative acceleration is actually speeding up. What matters is whether acceleration is in the same or opposite direction as velocity.',
      },
      {
        type: 'concept',
        title: 'Speeding Up vs Slowing Down',
        content: `Here's the key rule:
- **Speeding up**: velocity and acceleration point in the **same direction**
- **Slowing down** (decelerating): velocity and acceleration point in **opposite directions**

For example, if a car moving east (positive) has a westward (negative) acceleration, it's slowing down.`,
      },
      {
        type: 'keyIdea',
        content: 'On a **velocity-time graph**, the slope gives you acceleration. Constant acceleration = straight line. Zero acceleration = horizontal line (constant velocity).',
      },
      {
        type: 'simulation',
        id: 'acceleration-sim',
      },
      {
        type: 'summary',
        points: [
          'Acceleration = change in velocity / change in time',
          'Units: m/s² (meters per second squared)',
          'Acceleration is a vector quantity',
          'Same direction as velocity → speeding up',
          'Opposite direction to velocity → slowing down',
          'Slope of velocity-time graph = acceleration',
        ],
      },
    ],
    problems: [
      {
        type: 'fill-in',
        question: 'A bike speeds up from 2 m/s to 8 m/s in 3 seconds. What is the acceleration in m/s²?',
        answer: '2',
        tolerance: 0,
        unit: 'm/s²',
        explanation: 'a = Δv / Δt = (8 − 2) / 3 = 6/3 = 2 m/s².',
        xp: 10,
      },
      {
        type: 'multiple-choice',
        question: 'A car is moving to the right with a leftward acceleration. The car is:',
        options: [
          'Speeding up to the right',
          'Slowing down (decelerating)',
          'Moving to the left',
          'At rest',
        ],
        correctIndex: 1,
        explanation: 'When velocity and acceleration point in opposite directions, the object is slowing down. The car moves right but accelerates left, so it decelerates.',
        xp: 10,
      },
      {
        type: 'slider-predict',
        question: 'A ball starts at rest and accelerates at 3 m/s². Use the slider to predict its velocity after 4 seconds.',
        sliderMin: 0,
        sliderMax: 20,
        sliderStep: 1,
        unit: 'm/s',
        answer: 12,
        tolerance: 1,
        explanation: 'v = v₀ + at = 0 + 3(4) = 12 m/s',
        xp: 15,
      },
    ],
  },

  4: {
    title: 'Kinematic Equations',
    subtitle: 'Derivation and application',
    sections: [
      {
        type: 'explanation',
        title: 'The Big Four',
        content: `When acceleration is **constant**, we can use four powerful equations to relate position, velocity, acceleration, and time. These are your essential tools for solving kinematics problems.

Each equation connects different combinations of five variables: x (displacement), v₀ (initial velocity), v (final velocity), a (acceleration), and t (time).`,
      },
      {
        type: 'concept',
        title: 'The Four Kinematic Equations',
        content: `**Equation 1:** v = v₀ + at
*(Relates velocity, acceleration, and time — no displacement)*

**Equation 2:** x = v₀t + ½at²
*(Relates displacement, initial velocity, acceleration, and time — no final velocity)*

**Equation 3:** v² = v₀² + 2ax
*(Relates velocities, acceleration, and displacement — no time)*

**Equation 4:** x = ½(v₀ + v)t
*(Relates displacement, both velocities, and time — no acceleration)*`,
        formula: 'v = v₀ + at\nx = v₀t + ½at²\nv² = v₀² + 2ax\nx = ½(v₀ + v)t',
        formulaLabel: 'Kinematic Equations (constant acceleration)',
        misconception: 'These equations ONLY work when acceleration is constant! If acceleration is changing, you need calculus or different approaches.',
      },
      {
        type: 'concept',
        title: 'Problem-Solving Strategy',
        content: `1. **Identify** the known and unknown variables
2. **Choose** the equation that has all your knowns and the one unknown
3. **Substitute** values (watch units and signs!)
4. **Solve** algebraically

Pro tip: List your five variables (x, v₀, v, a, t) and mark which three you know. Then pick the equation that uses those three to find the fourth.`,
      },
      {
        type: 'simulation',
        id: 'kinematic-equations',
      },
      {
        type: 'summary',
        points: [
          'Four kinematic equations for constant acceleration',
          'Each equation omits one variable',
          'Strategy: identify knowns, pick the right equation, solve',
          'Always check units and signs',
          'Only valid when acceleration is constant',
        ],
      },
    ],
    problems: [
      {
        type: 'fill-in',
        question: 'A car accelerates from rest at 4 m/s² for 5 seconds. How far does it travel? (in meters)',
        answer: '50',
        tolerance: 0,
        unit: 'm',
        explanation: 'Using x = v₀t + ½at²: x = 0(5) + ½(4)(5²) = ½(4)(25) = 50 m.',
        xp: 15,
      },
      {
        type: 'multiple-choice',
        question: 'You know initial velocity, acceleration, and displacement. Which kinematic equation should you use to find final velocity?',
        options: [
          'v = v₀ + at',
          'x = v₀t + ½at²',
          'v² = v₀² + 2ax',
          'x = ½(v₀ + v)t',
        ],
        correctIndex: 2,
        explanation: 'v² = v₀² + 2ax contains v, v₀, a, and x — exactly what you need. It doesn\'t require time, which you don\'t know.',
        xp: 10,
      },
      {
        type: 'fill-in',
        question: 'A train moving at 20 m/s brakes with an acceleration of −2 m/s². How long (in seconds) until it stops?',
        answer: '10',
        tolerance: 0,
        unit: 's',
        explanation: 'Using v = v₀ + at: 0 = 20 + (−2)t → 2t = 20 → t = 10 s.',
        xp: 15,
      },
    ],
  },

  5: {
    title: 'Position-Time Graphs',
    subtitle: 'Reading and interpreting',
    sections: [
      {
        type: 'explanation',
        title: 'Pictures of Motion',
        content: `Graphs are one of the most powerful tools in physics. A **position-time (x-t) graph** shows you an object's position at every moment — it's like a complete movie of the motion condensed into one picture.

Learning to read these graphs fluently will make kinematics much easier.`,
      },
      {
        type: 'concept',
        title: 'Reading Position-Time Graphs',
        content: `On a position-time graph:
- **Horizontal axis** = time (t)
- **Vertical axis** = position (x)
- **Each point** tells you where the object is at that time

Key rules:
- **Slope = velocity** (rise/run = Δx/Δt)
- Steeper slope → faster speed
- Positive slope → moving in positive direction
- Negative slope → moving in negative direction
- Horizontal line → at rest (v = 0)
- Straight line → constant velocity
- Curved line → changing velocity (acceleration!)`,
        misconception: 'The shape of a position-time graph does NOT show the path of the object! A curved x-t graph doesn\'t mean the object is moving in a curve — it means the velocity is changing.',
      },
      {
        type: 'concept',
        title: 'Curvature and Acceleration',
        content: `When a position-time graph is curved:
- **Curving upward** (concave up) → positive acceleration
- **Curving downward** (concave down) → negative acceleration
- The curve gets steeper → speeding up
- The curve gets flatter → slowing down`,
      },
      {
        type: 'simulation',
        id: 'position-time-graph',
      },
      {
        type: 'summary',
        points: [
          'Position-time graph slope = velocity',
          'Straight line = constant velocity',
          'Horizontal line = at rest',
          'Curved line = acceleration',
          'Concave up = positive acceleration',
          'Concave down = negative acceleration',
        ],
      },
    ],
    problems: [
      {
        type: 'multiple-choice',
        question: 'On a position-time graph, an object at rest appears as:',
        options: [
          'A straight line sloping upward',
          'A horizontal line',
          'A curved line',
          'A vertical line',
        ],
        correctIndex: 1,
        explanation: 'At rest means the position is not changing, so x stays the same at all times — a horizontal line. A vertical line would mean the object is in multiple positions at the same time, which is impossible!',
        xp: 10,
      },
      {
        type: 'multiple-choice',
        question: 'An object\'s position-time graph is a straight line with a negative slope. This means:',
        options: [
          'The object is slowing down',
          'The object is at rest',
          'The object moves at constant velocity in the negative direction',
          'The object is accelerating in the negative direction',
        ],
        correctIndex: 2,
        explanation: 'A straight line means constant velocity (no acceleration). A negative slope means the velocity is negative — the object moves steadily in the negative direction.',
        xp: 10,
      },
      {
        type: 'multiple-choice',
        question: 'An object\'s position-time graph curves upward, getting steeper over time. The object is:',
        options: [
          'Moving at constant velocity',
          'Speeding up in the positive direction',
          'Slowing down',
          'At rest then suddenly moving',
        ],
        correctIndex: 1,
        explanation: 'A curve that gets steeper means the slope (velocity) is increasing. Since the slope is positive and growing, the object is speeding up in the positive direction — it has positive acceleration.',
        xp: 10,
      },
    ],
  },

  6: {
    title: 'Velocity-Time Graphs',
    subtitle: 'Area under curve = displacement',
    sections: [
      {
        type: 'explanation',
        title: 'Another View of Motion',
        content: `A **velocity-time (v-t) graph** shows how an object's velocity changes over time. It reveals different information than a position-time graph, and the two complement each other.

Master both types of graphs and you'll have a complete picture of any motion.`,
      },
      {
        type: 'concept',
        title: 'Reading Velocity-Time Graphs',
        content: `On a velocity-time graph:
- **Slope = acceleration** (Δv/Δt)
- **Area under the curve = displacement**
- Horizontal line → constant velocity (zero acceleration)
- Line sloping up → positive acceleration
- Line sloping down → negative acceleration
- Line crossing zero → object changes direction`,
        formula: 'slope = a = Δv/Δt\narea = Δx = displacement',
        formulaLabel: 'V-T Graph Relationships',
        misconception: 'The "area under the curve" means the area between the velocity line and the time axis. Area above the axis is positive displacement; area below is negative displacement.',
      },
      {
        type: 'concept',
        title: 'Calculating Displacement from V-T Graphs',
        content: `To find displacement from a v-t graph, calculate the area between the curve and the time axis:
- **Rectangle**: area = base × height = Δt × v
- **Triangle**: area = ½ × base × height = ½ × Δt × Δv
- **Trapezoid**: area = ½(v₁ + v₂) × Δt

Regions below the time axis count as negative area (negative displacement).`,
      },
      {
        type: 'simulation',
        id: 'velocity-time-graph',
      },
      {
        type: 'summary',
        points: [
          'V-T graph slope = acceleration',
          'V-T graph area = displacement',
          'Horizontal line → constant velocity',
          'Line crossing v=0 → direction change',
          'Area below time axis = negative displacement',
          'Constant slope → constant acceleration',
        ],
      },
    ],
    problems: [
      {
        type: 'fill-in',
        question: 'An object moves at a constant velocity of 5 m/s for 8 seconds. Using the v-t graph, what is the displacement? (in meters)',
        answer: '40',
        tolerance: 0,
        unit: 'm',
        explanation: 'The v-t graph is a horizontal line at v = 5 m/s. The area (rectangle) = 5 m/s × 8 s = 40 m.',
        xp: 10,
      },
      {
        type: 'multiple-choice',
        question: 'On a velocity-time graph, what does a horizontal line at v = 0 represent?',
        options: [
          'Constant acceleration',
          'The object is at rest',
          'Constant positive velocity',
          'The object is falling',
        ],
        correctIndex: 1,
        explanation: 'A horizontal line on a v-t graph means constant velocity. At v = 0, the object has zero velocity — it is at rest.',
        xp: 10,
      },
      {
        type: 'fill-in',
        question: 'An object accelerates from 0 to 10 m/s in 4 seconds (constant acceleration). What is the displacement? (in meters)',
        answer: '20',
        tolerance: 0,
        unit: 'm',
        explanation: 'The v-t graph is a triangle. Area = ½ × base × height = ½ × 4 s × 10 m/s = 20 m. Or use x = ½(v₀ + v)t = ½(0 + 10)(4) = 20 m.',
        xp: 15,
      },
    ],
  },

  7: {
    title: 'Free Fall',
    subtitle: 'Special case of kinematics',
    sections: [
      {
        type: 'explanation',
        title: 'Gravity Takes Over',
        content: `Drop a ball and a feather in a vacuum. Surprisingly, they hit the ground at the same time! That's because **free fall** is motion under the influence of gravity alone — no air resistance.

Near Earth's surface, all objects in free fall have the same acceleration regardless of their mass. This is one of the most elegant facts in physics.`,
      },
      {
        type: 'concept',
        title: 'Acceleration Due to Gravity',
        content: `In free fall, the acceleration is constant and directed downward:

**g ≈ 9.8 m/s²** (often rounded to 10 m/s² for easier math)

If we define "up" as positive:
- a = −g = −9.8 m/s² (acceleration is downward)
- A dropped object: v₀ = 0, a = −9.8 m/s²
- A ball thrown up: starts with +v₀, slows down, stops, then falls back`,
        formula: 'a = −g = −9.8 m/s²',
        formulaLabel: 'Free-Fall Acceleration (up = positive)',
        misconception: 'At the peak of its trajectory, a ball thrown upward has v = 0 but a = −9.8 m/s². The acceleration never changes during free fall! The velocity is zero only for an instant.',
      },
      {
        type: 'concept',
        title: 'Free Fall Equations',
        content: `Free fall uses the same kinematic equations with a = −g:

v = v₀ − gt
y = v₀t − ½gt²
v² = v₀² − 2gy

For an object **dropped from rest** (v₀ = 0):
- v = −gt (speed increases linearly)
- y = −½gt² (falls farther each second)
- After 1 s: v = −9.8 m/s, fell 4.9 m
- After 2 s: v = −19.6 m/s, fell 19.6 m`,
      },
      {
        type: 'simulation',
        id: 'free-fall',
      },
      {
        type: 'summary',
        points: [
          'Free fall = motion under gravity alone',
          'g ≈ 9.8 m/s² (constant, downward)',
          'All objects fall at the same rate (no air resistance)',
          'At the top of a throw: v = 0 but a = −g',
          'Use kinematic equations with a = −g',
          'Symmetry: time up = time down for a vertical throw',
        ],
      },
    ],
    problems: [
      {
        type: 'fill-in',
        question: 'A ball is dropped from rest. Using g = 10 m/s², what is its speed after 3 seconds? (in m/s)',
        answer: '30',
        tolerance: 0,
        unit: 'm/s',
        explanation: 'v = v₀ + at = 0 + (10)(3) = 30 m/s. (We use the magnitude since the question asks for speed.)',
        xp: 10,
      },
      {
        type: 'multiple-choice',
        question: 'A ball is thrown straight up. At the very top of its path:',
        options: [
          'Both velocity and acceleration are zero',
          'Velocity is zero, acceleration is 9.8 m/s² downward',
          'Velocity is maximum, acceleration is zero',
          'Both velocity and acceleration point upward',
        ],
        correctIndex: 1,
        explanation: 'At the peak, the ball momentarily stops (v = 0) before falling back down. But gravity never stops — the acceleration is always 9.8 m/s² downward throughout the entire flight.',
        xp: 10,
      },
      {
        type: 'slider-predict',
        question: 'A ball is dropped from a building. Using g = 10 m/s², how far does it fall in 2 seconds? (in meters)',
        sliderMin: 0,
        sliderMax: 40,
        sliderStep: 1,
        unit: 'm',
        answer: 20,
        tolerance: 1,
        explanation: 'y = ½gt² = ½(10)(2²) = ½(10)(4) = 20 m',
        xp: 15,
      },
    ],
  },

  8: {
    title: 'Projectile Motion',
    subtitle: '2D kinematics',
    sections: [
      {
        type: 'explanation',
        title: 'Motion in Two Dimensions',
        content: `What happens when you throw a ball at an angle? It moves both horizontally and vertically at the same time, tracing a beautiful curved path called a **parabola**.

The key insight: **horizontal and vertical motions are independent!** Gravity only affects the vertical motion. The horizontal velocity stays constant (no air resistance).`,
      },
      {
        type: 'concept',
        title: 'Breaking It Down',
        content: `For a projectile launched with speed v₀ at angle θ:

**Horizontal (x):** No acceleration
- v₀ₓ = v₀ cos θ (constant throughout!)
- x = v₀ₓ · t

**Vertical (y):** Free fall (a = −g)
- v₀ᵧ = v₀ sin θ
- vᵧ = v₀ᵧ − gt
- y = v₀ᵧt − ½gt²`,
        formula: 'v₀ₓ = v₀ cos θ     v₀ᵧ = v₀ sin θ\nx = v₀ₓ · t           y = v₀ᵧt − ½gt²',
        formulaLabel: 'Projectile Motion Components',
        misconception: 'The horizontal velocity does NOT change during projectile motion (ignoring air resistance). Only the vertical velocity changes due to gravity.',
      },
      {
        type: 'concept',
        title: 'Range and Maximum Height',
        content: `For a projectile launched from and landing at the same height:

**Time of flight:** T = 2v₀ sin θ / g
**Maximum height:** H = v₀² sin² θ / (2g)
**Range:** R = v₀² sin(2θ) / g

Fun fact: 45° gives maximum range! And complementary angles (like 30° and 60°) give the same range.`,
      },
      {
        type: 'simulation',
        id: 'projectile-motion',
      },
      {
        type: 'summary',
        points: [
          'Projectile motion = constant vₓ + free-fall vᵧ',
          'Horizontal and vertical motions are independent',
          'Break initial velocity into x and y components',
          'Horizontal: no acceleration (constant vₓ)',
          'Vertical: acceleration = −g',
          '45° launch angle gives maximum range',
        ],
      },
    ],
    problems: [
      {
        type: 'fill-in',
        question: 'A ball is launched horizontally at 10 m/s from a 20 m tall cliff. Using g = 10 m/s², how long until it hits the ground? (in seconds)',
        answer: '2',
        tolerance: 0,
        unit: 's',
        explanation: 'The horizontal velocity doesn\'t affect fall time. Using y = ½gt²: 20 = ½(10)t² → t² = 4 → t = 2 s.',
        xp: 15,
      },
      {
        type: 'multiple-choice',
        question: 'Two balls are launched from the same height at the same speed — one at 30° and one at 60°. Which travels farther horizontally?',
        options: [
          'The ball at 30°',
          'The ball at 60°',
          'They travel the same distance',
          'Cannot determine without more info',
        ],
        correctIndex: 2,
        explanation: 'Complementary angles (30° + 60° = 90°) give the same range when launched from the same height at the same speed. This is because sin(2×30°) = sin(60°) = sin(2×60°) = sin(120°).',
        xp: 10,
      },
      {
        type: 'multiple-choice',
        question: 'During projectile motion (no air resistance), the horizontal component of velocity:',
        options: [
          'Increases over time',
          'Decreases over time',
          'Remains constant',
          'Is always zero',
        ],
        correctIndex: 2,
        explanation: 'There is no horizontal acceleration in projectile motion (gravity acts only vertically), so the horizontal velocity component remains constant throughout the flight.',
        xp: 10,
      },
    ],
  },

  9: {
    title: 'Unit Review',
    subtitle: 'Challenge problems',
    sections: [
      {
        type: 'explanation',
        title: 'Kinematics Review',
        content: `Congratulations on making it through Unit 1! Let's review the key concepts and put them all together with some challenge problems.

This unit covered:
- Position, displacement, and reference frames
- Velocity (average and instantaneous)
- Acceleration
- The four kinematic equations
- Position-time and velocity-time graphs
- Free fall and projectile motion`,
      },
      {
        type: 'concept',
        title: 'Master Formula Sheet',
        content: `**Definitions:**
- Displacement: Δx = x_f − x_i
- Velocity: v = Δx/Δt
- Acceleration: a = Δv/Δt

**Kinematic Equations (constant a):**
1. v = v₀ + at
2. x = v₀t + ½at²
3. v² = v₀² + 2ax
4. x = ½(v₀ + v)t

**Free Fall:** a = −g = −9.8 m/s²

**Projectile Motion:**
- vₓ = v₀ cos θ (constant)
- vᵧ = v₀ sin θ − gt`,
        formula: 'v = v₀ + at\nx = v₀t + ½at²\nv² = v₀² + 2ax',
        formulaLabel: 'Kinematic Equations Summary',
      },
      {
        type: 'concept',
        title: 'Graph Relationships',
        content: `**Position-time graph:**
- Slope → velocity
- Curvature → acceleration

**Velocity-time graph:**
- Slope → acceleration
- Area under curve → displacement

Remember: these graphs show relationships, not physical paths!`,
      },
      {
        type: 'simulation',
        id: 'review-challenge',
      },
      {
        type: 'summary',
        points: [
          'Kinematics describes HOW objects move (not WHY)',
          'Displacement, velocity, and acceleration are all vectors',
          'Four kinematic equations require constant acceleration',
          'Graphs encode all motion information visually',
          'Free fall: a = −g for all objects',
          'Projectile motion: independent x and y components',
        ],
      },
    ],
    problems: [
      {
        type: 'fill-in',
        question: 'A car accelerates from 10 m/s to 30 m/s over a distance of 200 m. What is the acceleration in m/s²?',
        answer: '2',
        tolerance: 0,
        unit: 'm/s²',
        explanation: 'Using v² = v₀² + 2ax: 30² = 10² + 2a(200) → 900 = 100 + 400a → 800 = 400a → a = 2 m/s².',
        xp: 20,
      },
      {
        type: 'multiple-choice',
        question: 'A ball is thrown straight up at 20 m/s. Using g = 10 m/s², what is the maximum height?',
        options: ['10 m', '20 m', '40 m', '200 m'],
        correctIndex: 1,
        explanation: 'At max height, v = 0. Using v² = v₀² − 2gy: 0 = 20² − 2(10)y → 0 = 400 − 20y → y = 20 m.',
        xp: 15,
      },
      {
        type: 'fill-in',
        question: 'A projectile is launched at 45° with v₀ = 20 m/s. Using g = 10 m/s², what is the range? (in meters)',
        answer: '40',
        tolerance: 0,
        unit: 'm',
        explanation: 'R = v₀²sin(2θ)/g = (20²)(sin 90°)/10 = 400(1)/10 = 40 m.',
        xp: 20,
      },
    ],
  },
};
