const ROWS = 6;

const COLS = 12;

const boardElement =
document.getElementById("board");

const turnDisplay =
document.getElementById("turn-display");

let currentPlayer = "red";

const board = [];

// =====================
// CREATE BOARD
// =====================

for (let r = 0; r < ROWS; r++) {

    board[r] = [];

    for (let c = 0; c < COLS; c++) {

        board[r][c] = {

            count: 0,

            player: null
        };
    }
}

// =====================
// RENDER BOARD
// =====================

function renderBoard() {

    boardElement.innerHTML = "";

    for (let r = 0; r < ROWS; r++) {

        for (let c = 0; c < COLS; c++) {

            const cellData = board[r][c];

            const cell =
            document.createElement("div");

            cell.classList.add("cell");

            if (cellData.player) {

                cell.classList.add(
                    cellData.player
                );
            }

            cell.textContent =
                cellData.count > 0
                ? cellData.count
                : "";

            cell.addEventListener(
                "click",
                () => {

                    handleMove(r, c);
                }
            );

            boardElement.appendChild(cell);
        }
    }

    turnDisplay.textContent =
        `Current Turn: ${currentPlayer.toUpperCase()}`;
}

// =====================
// HANDLE MOVE
// =====================

function handleMove(row, col) {

    const cell = board[row][col];

    // cannot place on enemy cell

    if (

        cell.player !== null &&

        cell.player !== currentPlayer

    ) {

        return;
    }

    cell.count++;

    cell.player = currentPlayer;

    checkExplosion(row, col);

    switchPlayer();

    renderBoard();
}

// =====================
// SWITCH PLAYER
// =====================

function switchPlayer() {

    currentPlayer =

        currentPlayer === "red"

        ? "blue"

        : "red";
}

// =====================
// GET CAPACITY
// =====================

function getCapacity(row, col) {

    const top =
        row === 0;

    const bottom =
        row === ROWS - 1;

    const left =
        col === 0;

    const right =
        col === COLS - 1;

    // corner

    if (

        (top && left) ||

        (top && right) ||

        (bottom && left) ||

        (bottom && right)

    ) {

        return 2;
    }

    // edge

    if (

        top ||

        bottom ||

        left ||

        right

    ) {

        return 3;
    }

    // middle

    return 4;
}

// =====================
// GET NEIGHBORS
// =====================

function getNeighbors(row, col) {

    const neighbors = [];

    // up

    if (row > 0) {

        neighbors.push(
            [row - 1, col]
        );
    }

    // down

    if (row < ROWS - 1) {

        neighbors.push(
            [row + 1, col]
        );
    }

    // left

    if (col > 0) {

        neighbors.push(
            [row, col - 1]
        );
    }

    // right

    if (col < COLS - 1) {

        neighbors.push(
            [row, col + 1]
        );
    }

    return neighbors;
}

// =====================
// CHECK EXPLOSION
// =====================

function checkExplosion(row, col) {

    const cell =
        board[row][col];

    const capacity =
        getCapacity(row, col);

    if (

        cell.count < capacity

    ) {

        return;
    }

    explode(row, col);
}

// =====================
// EXPLODE
// =====================

function explode(row, col) {

    const cell =
        board[row][col];

    const owner =
        cell.player;

    // clear current cell

    cell.count = 0;

    cell.player = null;

    // get neighbors

    const neighbors =
        getNeighbors(row, col);

    neighbors.forEach(

        ([nr, nc]) => {

            board[nr][nc].count++;

            // capture

            board[nr][nc].player =
                owner;

            // recursive chain reaction

            checkExplosion(nr, nc);
        }
    );
}

// =====================
// START GAME
// =====================

renderBoard();