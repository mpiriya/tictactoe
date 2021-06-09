//Player Factory
const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;

  return {getName, getToken}
};

//game board module
const gameBoard = (() => {
  let board = [[' ', ' ', ' '], 
               [' ', ' ', ' '],
               [' ', ' ', ' ']];
  
  const getBoard = () => board;
  const placeToken = (row, col, token) => {
    board[row][col] = token;
  }
  
  // only give getBoard so that end user can't manually edit board and cheat
  return {getBoard, placeToken}
})();

//display controller module
const displayController = (() => {
  const gameBoard = gameBoard();
  let currentPlayer = null;
  let nextPlayer = null;
  let winner = null;
  let gameOver = false;

  const isGameOver = () => gameOver;

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

    //swap the two players so that the next player's token is placed next turn
    let temp = currentPlayer;
    currentPlayer = nextPlayer;
    nextPlayer = temp;
  }

  /* only make available what's really necessary: 
      allowing the next player to make a move at a certain space and
      letting the user know whether the game is over or not
  */
  return {playerMove, isGameOver}
})();