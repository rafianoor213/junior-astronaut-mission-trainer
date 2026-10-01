# 🚀 Junior Astronaut Mission Trainer

**NASA Space Apps Challenge Entry**  
An interactive, playable space mission simulator designed to educate and test aspiring Junior Astronauts across three critical phases of spaceflight. Built with pure HTML, CSS, and TypeScript/JavaScript (Next.js & React) with zero external database, zero login requirements, and instant deployment on Vercel.

---

## 🎮 Game Features & Structure

The game features **exactly 3 levels**, progressing from Low Earth Orbit to the Lunar South Pole, and concluding with a hypersonic atmospheric re-entry return to Earth:

### 🛰️ Level 1: Astronaut Training
* **Repair Damaged Satellite:** Restore tracking gimble alignment on solar arrays, re-solder severed high-voltage power cables, and tune the RF carrier dish to 142 MHz to lock ground telemetry.
* **Inspect Orbital Space Station:** Board the International Space Station habitat and certify the Environmental Control and Life Support System (ECLSS): balance water electrolysis oxygen rates, start circulation blowers to scrub carbon dioxide, regulate external ammonia coolant loops between orbital day (+120°C) and night (-150°C), and certify Quest airlock pressure seals.
* **Discover Lunar Resources:** Calibrate orbital spectrometers to scan designated landing zones for 4 vital resources:
  1. *Water Ice* (Permanently shadowed craters at the South Pole)
  2. *Minerals* (Ilmenite & titanium basalt plateaus)
  3. *Regolith-Bound Oxygen* (Highland soil oxides)
  4. *Solar Energy Peaks* (Peaks of Eternal Light with 90%+ continuous illumination)
* *Unlocks Level 2 upon completion.*

---

### 🌕 Level 2: Moon Survival
* **2D Playable Lunar Surface:** Explore the South Pole terrain with responsive keyboard movement (`W`, `A`, `S`, `D` or `Arrow Keys`), click-to-move canvas controls, and virtual on-screen D-Pad buttons for mobile/touch screens.
* **Lunar Rover Mobility:** Mount and dismount the Artemis Lunar Terrain Vehicle (LTV) to travel at 2x speed across cratered ground.
* **5 Critical Survival Resources:**
  * **Oxygen (O2):** Depletes while walking/mining outside; replenish via base electrolysis or by returning to the habitat airlock.
  * **Energy:** Powers suit life support and mining tools; recharge on the Solar Panel Array pad or at the base power terminal.
  * **Water:** Mine raw ice crystals and melt them into clean drinking water at the base processor.
  * **Food:** Irrigate crops in the Hydroponic Greenhouse dome to harvest survival food rations.
  * **Health:** Drains if oxygen or energy reaches zero, or during hazardous emergencies; heals inside the Lunar Base airlock.
* **Tactical Decision: Safe vs. Risky Crater Exploration:**
  * *Option A — Safe Ridge Survey:* Guaranteed modest ice and mineral yield with low oxygen usage and zero hazard risk.
  * *Option B — Deep Crater Descent (Risky):* High chance of a massive resource jackpot (+65 Ice, +60 Minerals) balanced against dangerous regolith slides and emergency suit punctures!
* **6 Dynamic Emergencies:**
  1. *Oxygen Leak* (Micro-puncture in suit valve)
  2. *Solar Radiation Storm* (Coronal Mass Ejection wave from the Sun)
  3. *Main Power Failure* (Solar inverter breaker trip)
  4. *Rover Drivetrain Jam* (Abrasive lunar dust in electric wheel motor)
  5. *Greenhouse Failure* (Frozen irrigation loop)
  6. *Communication Blackout* (Telemetry dish misalignment)
* **Return Rocket Preparation:** Provision the Orion return rocket with 8 essential requirements (Fuel, Power, O2, Food, Water, Comms, Navigation Guidance, and Hull Heat Shield Tiles) to execute the launch countdown!
* *Unlocks Level 3 upon successful rocket launch.*

---

### 🌍 Level 3: Return to Earth
* **Interactive Re-Entry Cockpit Simulator:**
  1. **Check Spacecraft:** Test 16 reaction control thrusters (RCS), run triple-redundant flight avionics diagnostics, and verify cabin pressure seals.
  2. **Check Resources:** Audit de-orbit hypergolic propellant, cabin oxygen bottles, and main electrical bus voltage.
  3. **Prepare Heat Shield & Corridor:** Pyrotechnically jettison the cylindrical service module, orient the blunt ablative heat shield forward, and calibrate the critical entry corridor angle between **5.5° and 7.0°** (too shallow skips off the atmosphere; too steep causes thermal burn-up).
  4. **Hypersonic Atmospheric Re-Entry:** Endure Mach 25 velocities, extreme 2,700°C plasma sheath heating, and communications blackout while maintaining capsule roll stabilization.
  5. **Parachute Sequence:** Fire mortars to deploy dual drogue stabilization chutes at ~8,000m, then reef out the triple main canopies at 2,500m for soft deceleration.
  6. **Safe Splashdown & Ocean Recovery:** Touch down safely in the Pacific Ocean at 25 km/h for recovery by naval teams.
* **Failure & Retry Mechanics:** Unchecked systems, improper angles, or premature parachute deployment display authentic aerospace incident debriefs with immediate 1-click retry.
* **Victory Screen:** Displays **“MISSION SUCCESS — JUNIOR ASTRONAUT CERTIFIED!”** with printable Junior Astronaut Diploma, callsign, badges, score, and mission debrief.

---

## 🛰️ NASA Data & API Integration

* **NASA Open Search API (`images-api.nasa.gov`):** Automatically retrieves authentic imagery from NASA missions (Hubble Space Telescope, ISS Cupola, Apollo & Artemis Moon exploration, and Orion capsule recovery).
* **Zero API Key Requirement:** Operates entirely on public NASA endpoints with no secret keys or configuration needed from players.
* **100% Offline / Fallback Resilient:** Includes pre-packaged verified NASA imagery and high-detail SVG space illustrations so gameplay never stutters, stalls, or fails even without internet connectivity.
* **NASA Mission Facts:** Curated educational insights into NASA's Artemis program, the Deep Space Network (DSN), and International Space Station life support technology.

---

## 🔊 Sound & Audio

* Built-in Web Audio API sound synthesizer with zero external audio file dependencies.
* Procedurally generates telemetry beeps, repair clicks, alarm klaxons, fanfare chimes, and rocket engine rumbles.
* Includes a global mute/unmute button in the header bar.

---

## 🚀 Easy Deployment on Vercel

This project is optimized for deployment on [Vercel](https://vercel.com):

### Option A: Via GitHub (Recommended)
1. Push this folder to your GitHub repository.
2. Go to **vercel.com** and click **"Add New Project"**.
3. Select your repository. Vercel will automatically detect **Next.js** and apply the default build settings:
   * **Framework Preset:** Next.js
   * **Build Command:** `npm run build`
   * **Output Directory:** `.next`
4. Click **Deploy**. Your game will be live with a global HTTPS URL in under a minute!

### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser to play.
