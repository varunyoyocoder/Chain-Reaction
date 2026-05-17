const ROWS = 12;
const COLS = 6;

let turn = 0;

let blueScore = 0;
let redScore = 0;
let redCell = 0;
let blueCell = 0;

let gameSeconds = 180;
let playerSeconds = 15;
let gameEnded = false;

/* DOM */

const boardElement = document.getElementById("board");

const explodeSound = document.getElementById("explodeSound");

const turnText = document.getElementById("turnText");

/* BOARD DATA */

const board = Array.from(
  { length: ROWS },

  () =>
    Array.from(
      { length: COLS },

      () => ({
        color: -1,
        count: 0,
      }),
    ),
);

/* CREATE BOARD */

function createBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");

      cell.classList.add("cell");

      cell.dataset.row = row;
      cell.dataset.color = -1;
      cell.dataset.count = 0;

      cell.dataset.col = col;

      cell.addEventListener("click", handleMove);

      boardElement.appendChild(cell);
    }
  }
  updateBoard();
}

function startGame() {
  turn = 0;

  blueScore = 0;
  redScore = 0;
  redCell = 0;
  blueCell = 0;

  gameSeconds = 180;
  playerSeconds = 15;
  gameEnded = false;
  turnText.innerText = "BLUE's Turn";
  turnText.style.color = "blue";

  boardElement.innerHTML = "";
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      board[row][col] = {
        color: -1,
        count: 0,
      };
    }
  }
  createBoard();
}

function gameOver() {
  gameEnded = true;
  if (redScore < blueScore) {
    turnText.innerText = "BLUE WINS";
    turnText.style.color = "blue";
  } else {
    turnText.innerText = "RED WINS";
    turnText.style.color = "red";
  }
  setTimeout(() => {
    startGame();
  }, 10000);
}

startGame();

/* TIMERS */

setInterval(() => {
  if (gameEnded) {
    return;
  }
  gameSeconds--;

  playerSeconds--;

  const gm = Math.floor(gameSeconds / 60);

  const gs = String(gameSeconds % 60).padStart(2, "0");

  const ps = String(playerSeconds).padStart(2, "0");

  document.getElementById("gameTimer").innerText = `GAME TIMER ${gm}:${gs}`;

  document.getElementById("playerTimer").innerText = `PLAYER TIMER 0:${ps}`;

  if (playerSeconds <= 0) {
    switchTurn();
  }
  if (gameSeconds <= 0) {
    gameOver();
  }
}, 1000);

/* CELL TYPES */

function cornerCell(row, col) {
  return (
    (row === 0 && col === 0) ||
    (row === 0 && col === COLS - 1) ||
    (row === ROWS - 1 && col === 0) ||
    (row === ROWS - 1 && col === COLS - 1)
  );
}

function edgeCell(row, col) {
  return (
    ((row === 0 || row === ROWS - 1) && col > 0 && col < COLS - 1) ||
    ((col === 0 || col === COLS - 1) && row > 0 && row < ROWS - 1)
  );
}

/* CAPACITY */

function getCapacity(row, col) {
  if (cornerCell(row, col)) {
    return 1;
  }

  if (edgeCell(row, col)) {
    return 2;
  }

  return 3;
}

/* HANDLE MOVE */

function handleMove(event) {
  if (gameEnded) {
    return;
  }
  const row = parseInt(event.target.dataset.row);

  const col = parseInt(event.target.dataset.col);

  const cell = board[row][col];

  const currentPlayer = turn % 2;

  /* FIRST TWO TURNS */

  if (turn < 2) {
    if (cell.color !== -1) {
      return;
    }

    cell.color = currentPlayer;

    if (cornerCell(row, col)) {
      cell.count = 1;
    } else if (edgeCell(row, col)) {
      cell.count = 2;
    } else {
      cell.count = 3;
    }
    if (currentPlayer === 0) {
      blueScore += cell.count;
      blueCell++;
    } else {
      redScore += cell.count;
      redCell++;
    }

    updateBoard();

    switchTurn();

    return;
  }

  /* AFTER FIRST TWO MOVES */

  if (cell.color !== currentPlayer) {
    return;
  }

  /* NORMAL MOVE */

  cell.count++;
  if (currentPlayer === 0) {
    blueScore++;
  } else {
    redScore++;
  }

  chainReaction(row, col);

  updateBoard();

  switchTurn();
}

/* CHAIN REACTION */

function chainReaction(row, col) {
  const cell = board[row][col];

  if (cell.count <= getCapacity(row, col)) {
    return;
  }

  explodeSound.currentTime = 0;

  explodeSound.play();

  const color = cell.color;

  //cell becomes empty
  if(color===0)blueCell--;
  else redCell--;
  cell.count = 0;
  cell.color = -1;

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const [dr, dc] of directions) {
    const nr = row + dr;

    const nc = col + dc;

    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
      if (board[nr][nc].color === -1) {
        //cell is empty
        if (color === 0) {//if exploding cell is blue
          blueScore++;
          blueCell++;
        } else if(color===1) {//if exploding cell is red
          redScore++;
          redCell++;
        }
      } else if (board[nr][nc].color !== color) {
        //cell is of opposite color
        if (color === 0) {//if exploding cell is blue
          blueScore++;
          redCell--;
          blueCell++;
        } else if(color===1) {//if exploding cell is red
          redScore++;
          blueCell--;
          redCell++;
        }
      }
      board[nr][nc].color = color;

      board[nr][nc].count++;

      chainReaction(nr, nc);
    }
  }
}

/* UPDATE BOARD */

function updateBoard() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);

    const col = parseInt(cell.dataset.col);

    const data = board[row][col];

    cell.innerHTML = "";

    const colorClass = data.color === 0 ? "blue-orb" : "red-orb";

    if (data.count === 1) {
      createSingleOrb(cell, colorClass);
    } else if (data.count === 2) {
      createDoubleOrb(cell, colorClass);
    } else if (data.count >= 3) {
      createTripleOrb(cell, colorClass);
    }
  });

  document.getElementById("blueScore").innerText = `BLUE ${blueScore}`;

  document.getElementById("redScore").innerText = `RED ${redScore}`;
  console.log(blueCell,redCell);
  if (turn > 1 && (redCell === 0 || blueCell === 0)) {
    gameEnded=true;
    gameOver();
  }
}

/* ORB CREATION */

function createOrb(colorClass) {
  const orb = document.createElement("div");

  orb.classList.add("orb", colorClass);

  return orb;
}

function createSingleOrb(cell, colorClass) {
  const orb = createOrb(colorClass);

  orb.style.left = "50%";

  orb.style.top = "50%";

  orb.style.transform = "translate(-50%,-50%)";

  cell.appendChild(orb);
}

function createDoubleOrb(cell, colorClass) {
  const orb1 = createOrb(colorClass);

  const orb2 = createOrb(colorClass);

  orb1.style.left = "35%";
  orb2.style.left = "65%";

  orb1.style.top = "50%";
  orb2.style.top = "50%";

  orb1.style.transform = "translate(-50%,-50%)";

  orb2.style.transform = "translate(-50%,-50%)";

  cell.appendChild(orb1);

  cell.appendChild(orb2);
}

function createTripleOrb(cell, colorClass) {
  const positions = [
    ["50%", "28%"],
    ["32%", "68%"],
    ["68%", "68%"],
  ];

  positions.forEach((pos) => {
    const orb = createOrb(colorClass);

    orb.style.left = pos[0];

    orb.style.top = pos[1];

    orb.style.transform = "translate(-50%,-50%)";

    cell.appendChild(orb);
  });
}

/* SWITCH TURN */

function switchTurn() {
  if (gameEnded) {
    return;
  }
  turn++;
  playerSeconds = 15;

  if (turn % 2 === 0) {
    turnText.innerText = "BLUE player's turn";

    turnText.style.color = "blue";
  } else {
    turnText.innerText = "RED player's turn";

    turnText.style.color = "red";
  }
}
