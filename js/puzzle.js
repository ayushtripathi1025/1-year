// js/puzzle.js

// ------------------------------------------------------------
// SLIDING PUZZLE
//
// Classic sliding puzzle:
// 3x3 = 8 pieces + 1 blank
// 4x4 = 15 pieces + 1 blank
//
// A piece can only move into the blank space if it is
// directly next to the blank.
// ------------------------------------------------------------

const puzzleBoard = document.getElementById("puzzle-board");
const puzzleResetButton = document.getElementById("puzzle-reset");
const puzzleStatus = document.getElementById("puzzle-status");
const puzzleContinueButton =
  document.getElementById("puzzle-continue");

let puzzleGridSize = 3;
let puzzleTiles = [];
let puzzleSolved = false;


// ------------------------------------------------------------
// GRID SIZE
// ------------------------------------------------------------

function getPuzzleGridSize() {
  if (window.innerWidth >= 1024) {
    return SITE_CONFIG.puzzle.desktopGridSize;
  }

  return SITE_CONFIG.puzzle.mobileGridSize;
}


// ------------------------------------------------------------
// CREATE SOLVED PUZZLE
//
// Example 3x3:
//
//  1 2 3
//  4 5 6
//  7 8 _
//
// The blank is represented by null.
// ------------------------------------------------------------

function createSolvedPuzzle() {
  puzzleGridSize = getPuzzleGridSize();

  const totalPositions =
    puzzleGridSize * puzzleGridSize;

  puzzleTiles = [];

  for (let position = 0; position < totalPositions; position++) {

    // Last position is the blank.
    if (position === totalPositions - 1) {
      puzzleTiles.push(null);
    } else {
      puzzleTiles.push(position);
    }
  }
}


// ------------------------------------------------------------
// GET BLANK POSITION
// ------------------------------------------------------------

function getBlankPosition() {
  return puzzleTiles.indexOf(null);
}


// ------------------------------------------------------------
// GET NEIGHBOURS
// ------------------------------------------------------------

function getAdjacentPositions(position) {
  const neighbours = [];

  const row =
    Math.floor(position / puzzleGridSize);

  const column =
    position % puzzleGridSize;


  // Up
  if (row > 0) {
    neighbours.push(
      position - puzzleGridSize
    );
  }


  // Down
  if (row < puzzleGridSize - 1) {
    neighbours.push(
      position + puzzleGridSize
    );
  }


  // Left
  if (column > 0) {
    neighbours.push(
      position - 1
    );
  }


  // Right
  if (column < puzzleGridSize - 1) {
    neighbours.push(
      position + 1
    );
  }


  return neighbours;
}


// ------------------------------------------------------------
// CHECK IF POSITION CAN MOVE
// ------------------------------------------------------------

function canMoveTile(position) {
  const blankPosition =
    getBlankPosition();

  return getAdjacentPositions(
    blankPosition
  ).includes(position);
}


// ------------------------------------------------------------
// MOVE TILE
// ------------------------------------------------------------

function moveTile(position) {
  if (!canMoveTile(position)) {
    return false;
  }

  const blankPosition =
    getBlankPosition();

  // Move the selected tile into the blank.
  [
    puzzleTiles[position],
    puzzleTiles[blankPosition]
  ] = [
    puzzleTiles[blankPosition],
    puzzleTiles[position]
  ];

  return true;
}


// ------------------------------------------------------------
// SHUFFLE
//
// IMPORTANT:
// We don't randomly arrange the tiles because some random
// arrangements of a sliding puzzle cannot be solved.
//
// Instead, we start from the solved puzzle and perform
// hundreds of legal moves.
//
// That guarantees the resulting puzzle is solvable.
// ------------------------------------------------------------

function shufflePuzzle() {

  createSolvedPuzzle();

  let blankPosition =
    getBlankPosition();

  let previousBlankPosition = -1;

  const shuffleMoves =
    puzzleGridSize === 3
      ? 120
      : 250;


  for (
    let move = 0;
    move < shuffleMoves;
    move++
  ) {

    let possibleMoves =
      getAdjacentPositions(
        blankPosition
      );


    // Avoid immediately undoing the previous move.
    if (
      possibleMoves.length > 1 &&
      previousBlankPosition !== -1
    ) {
      possibleMoves =
        possibleMoves.filter(
          (position) =>
            position !==
            previousBlankPosition
        );
    }


    const randomIndex =
      Math.floor(
        Math.random() *
        possibleMoves.length
      );


    const selectedPosition =
      possibleMoves[randomIndex];


    previousBlankPosition =
      blankPosition;


    moveTile(selectedPosition);

    blankPosition =
      selectedPosition;
  }


  // Make sure we didn't somehow end up solved.
  if (isPuzzleSolved()) {
    shufflePuzzle();
  }
}


// ------------------------------------------------------------
// CHECK SOLVED
// ------------------------------------------------------------

function isPuzzleSolved() {

  const lastPosition =
    puzzleTiles.length - 1;


  for (
    let position = 0;
    position < lastPosition;
    position++
  ) {

    if (
      puzzleTiles[position] !==
      position
    ) {
      return false;
    }
  }


  // Blank must be at the very end.
  return (
    puzzleTiles[lastPosition] === null
  );
}


// ------------------------------------------------------------
// CREATE VISUAL TILE
// ------------------------------------------------------------

function createPuzzleTile(
  tileId,
  position
) {

  const tile =
    document.createElement("button");

  tile.type = "button";

  tile.className =
    "puzzle-piece";


  tile.dataset.position =
    position;


  tile.setAttribute(
    "aria-label",
    `Puzzle piece ${tileId + 1}`
  );


  // ----------------------------------------------------------
  // IMAGE POSITION
  // ----------------------------------------------------------

  const row =
    Math.floor(
      tileId / puzzleGridSize
    );


  const column =
    tileId % puzzleGridSize;


  const backgroundX =
    puzzleGridSize === 1
      ? 0
      : (
          column /
          (puzzleGridSize - 1)
        ) * 100;


  const backgroundY =
    puzzleGridSize === 1
      ? 0
      : (
          row /
          (puzzleGridSize - 1)
        ) * 100;


  tile.style.backgroundImage =
    `url("${SITE_CONFIG.puzzle.image}")`;


  tile.style.backgroundSize =
    `${puzzleGridSize * 100}% ${puzzleGridSize * 100}%`;


  tile.style.backgroundPosition =
    `${backgroundX}% ${backgroundY}%`;


  // ----------------------------------------------------------
  // ONLY ADJACENT TILES SHOULD LOOK MOVABLE
  // ----------------------------------------------------------

  if (canMoveTile(position)) {
    tile.classList.add(
      "is-movable"
    );
  }


  return tile;
}


// ------------------------------------------------------------
// CREATE BLANK TILE
// ------------------------------------------------------------

function createBlankTile(position) {

  const blank =
    document.createElement("div");

  blank.className =
    "puzzle-blank";


  blank.dataset.position =
    position;


  blank.setAttribute(
    "aria-hidden",
    "true"
  );


  return blank;
}


// ------------------------------------------------------------
// RENDER
// ------------------------------------------------------------

function renderPuzzle() {

  if (!puzzleBoard) {
    return;
  }


  puzzleBoard.innerHTML = "";


  puzzleBoard.style.setProperty(
    "--puzzle-grid-size",
    puzzleGridSize
  );


  puzzleTiles.forEach(
    (tileId, position) => {

      // Blank space.
      if (tileId === null) {

        puzzleBoard.appendChild(
          createBlankTile(
            position
          )
        );

        return;
      }


      // Normal image tile.
      puzzleBoard.appendChild(
        createPuzzleTile(
          tileId,
          position
        )
      );
    }
  );


  setupPuzzleInteractions();

  updatePuzzleStatus();
}


// ------------------------------------------------------------
// HANDLE TILE CLICK
// ------------------------------------------------------------

function handlePuzzleTileClick(
  position
) {

  // Only a tile directly next to the blank
  // can move.
  if (!canMoveTile(position)) {

    debugLog(
      "Tile cannot move:",
      position
    );

    return;
  }


  const moved =
    moveTile(position);


  if (!moved) {
    return;
  }


  debugLog(
    "Moved tile from position:",
    position
  );


  renderPuzzle();

  checkPuzzleCompletion();
}


// ------------------------------------------------------------
// INTERACTIONS
// ------------------------------------------------------------

function setupPuzzleInteractions() {

  if (!puzzleBoard) {
    return;
  }


  const pieces =
    puzzleBoard.querySelectorAll(
      ".puzzle-piece"
    );


  pieces.forEach(
    (piece) => {

      piece.addEventListener(
        "click",
        (event) => {

          event.preventDefault();


          const position =
            Number(
              piece.dataset.position
            );


          handlePuzzleTileClick(
            position
          );
        }
      );
    }
  );
}


// ------------------------------------------------------------
// COMPLETION
// ------------------------------------------------------------

function checkPuzzleCompletion() {

  if (!isPuzzleSolved()) {

    puzzleSolved = false;

    updatePuzzleStatus();

    return;
  }


  puzzleSolved = true;


  if (puzzleBoard) {
    puzzleBoard.classList.add(
      "is-complete"
    );
  }


  updatePuzzleStatus();


  if (puzzleContinueButton) {

    puzzleContinueButton.disabled =
      false;


    puzzleContinueButton.setAttribute(
      "aria-disabled",
      "false"
    );
  }


  debugLog(
    "Sliding puzzle completed!"
  );
}


// ------------------------------------------------------------
// STATUS
// ------------------------------------------------------------

function updatePuzzleStatus() {

  if (!puzzleStatus) {
    return;
  }


  if (puzzleSolved) {

    puzzleStatus.textContent =
      "You did it! ♡ Puzzle complete.";


    puzzleStatus.classList.add(
      "is-complete"
    );


    return;
  }


  puzzleStatus.textContent =
    "Slide the pieces into place. ♡";


  puzzleStatus.classList.remove(
    "is-complete"
  );
}


// ------------------------------------------------------------
// RESET
// ------------------------------------------------------------

function resetPuzzle() {

  puzzleSolved = false;


  if (puzzleBoard) {
    puzzleBoard.classList.remove(
      "is-complete"
    );
  }


  if (puzzleContinueButton) {

    puzzleContinueButton.disabled =
      true;


    puzzleContinueButton.setAttribute(
      "aria-disabled",
      "true"
    );
  }


  shufflePuzzle();

  renderPuzzle();


  debugLog(
    "Sliding puzzle reset."
  );
}


// ------------------------------------------------------------
// TEST / AUTO SOLVE
// ------------------------------------------------------------

function solvePuzzle() {

  createSolvedPuzzle();

  puzzleSolved = true;

  renderPuzzle();

  checkPuzzleCompletion();


  debugLog(
    "Sliding puzzle auto-solved."
  );
}


// ------------------------------------------------------------
// INITIALIZE
// ------------------------------------------------------------

function initializePuzzle() {

  if (!puzzleBoard) {

    debugLog(
      "Puzzle board not found."
    );

    return;
  }


  shufflePuzzle();

  renderPuzzle();


  if (puzzleContinueButton) {

    puzzleContinueButton.disabled =
      true;


    puzzleContinueButton.setAttribute(
      "aria-disabled",
      "true"
    );
  }


  debugLog(
    `Sliding puzzle initialized: ${puzzleGridSize}x${puzzleGridSize}`
  );
}


// ------------------------------------------------------------
// RESET BUTTON
// ------------------------------------------------------------

if (puzzleResetButton) {

  puzzleResetButton.addEventListener(
    "click",
    resetPuzzle
  );
}


// ------------------------------------------------------------
// RESPONSIVE GRID
// ------------------------------------------------------------

let previousPuzzleGridSize =
  getPuzzleGridSize();


window.addEventListener(
  "resize",
  () => {

    const newGridSize =
      getPuzzleGridSize();


    if (
      newGridSize ===
      previousPuzzleGridSize
    ) {
      return;
    }


    previousPuzzleGridSize =
      newGridSize;


    resetPuzzle();


    debugLog(
      `Puzzle grid changed to ${newGridSize}x${newGridSize}`
    );
  }
);


// ------------------------------------------------------------
// START
// ------------------------------------------------------------

initializePuzzle();