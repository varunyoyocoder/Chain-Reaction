# chain-reaction https://chain-reaction-xi.vercel.app/
# gameplay
https://youtu.be/qh7_HR20Pio
# 🎮 Chain Reaction

A browser-based implementation of the classic **Chain Reaction** strategy game built using **HTML, CSS, and Vanilla JavaScript**. Players take turns placing orbs on a grid, causing explosive chain reactions that capture neighboring cells and convert them to their own color. The game combines simple rules with deep strategic gameplay, enhanced by timers, score tracking, responsive design, sound effects, and a modern UI.

## 🚀 Live Features
### 🎯 Core Gameplay
- Turn-based strategy game.
- The blue player always starts first.
- Players can only place orbs in:
  - Empty cells (only first move).
  - Cells already owned by them.
- Capturing opponent cells through chain reactions.
- Automatic turn switching.

### 💥 Chain Reaction System
- Corner cells hold **1 orb**.
- Edge cells hold **2 orbs**.
- Inner cells hold **3 orbs**.
- Exceeding a cell's capacity causes it to explode.
- Explosions distribute orbs to neighboring cells.
- Neighboring cells are captured and converted to the exploding player's color.
- Recursive chain reactions continue until the board stabilizes.

### ⏱ Timer System
- Total game timer: **5 minutes**
- Turn timer: **15 seconds**
- If a player fails to move within 15 seconds:
  - Their turn automatically ends.
- When the game timer reaches zero:
  - The player with the highest score wins.

### 📊 Score Tracking
- Real-time score updates.
- Points awarded for:
  - Capturing empty cells.
  - Capturing opponent cells.
  - Maintaining ownership during chain reactions.

### 🏆 Win Conditions
The game ends when:
1. One player completely eliminates the other player's cells.
2. The game timer reaches zero.

The winner is displayed in a result dialog showing final scores.

### ⏸ Game Controls
- Pause game
- Resume game
- Restart game

### 🔊 Audio Effects
- Explosion sound plays whenever a chain reaction occurs.

### 📱 Responsive Design
- Optimized for desktop.
- Mobile-friendly layout.
- Responsive board scaling.
- Adaptive navigation and score display.


---

## 📂 Project Structure

```text
chain-reaction/
│
├── index.html
├── game.html
│
├── css/
│   ├── home.css
│   └── game.css
│
├── js/
│   ├── home.js
│   └── script.js
│
└── sounds/
    └── explode.mp3
```

---

## 🎮 How To Play

### Step 1
Blue player starts first.

### Step 2
Click on an empty cell to place your first orb.

### Step 3
Players continue taking turns.

### Step 4
Keep increasing orb counts inside your cells.

### Step 5
When a cell exceeds its capacity:

### Step 6
Exploded cells distribute orbs to adjacent cells.

### Step 7
Capture opponent cells and trigger larger chain reactions.

### Step 8
Eliminate all enemy cells or finish with the highest score.

---

## 📱 Responsive Support

The game includes media queries for:

### Tablets
- Repositioned turn indicator
- Flexible navigation layout

### Mobile Devices
- Scaled board
- Compact UI
- Responsive buttons
- Better touch interaction

---

## 🔮 Future Improvements

### Planned Features

- 🤖 AI Opponent
- 🌐 Online Multiplayer
- 👥 3+ Player Support
- 🏅 High Score System
- 💾 Save Game State
- 🎵 Additional Sound Effects
- 🎨 Theme Switching
- 🏆 Match History
- 📈 Statistics Dashboard


