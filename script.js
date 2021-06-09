const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;

  return {getName, getToken}
};

const gameBoard = (() => {
  let board = [[' ', ' ', ' '], 
               [' ', ' ', ' '],
               [' ', ' ', ' ']];
  
  const getBoard = () => board;
  const placeToken = (row, col, token) => {
    board[row][col] = token;
  }
  return {getBoard, placeToken}
})();

const displayController = (() => {
  const gameBoard = gameBoard();
  let currentPlayer = null;
  let nextPlayer = null;
  let winner = null;
  let gameOver = false;

  const playerMove = (row, col) => {
    placeToken(row, col, currentPlayer.getToken());

    for(let i = 0; i < 3; i++) { //check rows
      if(gameBoard.getBoard()[i].every(element => element == currentPlayer.getToken())) {
        gameOver = true;
        winner = currentPlayer;
        return
      }
    }

    for(let i = 0; i < 3; i++) { //check columns
      let subarray = [gameBoard.getBoard()[0][i], gameBoard.getBoard()[1][i], gameBoard.getBoard()[2][i]];
      if(subarray.every(element => element == currentPlayer.getToken())) {
        gameOver = true;
        winner = currentPlayer;
        return
      }
    }

    //check diags
    let subarray = [gameBoard.getBoard()[0][0], gameBoard.getBoard()[1][1], gameBoard.getBoard()[2][2]];
    if(subarray.every(element => element == currentPlayer.getToken())) {
      gameOver = true;
      winner = currentPlayer;
      return
    }
    subarray = [gameBoard.getBoard()[0][2], gameBoard.getBoard()[1][1], gameBoard.getBoard()[2][0]];
    if(subarray.every(element => element == currentPlayer.getToken())) {
      gameOver = true;
      winner = currentPlayer;
      return
    }
    
    let temp = currentPlayer;
    currentPlayer = nextPlayer;
    nextPlayer = temp;
  }
})();