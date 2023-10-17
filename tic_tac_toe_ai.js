const cells = document.querySelectorAll(".cell");
const playerX = "X";
const playerO = "O";
let board = Array.from({ length: 9 }, () => "");

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

function handleCellClick(event) {
    const cell = event.target;
    const cellId = parseInt(cell.dataset.id);
  
    if (board[cellId] || isGameOver(board)) return;
  
    makeMove(cellId, playerX);
    if (isGameOver(board)) {
      displayWinner(board);
      setTimeout(resetGame, 2000);
      return;
    }
  
    const bestMove = minimax(board, playerO).index;
    if (bestMove !== undefined) {
      makeMove(bestMove, playerO);
      if (isGameOver(board)) {
        displayWinner(board);
        setTimeout(resetGame, 2000);
      }
    }
  }
  

function makeMove(cellId, player) {
  board[cellId] = player;
  const cell = cells[cellId];
  cell.textContent = player;
  cell.dataset.owner = player;
}

function minimax(newBoard, player, alpha = -Infinity, beta = Infinity) {
    const availableSpots = emptyIndices(newBoard);
  
    if (checkWin(newBoard, playerO)) return { score: -1 };
    else if (checkWin(newBoard, playerX)) return { score: 1 };
    else if (availableSpots.length === 0) return { score: 0 };
  
    let moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
      let move = {};
      move.index = availableSpots[i];
      newBoard[availableSpots[i]] = player;
  
      if (player === playerX) {
        const result = minimax(newBoard, playerO, alpha, beta);
        move.score = result.score;
        alpha = Math.max(alpha, move.score);
      } else {
        const result = minimax(newBoard, playerX, alpha, beta);
        move.score = result.score;
        beta = Math.min(beta, move.score);
      }
  
      newBoard[availableSpots[i]] = ""; // Revert the move
      moves.push(move);
  
      if (beta <= alpha) break; // Prune the branches
    }
  
    let bestMove;
    if (player === playerX) {
      let bestScore = -Infinity;
      moves.forEach((move, index) => {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = index;
        }
      });
    } else {
      let bestScore = Infinity;
      moves.forEach((move, index) => {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = index;
        }
      });
    }
  
    return moves[bestMove];
  }
  

function emptyIndices(board) {
  return board.reduce((indices, cell, index) => {
    if (!cell) indices.push(index);
    return indices;
  }, []);
}

function checkWin(board, player) {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winConditions.some((condition) =>
    condition.every((index) => board[index] === player)
  );
}

function isGameOver(board) {
  return checkWin(board, playerX) || checkWin(board, playerO) || emptyIndices(board).length === 0;
}

function displayWinner(board) {
    let winner;
    if (checkWin(board, playerX)) winner = "Player X";
    else if (checkWin(board, playerO)) winner = "Player O";
    else winner = "Draw";
  
    const message = document.getElementById("winner-message");
    message.textContent = winner === "Draw" ? "It's a draw!" : `${winner} wins!`;
  
    const modal = document.getElementById("modal");
    modal.style.display = "block";
  }
  
function resetGame() {
    board = Array.from({ length: 9 }, () => "");
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.dataset.owner = "";
    });
  
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  }
  
  

