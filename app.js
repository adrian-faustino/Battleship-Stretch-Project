//DOM cache
const boardPlayer1_div = document.querySelector('.board.player1');
const boardPlayer2_div = document.querySelector('.board.player2');
const start_div = document.querySelector('.start-game');
const gameStatus_span = document.getElementById('start-game-span');


start_div.addEventListener('click', () => {
  //sandbox below
  randomHorizontalBoat(5);

  //sandbox above
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
const maxRows = 10;                     //
const maxColumns = maxRows;             //
const PLAYER1_BOARD = [];               //
const PLAYER2_BOARD = [];               //
//======================================//

//game state============================//
let isOn = false;                       //
let setMode = false;                    //
let coordObject;                        //
let currentCoord;                       //
let occupied = {};                      //
let turn = 'player';                    //
//======================================//

//opponent board========================// feed an array
const AIships = {
  a1: 1,
  a2: 1,
  a3: 1,
  a4: 1,
  e5: 1,
  f5: 1,
  g5: 1,
  h5: 1,
  d1: 1,
  d2: 1,
  d3: 1,
  d4: 1,
  b8: 1,
  c8: 1,
  d8: 1,
  e8: 1,
  f8: 1
};

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
          if (checkTile2(AIships, toKey(logCoord(row, column)))) {
            console.log('Player hit!');
            hit(currentDiv);
          } else {
            console.log('Player missed!');
            miss(currentDiv);
          }

          //ai turn
          toggleClickableBoard();
          setTimeout(() => {
            aiTurn();
            toggleClickableBoard();
          }, 2000);
        }
        // console.log('AI ATTACK! : ', generateAIattack());
        // currentDiv.classList.toggle('active');
        // console.log(logCoord(row, column));
        currentCoord = logCoord(row, column);
      });
    }
  }
};

//takes an array and returns a single number
const calcDivIndex = function(arr) {
  const row = arr[0];
  const column = arr[1];

  return (row * maxRows) + column;
};

const hitIndex = function(num) {
  const PLAYER_DIVS = document.querySelectorAll('.board.player1 > .tile');
  const currentDiv = PLAYER_DIVS[num];
  if (currentDiv !== undefined) {
    console.log('recoloring hit...');
    currentDiv.classList.remove('hidden');
    currentDiv.classList.add('hit');
  }
};

const missIndex = function(num) {
  const PLAYER_DIVS = document.querySelectorAll('.board.player1 > .tile');
  const currentDiv = PLAYER_DIVS[num];
  if (currentDiv !== undefined) {
    console.log('recoloring miss...');
    currentDiv.classList.add('miss');
  }
}

const aiTurn = function() {
  const newAttack = generateAIattack();
  const aiAttack = newAttack.coord.join('');
  console.log(`AI attack: ` + aiAttack);
  
  const currentIndex = calcDivIndex([newAttack.row, newAttack.column]);
  if (checkTile2(occupied, aiAttack)) {
    console.log('AI hit!');
    hitIndex(currentIndex);
  } else {
    console.log('AI missed!');
    missIndex(currentIndex);
  }
};

//returns {}
const generateAIattack = function() {
  const result = {
    row: 0 ,
    column: 0,
    coord: []
  };
  const LETTER_ARRAY = generateLetters(maxRows);
  const randomRow = randomNumber(0, LETTER_ARRAY.length - 1);
  const randomLetter = LETTER_ARRAY[randomRow];
  const randomColumn = randomNumber(0, LETTER_ARRAY.length - 1);

  result.row = randomRow;
  result.column = randomColumn;
  result.coord = [randomLetter, randomColumn + 1]; // +1 ??
  
  return result;
};

const toggleClickableBoard = function() {
  const board_divs = document.getElementsByClassName('board');
  for (let div of board_divs) {
    div.classList.toggle('unclickable');
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

//returns div co-ordinate [letter, num], CONVERTS it to [a, 1]...
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

//turns tiles green in set mode, sets occupied {} with 1s
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
//recieves obj and key, checks if 1 or 0;
const checkTile2 = function(occupiedObjArr, key) {
  if (occupiedObjArr[key] === 1) {
    return true;
  } else {
    return false;
  }
};

const hit = function(div) {
  div.classList.remove('hidden');
  div.classList.add('hit');
};

const miss = function(div) {
  div.classList.add('miss');
}

//====  GENERATE AI BOATS  ============================
//recieves 'num' which will be the length of the boat, and returns an array with coord? [row, column]
const randomHorizontalBoat = function(num, obj) {
  const randomLetter = generateLetters(maxRows)[randomNumber(0, maxRows - 1)];
  const startingColumn = randomNumber(1, maxRows);
  
  let boatLength = num;
  let currentColumn = startingColumn + boatLength;
  const result = [];
  while (boatLength > 0) {
    result.push([randomLetter, currentColumn]);
    currentColumn--;
    boatLength--;
  }
  // console.log(result);
};

const randomVerticalBoat = function(num, ob) {
  
};

const randomBoat = function(num) {

};
//=====================================================

//helper functions
function randomNumber(min, max) { //inclusive
  return Math.floor(Math.random() * ((max + 1) - min)) + min;
}