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
  const restart = () => {
    board = [[' ', ' ', ' '], 
               [' ', ' ', ' '],
               [' ', ' ', ' ']];
    moveCount = 0;
  }
  
  // only give getBoard so that end user can't manually edit board and cheat
  return {getBoard, getMoveCount, placeToken, restart}
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
      return null
    }

    for(let i = 0; i < 3; i++) { //check rows
      if(board.getBoard()[i].every(element => element == currentPlayer.getToken())) {
        gameOver = true;
        winner = currentPlayer;
        return winner
      }
    }

    for(let i = 0; i < 3; i++) { //check columns
      let subarray = [board.getBoard()[0][i], board.getBoard()[1][i], board.getBoard()[2][i]];
      if(subarray.every(element => element == currentPlayer.getToken())) {
        gameOver = true;
        winner = currentPlayer;
        return winner
      }
    }

    //check diags
    let subarray = [board.getBoard()[0][0], board.getBoard()[1][1], board.getBoard()[2][2]];
    if(subarray.every(element => element == currentPlayer.getToken())) {
      gameOver = true;
      winner = currentPlayer;
      return winner
    }
    subarray = [board.getBoard()[0][2], board.getBoard()[1][1], board.getBoard()[2][0]];
    if(subarray.every(element => element == currentPlayer.getToken())) {
      gameOver = true;
      winner = currentPlayer;
      return winner
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

    return nextPlayer //returns player who made last move
  }

  const restart = () => {
    board.restart()
    currentPlayer = p1;
    nextPlayer = p2;
    winner = null
    gameOver = false;
  }

  /* only make available what's really necessary: 
      allowing the next player to make a move at a certain space and
      letting the user know whether the game is over or not
  */
  return {isGameOver, getWinner, playerMove, restart}
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
          const move = displayController.playerMove(i, j)
          if(move) { //player made a valid move
            //update the td's textContent to reflect gameBoard
            td.textContent = gameBoard.getBoard()[i][j]
            if(displayController.getWinner()) {
              if(move == p1) {
                document.getElementById("p1").setAttribute("winner", "true")
              } else {
                document.getElementById("p2").setAttribute("winner", "true")
              }
            }else {
              if(move == p1) {
                //swap the values of "data-my-turn"
                document.getElementById("p1").setAttribute("data-my-turn", "false")
                document.getElementById("p2").setAttribute("data-my-turn", "true")
              } else { //move = p2
                document.getElementById("p1").setAttribute("data-my-turn", "true")
                document.getElementById("p2").setAttribute("data-my-turn", "false")
              }
            }
          }
        } else {
        }
      })
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }

  //change name handling stuffs
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

  document.getElementById("restart").addEventListener("click", () => {
    displayController.restart()
    table.childNodes.forEach(row => row.childNodes.forEach(cell => cell.textContent = ' '))

    document.getElementById("p1").setAttribute("data-my-turn", "true")
    document.getElementById("p2").setAttribute("data-my-turn", "false")

    document.getElementById("p1").setAttribute("winner", "false")
    document.getElementById("p2").setAttribute("winner", "false")
  })
})();