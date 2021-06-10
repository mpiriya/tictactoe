//Player Factory
const Player = (name, token, AI) => {
  const getName = () => name;
  const setName = (newname) => name = newname;
  const getToken = () => token;
  const isAI = () => AI;
  const setisAI = (newisAI) => AI = newisAI;

  return {getName, setName, getToken, isAI, setisAI}
};

const p1 = Player("Player 1", "X", false);
const p2 = Player("Player 2", "O", true);

//game board module
const gameBoard = (() => {
  let board = [[' ', ' ', ' '], 
               [' ', ' ', ' '],
               [' ', ' ', ' ']];
  let currentPlayer = p1;
  let nextPlayer = p2;
  let winner = null;
  let gameOver = false;

  const isGameOver = () => gameOver;
  const getWinner = () => winner;
  const getBoard = () => board;

  const initGame = () => {
    board = [[' ', ' ', ' '], 
             [' ', ' ', ' '],
             [' ', ' ', ' ']];
    currentPlayer = p1
    nextPlayer = p2
    winner = null
    gameOver = false
    if(currentPlayer.isAI()) {
      AIMove()
    }
  }

  const placeToken = (row, col, token) => {
    if(board[row][col] != ' ') {
      return false
    }
    board[row][col] = token;
    return true
  }

  const playerMove = (row, col) => {
    if(gameOver) {
      return null
    }
    if(!placeToken(row, col, currentPlayer.getToken())) {
      //do not switch player, and just do nothing
      return null
    }

    //checks if the move was a winning move
    if(checkWin(currentPlayer)) {
      //if so, set gameOver to true and 
      gameOver = true
      return winner
    }

    //check tie
    if(checkTie()) {
      gameOver = true
    }

    //if not gameOver and current is AI, then do AIMove, return currentPlayer
    if(!gameOver && nextPlayer.isAI()) {
      AIMove(currentPlayer, nextPlayer)
      if(checkWin(nextPlayer)) {
        gameOver = true
      }
      return currentPlayer
    }

    //otherwise, swap the two players so that the next player chooses the next square
    let temp = currentPlayer;
    currentPlayer = nextPlayer;
    nextPlayer = temp;


    return nextPlayer //returns player who made last move
  }

  const checkWin = (player) => {
    for(let i = 0; i < 3; i++) { //check rows
      if(board[i].every(element => element == player.getToken())) {
        gameOver = true;
        winner = player;
        return winner
      }
    }

    for(let i = 0; i < 3; i++) { //check columns
      let subarray = [board[0][i], board[1][i], board[2][i]];
      if(subarray.every(element => element == player.getToken())) {
        gameOver = true;
        winner = player;
        return winner
      }
    }

    //check diags
    let subarray = [board[0][0], board[1][1], board[2][2]];
    if(subarray.every(element => element == player.getToken())) {
      gameOver = true;
      winner = player;
      return winner
    }
    subarray = [board[0][2], board[1][1], board[2][0]];
    if(subarray.every(element => element == player.getToken())) {
      gameOver = true;
      winner = player;
      return winner
    }

    return null
  }

  const checkTie = () => {
    for(let i = 0; i < board.length; i++) {
      for(let j = 0; j < board[i].length; j++) {
        if(board[i][j] == " ")
          return false
      }
    }
    return checkWin(currentPlayer) == null && checkWin(nextPlayer) == null
  }

  const AIMove = (human, ai) => {
    //do the minimax thing
    let maxScore = -1;
    let bestMove = {row: -1, col: -1}
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        if(placeToken(i, j, ai.getToken())) {
          let score = minimax(human, ai, human)
          getBoard()[i][j] = " "
          if(score > maxScore) {
            maxScore = score
            bestMove = {row: i, col: j}
          }
        }
      }
    }
    //place token
    placeToken(bestMove.row, bestMove.col, ai.getToken())
    //otherwise, function is done :)
  }

  const minimax = (human, ai, next) => {
    if(checkWin(ai)) { //if in simulated move scenario, winner is AI
      gameOver = false
      winner = null
      return 1
    } else if(checkWin(human)) { //if in simulated move scenario, winner is Person
      gameOver = false
      winner = null
      return -1
    } else if(checkTie()) {
      gameOver = false
      winner = null
      return 0
    }

    if(next == ai) {
      //otherwise, explore next level of depth for currentPlayer
      let maxScore = -1;
      for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
          if(placeToken(i, j, next.getToken())) {
            let score = minimax(human, ai, human)
            getBoard()[i][j] = " "
            if(score > maxScore) {
              maxScore = score
            }
          }
        }
      }
      return maxScore
    } else { //assuming nextPlayer (human) plays optimally
      let minScore = 1;
      for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
          if(placeToken(i, j, next.getToken())) {
            let score = minimax(human, ai, ai)
            getBoard()[i][j] = " "
            if(score < minScore) {
              minScore = score
            }
          }
        }
      }

      return minScore
    }
  }

  const printBoard = () => console.log(board[0].join(" ") + "\n" + board[1].join(" ") + "\n" + board[2].join(" "));

  const restart = () => {
    board = [[' ', ' ', ' '], 
             [' ', ' ', ' '],
             [' ', ' ', ' ']];
    currentPlayer = p1;
    nextPlayer = p2;
    winner = null
    gameOver = false;
  }
  
  // only give getBoard so that end user can't manually edit board and cheat
  return {getBoard, isGameOver, getWinner, playerMove, printBoard, restart}
})();

//display controller module
const displayController = (() => {
  const board = gameBoard;
  const table = document.getElementById("board")

  const initBoard = () => {
    //graphics logic for dictating turn, winner, tie
    for(let i = 0; i < 3; i++) {
      // 3 rows
      const tr = document.createElement("tr")
      for(let j = 0; j < 3; j++) {
        // 3 columns
        const td = document.createElement("td")
        //initialize board values
        td.textContent = board.getBoard()[i][j]
        td.addEventListener("click", () => {
          const next = board.playerMove(i, j)
          if(next != null) { //player made a valid move
            //update the td's textContent to reflect gameBoard
            table.childNodes.forEach((row, r)=>row.childNodes.forEach((cell, c) => cell.textContent = gameBoard.getBoard()[r][c]))
            if(board.getWinner()) {
              if(board.getWinner() == p1) {
                document.getElementById("p1").setAttribute("winner", "true")
              } else {
                document.getElementById("p2").setAttribute("winner", "true")
              }
            } else if(board.getWinner() == null && board.isGameOver()) {
              document.getElementById("p1").setAttribute("winner", "neither")
              document.getElementById("p2").setAttribute("winner", "neither")
            } else {
              if(next == p1 && !p2.isAI()) {
                //swap the values of "data-my-turn"
                document.getElementById("p1").setAttribute("data-my-turn", "false")
                document.getElementById("p2").setAttribute("data-my-turn", "true")
              } else if(next == p2 && !p1.isAI()) { //move = p2
                document.getElementById("p1").setAttribute("data-my-turn", "true")
                document.getElementById("p2").setAttribute("data-my-turn", "false")
              }
            }
          }
          
        })
        tr.appendChild(td)
      }
      table.appendChild(tr)
    }
  }

  const initNameButtons = () => {
    //handling when "Edit Name" buttons are pressed
    const p1Edit = document.getElementById("p1nameEdit")
    p1Edit.addEventListener("click", () => {
      //hide edit button
      p1Edit.style.display = "none"
      //show input field, input submit button
      document.getElementById("p1nameForm").style.display = "block"
      document.getElementById("p1nameSubmit").addEventListener("click", () => {
        p1.setName(document.getElementById("p1nameText").value)
        document.getElementById("p1name").textContent = p1.getName() + ": " + p1.getToken()
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
        document.getElementById("p2name").textContent = p2.getName() + ": " + p2.getToken()
        document.getElementById("p2nameForm").style.display = "none"
        p2Edit.style.display = "inline-block"
      })
    })
  }

  const initRestartButton = () => {
    document.getElementById("restart").addEventListener("click", () => {
      displayController.restart()
      table.childNodes.forEach(row => row.childNodes.forEach(cell => cell.textContent = ' '))
  
      document.getElementById("p1").setAttribute("data-my-turn", "true")
      document.getElementById("p2").setAttribute("data-my-turn", "false")
  
      document.getElementById("p1").setAttribute("winner", "false")
      document.getElementById("p2").setAttribute("winner", "false")
    })
  }

  /* only make available what's really necessary: 
      allowing the next player to make a move at a certain space and
      letting the user know whether the game is over or not
  */
  return {isGameOver, getWinner, playerMove, restart}
})();

