# ☣ FACILITY 404 // Horror Escape Room Puzzle

[![Play Live Demo](https://img.shields.io/badge/%F0%9F%8E%AE%20PLAY_LIVE_DEMO-GitHub_Pages-success?style=for-the-badge&logo=github)](https://angelguptaindia.github.io/Escape_Game/)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-Synthesized-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

🔗 **Play Live Game:** [https://angelguptaindia.github.io/Escape_Game/](https://angelguptaindia.github.io/Escape_Game/)

> *You are trapped inside Sector-7 of a subterranean biological research bunker. Heavy security doors seal every room. To survive and escape, decipher the terminal pincode panel before lethal nerve gas purges the chamber.*

---

## 🎮 Overview

**FACILITY 404** is an atmospheric, horror-themed escape room word cipher game built purely with **Vanilla JavaScript, HTML5, and CSS3**. Players navigate through escalating room sectors, deciphering electronic door codes on a phosphorescent CRT terminal console while managing a strictly limited hazard purge gauge.

---

## ✨ Key Features

- 🧠 **Dynamic Word Cipher Engine**: Words progress through 3 difficulty tiers (4–6 letters for early rooms up to 9–12 complex scientific/facility terms for advanced sectors).
- 🅰️ **Vowel Auto-Reveal Protocol**: Vowels (A, E, I, O, U) are automatically exposed upon entering a room to focus gameplay on strategic consonant decryption.
- ☣ **Lockdown Purge Gauge**: 6 biohazard indicator lamps monitor failure threshold. Exceeding 6 errors triggers lethal room quarantine and poison gas canvas FX.
- 💡 **Immersive Horror Aesthetic**:
  - CRT phosphorescent scanlines & monitor glow
  - Realistic hydraulic door split opening animations
  - Dynamic ceiling light flickering toggle
  - Red emergency alarm strobe overlays
  - Particle-based poison gas canvas simulation on game over
- 🔊 **Pure Web Audio API Sound System**:
  - 100% procedurally synthesized sound effects (keypad clicks, pneumatic door hiss, error alarms, override sparks).
  - Ambient dark sci-fi background hum and drone generator—**zero external MP3/WAV files required!**
- 🏆 **Score & High Score Tracking**: Real-time score calculation with local storage persistence (`localStorage`), override penalty deductions, and room completion bonuses.

---

## 🕹️ How to Play

1. **Enter Sector**: Click **ENTER FACILITY & START** on the terminal briefing screen.
2. **Examine Cipher**: Observe revealed vowels and letter slot counts.
3. **Decipher Consonants**: Click the on-screen keypad or press keys `A`–`Z` on your physical keyboard.
   - **Correct Consonant**: Unlocks all occurrences (+10 PTS per letter slot).
   - **Incorrect Consonant**: Extinguishes one Biohazard Lamp and advances the lockdown counter.
4. **Use Facility Logs & Overrides**:
   - 📁 **Inspect Log Clue**: Read security logs for contextual category hints.
   - ⚡ **Override / Hint**: Forces revelation of 1 random consonant (-10 PTS penalty).
5. **Escape the Sector**: Deciphering the full code disengages pneumatic door locks (+25 PTS bonus) and opens access to the next room!

---

## 📁 Project Structure

```
Escape_Game/
├── index.html        # Main HTML5 viewport, CRT frame, and modal screens
├── styles.css        # CSS design system (CRT effects, scanlines, animations, layout)
├── game.js          # Main game loop, canvas fog, keyboard controls, state management
├── words.js         # Categorized 3-tier word database & hint provider
└── audio.js         # Web Audio API sound synthesizer (SFX & ambient soundtrack)
```

---

## 🚀 Quick Start (Local Setup)

No dependencies or build tools required! Simply run directly in your browser:

### Option 1: Direct File Opening
1. Clone the repository:
   ```bash
   git clone https://github.com/angelguptaindia/Escape_Game.git
   ```
2. Open `index.html` in any web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Local Server (VS Code / CLI)
Using `npx serve` or VS Code Live Server extension:
```bash
npx serve .
```

---

## 🛠️ Technology Stack

- **HTML5**: Semantic layout, SVG icons, overlay screens, canvas particle system.
- **CSS3**: Custom CSS variables, CRT scanlines, CRT flicker keyframes, flex/grid layouts.
- **Vanilla JavaScript (ES6+)**: Event-driven game loop, DOM rendering, modular architecture.
- **Web Audio API**: Real-time audio synthesis (Oscillators, GainNodes, BiquadFilters).

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

*Facility 404 containment protocol active. Good luck surviving Sector-7.* ☣
