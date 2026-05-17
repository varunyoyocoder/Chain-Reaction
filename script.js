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
let intervalId = "resume";

// accessing clickable elements by id and updating them in js
const boardElement = document.getElementById("board"); // css class board, html id board 72 cells clickable and id accessed

const explodeSound = document.getElementById("explodeSound"); // html audio id,

const turnText = document.getElementById("turnText"); //class center text, id turn text,updated in js

const pauseButton = document.getElementById("pauseBtn");
const pauseDialogBox = document.getElementById("pauseOverlay");
const restartDialogBox = document.getElementById("restartOverlay");
const resumeButton = document.getElementById("resumeBtn");
const restartButton = document.getElementById("restartBtn");
const dialogBoxHeader = document.getElementById("dialogBoxHeader");
const dialogBoxPara = document.getElementById("dialogBoxPara");

pauseButton.addEventListener("click", pauseInterval);
resumeButton.addEventListener("click", resumeInterval);
restartButton.addEventListener("click",()=>{
    restartDialogBox.classList.add("hidden");
    startGame();
});
//
const board = Array.from(
  { length: ROWS },

  () =>
    Array.from(
      { length: COLS }, // returns an array with 12 col

      () => ({
        color: -1,
        count: 0,
      }), // returns an array with 6 cols , 12 rows and each cell has two attributes  count zero given, color empty given
    ),
);

/* CREATE BOARD */

function createBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div"); // iding cell with its row,col

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
  // game begins and variables are reset everytime it begins
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
  // game ends and based on score winner announced,game starts after 10s
  gameEnded = true;
  turnText.innerText = "";
  
  restartDialogBox.classList.remove("hidden");
  if (blueScore > redScore) {
    dialogBoxHeader.innerText = "Blue Wins";
    dialogBoxHeader.style.color = "blue";
  } else {
    dialogBoxHeader.innerText = "Red Wins";
    dialogBoxHeader.style.color = "red";
  }
  dialogBoxPara.innerText=`Blue Score:${blueScore} Red Score:${redScore}`;
  dialogBoxPara.style.color="green";
}


startGame();

/* TIMERS */
function updateTimer() {
  if (gameEnded) {
    //game ended initially true and exits when it becomes false
    return;
  }
  gameSeconds--;

  playerSeconds--;

  const gm = Math.floor(gameSeconds / 60); //gm is gm:00,, to find minute

  const gs = String(gameSeconds % 60).padStart(2, "0"); //finding remainder for seconds, padstart adds zeroes if gs is less than 2 digits , and ensures gs is always 2 digits, gm:gs

  const ps = String(playerSeconds).padStart(2, "0"); //same as game time

  document.getElementById("gameTimer").innerText = `GAME TIMER ${gm}:${gs}`; //html id to update game timer in js

  document.getElementById("playerTimer").innerText = `PLAYER TIMER 0:${ps}`; //html id to update playertime in js

  if (playerSeconds <= 0) {
    //player loses turn switched to next player
    switchTurn();
  }
  if (gameSeconds <= 0) {
    //game over
    gameOver();
  }
}

intervalId = setInterval(updateTimer, 1000); // function called every 1 sec interval
function pauseInterval() {
  clearInterval(intervalId);
  pauseDialogBox.classList.remove("hidden");
}

// Resume
function resumeInterval() {
  clearInterval(intervalId); // Prevents duplicate intervals
  pauseDialogBox.classList.add("hidden");
  intervalId = setInterval(updateTimer, 1000);
}

function cornerCell(row, col) {
  //checking corner
  return (
    (row === 0 && col === 0) ||
    (row === 0 && col === COLS - 1) ||
    (row === ROWS - 1 && col === 0) ||
    (row === ROWS - 1 && col === COLS - 1)
  );
}

function edgeCell(row, col) {
  // checking edge, if not edge and corner it is innercell
  return (
    ((row === 0 || row === ROWS - 1) && col > 0 && col < COLS - 1) ||
    ((col === 0 || col === COLS - 1) && row > 0 && row < ROWS - 1)
  );
}

function getCapacity(row, col) {
  // first move and to check chain reaction
  if (cornerCell(row, col)) {
    return 1;
  } else if (edgeCell(row, col)) {
    return 2;
  }

  return 3;
}

/* HANDLE MOVE */

function handleMove(event) {
  if (gameEnded) {
    //checking if gameEnded, then exit function
    return;
  }
  const row = parseInt(event.target.dataset.row);

  const col = parseInt(event.target.dataset.col);

  const cell = board[row][col];

  const currentPlayer = turn % 2; //0 blue 1 red

  if (turn <2||(turn===2&&blueCell===0)) {
    //to check first move of blue and red and if blue misses firstmove
    if (cell.color !== -1) {
      //initial all cells empty,so color==-1,if red chooses blue celll func exits
      return;
    }

    cell.color = currentPlayer;
    //initialising ball count
    if (cornerCell(row, col)) {
      cell.count = 1;
    } else if (edgeCell(row, col)) {
      cell.count = 2;
    } else {
      cell.count = 3;
    }
    if (currentPlayer === 0) {
      blueScore += cell.count; //updating cell count accordingly
      blueCell++; //to check no of cells with blue balls
    } else {
      redScore += cell.count;
      redCell++; //to check no of cells with red balls
    }

    updateBoard();

    switchTurn(); // blue to red, red to blue

    return;
  }

  //after first move of blue and red
  if (cell.color !== currentPlayer) {
    return;
  }

  cell.count++; //for every move add one ball
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
    // checks if chain reaction possible
    return;
  }

  explodeSound.currentTime = 0;

  explodeSound.play();

  const color = cell.color;

  //cell becomes empty
  if (color === 0)
    blueCell--; // particular cell becomes  empty after explosion
  else redCell--;
  cell.count = 0; //count=0
  cell.color = -1; //empty

  const directions = [
    [-1, 0], //  upbox
    [1, 0], // down box
    [0, -1], //left box
    [0, 1], // right box
  ];

  for (const [dr, dc] of directions) {
    const nr = row + dr;

    const nc = col + dc;

    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
      // checking if these cell exist
      if (board[nr][nc].color === -1) {
        //cell is empty
        if (color === 0) {
          //if exploding cell is blue
          blueScore++; //capturing empty cell +1 point
          blueCell++; // capturing new cell,bluecell count +1
        } else if (color === 1) {
          //if exploding cell is red
          redScore++; //capturing empty cell +1 point
          redCell++; // capturing new cell,red cell count +1
        }
      } else if (board[nr][nc].color !== color) {
        //cell is of opposite color
        if (color === 0) {
          //if exploding cell is blue
          blueScore++; // exploding cell becomes blue
          redCell--; // red cell becomes blue, count dec
          blueCell++;
        } else if (color === 1) {
          //if exploding cell is red
          blueCell--; // blue cell becomes red, count dec
          redScore++; // exploding cell becomes red
          redCell++;
        } // same color case, redCell/blueCell does not inc,and score does not inc
      }
      board[nr][nc].color = color; // color of neighbouring cell changes to explosion cell

      board[nr][nc].count++; //count of neighbouring cell updated

      chainReaction(nr, nc); //recursion
    }
  }
}

function updateBoard() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);

    const col = parseInt(cell.dataset.col);

    const data = board[row][col];

    cell.innerHTML = ""; //creating 72 empty cells

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
  console.log(blueCell, redCell);
  if (turn > 1 && (redCell === 0 || blueCell === 0)) {
    gameEnded = true;
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
    turnText.innerText = "BLUE's turn";

    turnText.style.color = "blue";
  } else {
    turnText.innerText = "RED's turn";

    turnText.style.color = "red";
  }
}
