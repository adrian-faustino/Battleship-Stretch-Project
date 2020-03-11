//DOM cache
const boardPlayer1_div = document.querySelector('.board.player1');
const boardPlayer2_div = document.querySelector('.board.player2');
const start_div = document.querySelector('.start-game');
const gameStatus_span = document.getElementById('start-game-span');

start_div.addEventListener('click', () => {
  if (!isOn && !setMode) {
    init();
    isOn = true;
    setMode = true;
    gameStatus_span.innerHTML = 'Set Ships';
  } else if (isOn && setMode) {
    setMode = false;
    gameStatus_span.innerHTML = 'Start!';
    hideBoard();
    addEventListeners(PLAYER2_BOARD);
  }
});

//infomration needed to draw board;=====//
const tileSize = 35;                    //
const maxRows = 15;                     //
const maxColumns = maxRows;             //
const PLAYER1_BOARD = [];               //
const PLAYER2_BOARD = [];
//======================================//

//game state============================//
let isOn = false;                       //
let setMode = false;                    //
let coordObject;                        //
let currentCoord;                       //
let occupied = {};                      //
let turn = 'player';
//======================================//

//opponent board========================// feed an array
const AIships = [{
  a1: 1,
  b1: 1,
  c1: 1,
  d1: 1
}, {
  a2: 1,
  b2: 1,
  c2: 1
}, {
  a3: 1,
  a4: 1,
  a5: 1
}];

//generate board
const generateBoard = function(parent, arr) {
  const boardHeight = tileSize * maxColumns;
  const boardWidth = tileSize * maxRows;
  parent.style.cssText = `height: ${boardHeight + 'px'}; width: ${boardWidth + 'px'};`;
  
  for (let row = 0; row < maxRows; row++) {
    arr[row] = [];
    for (let column = 0; column < maxColumns; column++) {
      arr[row][column] = document.createElement('div');
      arr[row][column].classList.add('tile');
      parent.appendChild(arr[row][column]);
      
      arr[row][column].style.setProperty('--tileSize', tileSize + 'px');
      arr[row][column].style.left = (tileSize * column) + 'px';
      arr[row][column].style.top = (tileSize * row) + 'px';
    }
  }
};

const addEventListeners = function(arr) {
  for (let row = 0; row < maxRows; row++) {
    for (let column = 0; column < maxColumns; column++) {
      let currentDiv = arr[row][column];
      currentDiv.addEventListener('click', () => {
        // console.log('set mode', setMode);
        // console.log('isOn', isOn);

        //set mode
        if (setMode) {
          setActive(currentDiv, logCoord(row, column));
        }
        
        //game mode
        if (!setMode && isOn) {
          // checkTile(currentDiv, logCoord(row, column)); // uncomment for ai -> player turn
          const check = checkTile2(AIships, toKey(logCoord(row, column)));
          if (check) {
            hit(currentDiv);
          }
        }
        // currentDiv.classList.toggle('active');
        // console.log(logCoord(row, column));
        currentCoord = logCoord(row, column);
      });
    }
  }
};

const hideBoard = function() {
  const activeTiles = document.getElementsByClassName('active');
  console.log(activeTiles, '--> Active tiles');
  for (let div of activeTiles) {
    div.classList.add('hidden');
  }
};

//function returns obj array with co-ordinates
const resetBoard = function() {

};

//returns alphabet array based on row
const generateLetters = function(rows) {
  if (rows > 26) {
    return console.log('Letter over Z');
  }
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const ALPHABET_LIST = [];
  for (let i = 0; i < rows; i++) {
    ALPHABET_LIST.push(alphabet[i]);
  }
  return ALPHABET_LIST;
};

//returns div co-ordinate [letter, num]
const logCoord = function(row, column) {
  const LETTER_LIST = generateLetters(maxRows);
  const rowLetter = LETTER_LIST[row];
  
  return [rowLetter, column + 1];
};

//create Object  with key value coordinate {}
//should only generate this once, once "START GAME" button is clicked
const generateKeyValPair = function(rows) {
  const result = {};
  const LETTER_LIST = generateLetters(rows);
  for (let i = 0; i < rows; i++) {
    const currentKey = LETTER_LIST[i] + (i + 1);
    result[currentKey] = 0;
  }
  return result;
};

//turns tiles green in set mode
const setActive = function(div, arr) {
  console.log('set active!');
  div.classList.add('active');
  occupied[toKey(arr)] = 1;
  console.log(occupied);
};

const init = function() {
  generateBoard(boardPlayer1_div, PLAYER1_BOARD);
  generateBoard(boardPlayer2_div, PLAYER2_BOARD);
  addEventListeners(PLAYER1_BOARD);
  // addEventListeners(PLAYER2_BOARD);
  // coordObject = generateKeyValPair(maxRows);
};

const toKey = function(arr) {
  return arr[0] + arr[1];
};

const checkTile = function(div, arr) {
  console.log('...checking tile');
  const currentKey = toKey(arr);
  if (occupied[currentKey] === 1) {
    console.log('hit!');
    div.classList.remove('hidden');
    div.classList.add('hit');
  }
};


//if HIT
const checkTile2 = function(occupiedObjArr, key) {
  for (let obj of occupiedObjArr) {
    if (obj[key] === 1) {
      console.log(key)
      console.log('HIT!!!');
      return true;
    }
  }
  return false;
};

const hit = function(div) {
  div.classList.remove('hidden');
  div.classList.add('hit');
};


//helper functions
function randomNumber(min, max) { //inclusive
  return Math.floor(Math.random() * ((max + 1) - min)) + min;
}
