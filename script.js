//Player Factory
const Player = (name, token) => {
  const getName = () => name;
  const setName = (newname) => name = newname;
  const getToken = () => token;

  return {getName, setName, getToken}
};

//game board module
const gameBoard = (() => {
  let board = [[' ', ' ', ' '], 
               [' ', ' ', ' '],
               [' ', ' ', ' ']];
  
  const getBoard = () => board;
  const placeToken = (row, col, token) => {
    if(board[row][col] != ' ') {
      return false
    }
    board[row][col] = token;
    return true
  }
  
  // only give getBoard so that end user can't manually edit board and cheat
  return {getBoard, placeToken}
})();

//display controller module
const displayController = (() => {
  const board = gameBoard;
  let currentPlayer = Player("Player 1", "X");
  let nextPlayer = Player("Player 2", "O");
  let winner = null;
  let gameOver = false;

  const isGameOver = () => gameOver;

  const playerMove = (row, col) => {
    if(!board.placeToken(row, col, currentPlayer.getToken())) {
      //do not switch player, and just do nothing
      return false
    }

    for(let i = 0; i < 3; i++) { //check rows
      if(board.getBoard()[i].every(element => element == currentPlayer.getToken())) {
        gameOver = true;
        winner = currentPlayer;
        return true
      }
    }

    for(let i = 0; i < 3; i++) { //check columns
      let subarray = [board.getBoard()[0][i], board.getBoard()[1][i], board.getBoard()[2][i]];
      if(subarray.every(element => element == currentPlayer.getToken())) {
        gameOver = true;
        winner = currentPlayer;
        return true
      }
    }

    //check diags
    let subarray = [board.getBoard()[0][0], board.getBoard()[1][1], board.getBoard()[2][2]];
    if(subarray.every(element => element == currentPlayer.getToken())) {
      gameOver = true;
      winner = currentPlayer;
      return true
    }
    subarray = [board.getBoard()[0][2], board.getBoard()[1][1], board.getBoard()[2][0]];
    if(subarray.every(element => element == currentPlayer.getToken())) {
      gameOver = true;
      winner = currentPlayer;
      return true
    }

    //swap the two players so that the next player's token is placed next turn
    let temp = currentPlayer;
    currentPlayer = nextPlayer;
    nextPlayer = temp;

    return true
  }

  /* only make available what's really necessary: 
      allowing the next player to make a move at a certain space and
      letting the user know whether the game is over or not
  */
  return {playerMove, isGameOver}
})();

(function createHTMLBoard() {
  let table = document.getElementById("board")
  for(let i = 0; i < 3; i++) {
    let tr = document.createElement("tr")
    tr.setAttribute("data-row", i)
    for(let j = 0; j < 3; j++) {
      let td = document.createElement("td")
      td.setAttribute("data-row", i)
      td.setAttribute("data-col", j)
      td.textContent = gameBoard.getBoard()[i][j]
      td.addEventListener(("click"), () => {
        if(!displayController.isGameOver()) { //game is not over (no winners)
          if(displayController.playerMove(i, j)) { //player made a valid move
            //set the textContent to the 
            td.textContent = gameBoard.getBoard()[i][j]
          } else {
            //not a valid move
          }
        }
      })
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
})();