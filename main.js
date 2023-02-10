let origBoard;
let optionJugador ='O';
let optionPc = 'X';
const codigos =[
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

const celda = document.querySelectorAll('.cell');
inicio();

function selecionarOption(sym){
  optionJugador = sym;
  optionPc = sym==='O' ? 'X' :'O';
  document.querySelector('.replay').style.display = "block";
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < celda.length; i++) {
    celda[i].addEventListener('click', turnClick, false);
  }
  if (optionPc === 'X') {
    turn(bestSpot(),optionPc);
  }
  document.querySelector('.selecionarOption').style.display = "none";
}
function inicio() {
  document.querySelector('.finJuego').style.display = "none";
  document.querySelector('.replay').style.display = "none";
  document.querySelector('.finJuego .text').innerText ="";
  document.querySelector('.selecionarOption').style.display = "block";
  for (let i = 0; i < celda.length; i++) {
    celda[i].innerText = '';
    celda[i].style.removeProperty('background-color');
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] ==='number') {
    turn(square.target.id, optionJugador);
    if (!checkWin(origBoard, optionJugador) && !checkarEmpate())  
      turn(bestSpot(), optionPc);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) finalJuego(gameWon);
  checkarEmpate();
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of codigos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function finalJuego(gameWon){
  for (let index of codigos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = 
      gameWon.player === optionJugador ? "blue" : "red";
  }
  for (let i=0; i < celda.length; i++) {
    celda[i].removeEventListener('click', turnClick, false);
  }
  declararGanador(gameWon.player === optionJugador ? "Ganaste!" : "Perdiste");
}

function declararGanador(who) {
  document.querySelector(".finJuego").style.display = "block";
  document.querySelector(".finJuego .text").innerText = who;
}
function emptySquares() {
  return origBoard.filter((elm, i) => i===elm);
}
  
function bestSpot(){
  return minimax(origBoard, optionPc).index;
}
  
function checkarEmpate() {
  if (emptySquares().length === 0){
    for (cell of celda) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener('click',turnClick, false);
    }
    declararGanador("Empate");
    return true;
  } 
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);
  
  if (checkWin(newBoard, optionJugador)) {
    return {score: -10};
  } else if (checkWin(newBoard, optionPc)) {
    return {score: 10};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  
  var moves = [];
  for (let i = 0; i < availSpots.length; i ++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    
    if (player === optionPc)
      move.score = minimax(newBoard, optionJugador).score;
    else
       move.score =  minimax(newBoard, optionPc).score;
    newBoard[availSpots[i]] = move.index;
    if ((player === optionPc && move.score === 10) || (player === optionJugador && move.score === -10))
      return move;
    else 
      moves.push(move);
  }
  
  let bestMove, bestScore;
  if (player === optionPc) {
    bestScore = -1000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
      bestScore = 1000;
      for(let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  
  return moves[bestMove];
}