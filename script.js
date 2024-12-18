let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImage;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // context.fillStyle = "green";
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);

  birdImage = new Image();
  birdImage.src = "images/flappybird.png";
  birdImage.onload = function () {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "images/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "images/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
  document.addEventListener("click", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); // doesnt let you jump outside the bounds of the canvas--limits you to the top of the canvas

  context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; // set to 0.5 since the bird passes through a set of two pipes and counts the score as 2
      pipe.passed = true;
    }
    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //clear pipes

  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    document.getElementById("myModal").style.display = "block";
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (
    e.code == "Space" ||
    e.code == "ArrowUp" ||
    e.code == "KeyX" ||
    e.type == "click"
  ) {
    velocityY = -6;
  }

  // if (gameOver) {
  //     bird.y = birdY;
  //     pipeArray = [];
  //     score = 0;
  //     gameOver = false;
  // }
}


function resetGame() {
    document.getElementById("myModal").style.display = "none";
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
    document.addEventListener("keydown", moveBird);
    document.addEventListener("click", moveBird);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function darkMode() {
    const board = document.getElementById("board");
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const body = document.querySelector("body");
    const modalContent = document.querySelector(".modal-content");
    const buttonSix = document.querySelector("button-16");

    board.classList.toggle("dark-mode");
    header.classList.toggle("dark-mode");
    footer.classList.toggle("dark-mode");
    body.classList.toggle("dark-mode");
    modalContent.classList.toggle("dark-mode");
    buttonSix.style.backgroundColor = "black";
}

// prevent scrolling when spacebar is clicked or clicked on the screen
window.addEventListener("keydown", function (e) {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});
