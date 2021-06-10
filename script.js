//Player Factory
const Player = (name, token) => {
  const getName = () => name;
  const setName = (newname) => name = newname;
  const getToken = () => token;

  return {getName, setName, getToken}
};

const p1 = Player("Player 1", "X");
const p2 = Player("Player 2", "O");

//game board module
const gameBoard = (() => {
  let board = [[' ', ' ', ' '], 
               [' ', ' ', ' '],
               [' ', ' ', ' ']];
  let moveCount = 0;
  
  const getBoard = () => board;
  const getMoveCount = () => moveCount;
  const placeToken = (row, col, token) => {
    if(board[row][col] != ' ') {
      return false
    }
    board[row][col] = token;
    moveCount++;
    return true
  }
  
  // only give getBoard so that end user can't manually edit board and cheat
  return {getBoard, getMoveCount, placeToken}
})();

//display controller module
const displayController = (() => {
  const board = gameBoard;
  let currentPlayer = p1;
  let nextPlayer = p2;
  let winner = null;
  let gameOver = false;

  const isGameOver = () => gameOver;
  const getWinner = () => winner;

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

    //check tie
    if(board.getMoveCount() == 9 && winner == null) {
      gameOver = true;
      //Alert user of tie
      
      //Prompt user for new game

        //if yes: reset all elements

        //if no: hide prompt
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
  return {isGameOver, getWinner, playerMove}
})();

(function createHTMLBoard() {
  const table = document.getElementById("board")
  for(let i = 0; i < 3; i++) {
    // 3 rows
    const tr = document.createElement("tr")
    for(let j = 0; j < 3; j++) {
      // 3 columns
      const td = document.createElement("td")
      td.textContent = gameBoard.getBoard()[i][j]
      td.addEventListener("click", () => {
        if(!displayController.isGameOver()) { //game is not over (no winners)
          if(displayController.playerMove(i, j)) { //player made a valid move
            //update the td's textContent to reflect gameBoard
            td.textContent = gameBoard.getBoard()[i][j]
          }
        }
      })
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }

  //button handling stuffs
  const p1Edit = document.getElementById("p1nameEdit")
  p1Edit.addEventListener("click", () => {
    //hide edit button
    p1Edit.style.display = "none"
    //show input field, input submit button
    document.getElementById("p1nameForm").style.display = "block"
    document.getElementById("p1nameSubmit").addEventListener("click", () => {
      p1.setName(document.getElementById("p1nameText").value)
      document.getElementById("p1name").textContent = p1.getName()
      document.getElementById("p1nameForm").style.display = "none"
      p1Edit.style.display = "inline-block"
    })
  })

  const p2Edit = document.getElementById("p2nameEdit")
  p2Edit.addEventListener("click", () => {
    //hide edit button
    p2Edit.style.display = "none"
    //show input field, input submit button
    document.getElementById("p2nameForm").style.display = "block"
    document.getElementById("p2nameSubmit").addEventListener("click", () => {
      p2.setName(document.getElementById("p2nameText").value)
      document.getElementById("p2name").textContent = p2.getName()
      document.getElementById("p2nameForm").style.display = "none"
      p2Edit.style.display = "inline-block"
    })
  })
})();