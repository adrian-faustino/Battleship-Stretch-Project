//DOM cache
const board_div = document.querySelector('.board');
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
  }
});

//infomration needed to draw board;=====//
const tileSize = 25;                    //
const maxRows = 20;                     //
const maxColumns = maxRows;             //
const board_coord = [];                 //
//======================================//

//game state============================//
let isOn = false;                       //
let setMode = false;                    //
let coordObject;                        //
let currentCoord;
let occupied = {};
//======================================//


//generate board
const generateBoard = function() {
  const boardHeight = tileSize * maxColumns;
  const boardWidth = tileSize * maxRows;
  board_div.style.cssText = `height: ${boardHeight + 'px'}; width: ${boardWidth + 'px'};`;
  
  for (let row = 0; row < maxRows; row++) {
    board_coord[row] = [];
    for (let column = 0; column < maxColumns; column++) {
      board_coord[row][column] = document.createElement('div');
      board_coord[row][column].classList.add('tile');
      board_div.appendChild(board_coord[row][column]);
      
      board_coord[row][column].style.setProperty('--tileSize', tileSize + 'px');
      board_coord[row][column].style.left = (tileSize * column) + 'px';
      board_coord[row][column].style.top = (tileSize * row) + 'px';
    }
  }
};

const addEventListeners = function() {
  for (let row = 0; row < maxRows; row++) {
    for (let column = 0; column < maxColumns; column++) {
      let currentDiv = board_coord[row][column];
      currentDiv.addEventListener('click', () => {
        console.log('set mode', setMode);
        console.log('isOn', isOn);
        //set mode
        if (setMode) {
          setActive(currentDiv, logCoord(row, column));
        }

        if (!setMode && isOn) {
          checkTile(currentDiv, logCoord(row, column));
        }

        // currentDiv.classList.toggle('active');
        console.log(logCoord(row, column));
        currentCoord = logCoord(row, column);
      });
    }
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
  generateBoard();
  addEventListeners();
  // coordObject = generateKeyValPair(maxRows);
};

const toKey = function(arr) {
  return arr[0] + arr[1];
};

const checkTile = function(div, arr) {
  const currentKey = toKey(arr);
  if (occupied[currentKey] === 1) {
    console.log('hit!');
    div.classList.add('hit');
  }

};