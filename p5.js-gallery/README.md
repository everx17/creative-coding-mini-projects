# p5.js Gallery (Creative Coding)

A curated collection of p5.js sketches: small games, audio visualisations, and
graphics programming studies.

## Quick start (recommended)
Some browser features (audio input/playback, webcam access, loading local assets)
can be blocked when opening files directly. Running a local server is the most
reliable way.

From the `p5.js-gallery` folder:

Python:
- python -m http.server 8000

Then open:
- http://localhost:8000

If you don’t have Python, you can use any local server (VS Code Live Server,
Node http-server, etc.).

## Contents

### Featured projects

#### 1) Platformer
Folder: `platformer/`

A small platformer built as a complete mini project (core movement, collisions,
level/game loop).

Run:
- Start the local server (see Quick start)
- Open: http://localhost:8000

#### 2) Audio Visualiser
Folder: `musicVis/`

Audio visualiser built with p5.sound FFT (spectrum/waveform/energy-driven
visuals) with a simple visualisation menu.

Run:
- Start the local server (see Quick start)
- Open: http://localhost:8000

Notes:
- Some browsers require a user gesture (click) before audio playback begins.

### Graphics programming mini sketches
Folder: `graphics-programming-mini-sketches/`

Smaller studies focusing on interaction, math/geometry, and image effects.

#### Webcam Piano
Folder: `graphics-programming-mini-sketches/webcamPiano/`

Real-time webcam sketch that applies a visual effect/filter when the webcam is
enabled.

Run:
- Start the local server (recommended)
- Open: http://localhost:8000
- Allow webcam permissions when prompted.

#### 3D Sine
Folder: `graphics-programming-mini-sketches/3DSineGames/`

3D sine-form study with adjustable parameters (e.g. thickness/angle).

Run:
- Open: http://localhost:8000

#### Noisy Grid (Flow Field)
Folder: `graphics-programming-mini-sketches/noisyGrid/`

Generative flow-field style sketch with a “magnetic filings” feel; responds to
mouse movement.

Run:
- Open: http://localhost:8000

#### Asteroids (basic)
Folder: `graphics-programming-mini-sketches/asteroidGameClone/`

Small Asteroids-style prototype (basic movement/shooting/game loop).

Run:
- Open: http://localhost:8000
