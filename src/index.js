import "./index.scss";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const gridElem = 40; // grid 20 * 20
const snake = [
  [9, 9],
  [8, 9],
  [7, 9],
];

const apple = [5, 5];

const drawMap = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 800);
};

const drawSnake = () => {
  ctx.fillStyle = "green";
  for (let body of snake) {
    ctx.fillRect(body[0] * gridElem, body[1] * gridElem, gridElem, gridElem);
  }
};

const drawApple = () => {
  ctx.fillStyle = "red";
  ctx.fillRect(apple[0] * gridElem, apple[1] * gridElem, gridElem, gridElem);
};

drawMap();
drawSnake();
drawApple();

const move = () => {
  //Do something ...
  requestAnimationFrame(move);
};

requestAnimationFrame(move);
