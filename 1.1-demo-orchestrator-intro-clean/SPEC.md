# Three.js Fish Bowl Simulation

## Project Overview

A performant 3D scene featuring a small glass fish bowl containing a school of low-poly fish, subtle underwater lighting, and an efficient bubble particle system.

## Technology Stack

- **Framework**: Three.js (loaded from CDN — v125 or latest)
- **Target Environment**: Single HTML file (index.html), no build step required
- **Runtime**: Modern browser (Chrome, Firefox, Safari, Edge)
- **No dependencies** — Three.js via CDN, all JS inline

## Core Requirements

### Visual Elements
- Glass fish bowl with simple refraction/reflectivity effects (approximated for performance)
- Water surface with subtle distortion and rim highlights
- Low-poly fish models (stylized geometric shapes representing small fish)
- Bubble particle system emitted by fish movement and substrate disturbances
- Substrate (sand/gravel), a couple of plants or rocks for visual interest
- Animated caustic lighting projected onto the substrate (simple shader or projected texture)
- Soft backlight / aquarium-gradient (warm-to-cool) for mood
- Configurable fish count via HTML slider (range: 1–50)

### Interactivity
- Slider UI to control how many fish spawn/despawn
- Real-time numeric display of current fish count
- Smooth transitions when adding/removing fish (fade/scale/position interpolation)
- Optional click-to-feed: a temporary food particle spawns and nearby fish steer toward it

### Performance Targets
- Maintain 30 FPS with up to 30 fish on a modern desktop browser
- Use instancing or vertex pooling for fish geometry when needed
- Efficient bubble particle system using pooling and a particle budget
- Minimize expensive per-pixel operations; prefer simple vertex displacement and lightweight fragment shaders

### Behavior
- Fish exhibit schooling behavior (cohesion, alignment, separation) adapted to the confined bowl geometry
- Wall avoidance and gentle vertical bobbing to simulate buoyancy
- Occasional random turns, short speed bursts, and small group splits/merges
- Bubbles emit from fish positions while swimming or from substrate when fish disturb it
- Lighting can optionally cycle (slow warm/cool shift) to showcase the caustics and silhouettes

## Implementation Notes

- Fish movement: implement a lightweight boids-like controller constrained by the bowl volume. Keep calculations on the CPU but limit neighbor checks (spatial hashing or radius-limited search) for performance.
- Rendering: use instanced meshes for fish (one draw call) where possible; support per-instance transforms and simple color/scale variation.
- Particles: implement a fixed-size particle pool for bubbles; update positions on the CPU and render as simple quads or small instanced spheres.
- Caustics: approximate with a projected animated texture or low-cost screen-space shader; avoid heavy filtering.
- Glass/water: use screen-space fresnel or environment reflection approximation rather than full refraction for performance.
- UI: basic HTML overlay (slider + count) styled with embedded CSS.

## Deliverable

- Single `index.html` file in the demo folder
- All CSS and JavaScript embedded (no external assets except Three.js CDN)
- Responsive canvas (fills viewport) with the fish bowl centered and scaled to preserve aspect and layout
- Works when served with `npx serve` or any local HTTP server

## Optional Enhancements

- Toggle controls for `caustics`, `bubbles`, and `fish trails`
- Per-fish color palettes or species presets
- Minimal post-processing bloom for highlights (toggleable)
- Export a short 3 second GIF capture of the scene (developer convenience)

## Notes on Testing and Performance

- Test on an integrated GPU (laptop) and a discrete GPU to verify 30 FPS target
- Use the browser devtools FPS meter and `requestAnimationFrame` timing to identify hotspots
- Reduce particle budget and neighbor-check radius to improve performance when needed

