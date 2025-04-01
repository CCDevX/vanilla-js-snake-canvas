import "./index.scss";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let gridElem;
let speed = 800;
let direction;
let snake;
let apple;
let score = 0;
let running = false;
let applePulse = 0;

const drawMap = () => {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width
  );
  gradient.addColorStop(0, "#333");
  gradient.addColorStop(1, "#000");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawSnake = () => {
  for (let i = 0; i < snake.length; i++) {
    const [x, y] = snake[i];

    // Use a brighter color for the snake's head
    ctx.fillStyle = i === 0 ? "#A8FF60" : "#4CAF50";

    // Draw a rounded rectangle for each snake segment
    ctx.beginPath();
    ctx.roundRect(
      x * gridElem + 1,
      y * gridElem + 1,
      gridElem - 2,
      gridElem - 2,
      6 // corner radius
    );
    ctx.shadowColor = "rgba(0, 255, 0, 0.4)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fill();

    // Add eyes to the snake's head
    if (i === 0) {
      ctx.fillStyle = "white";
      const eyeRadius = 2;

      // Left eye
      ctx.beginPath();
      ctx.arc(
        x * gridElem + gridElem / 3,
        y * gridElem + gridElem / 3,
        eyeRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Right eye
      ctx.beginPath();
      ctx.arc(
        x * gridElem + (gridElem * 2) / 3,
        y * gridElem + gridElem / 3,
        eyeRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowColor = "transparent";
    }
  }
};

const drawApple = () => {
  const [x, y] = apple;
  const pulse = Math.sin(applePulse) * 2; // effet d’ondulation

  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.shadowColor = "rgba(255, 0, 0, 0.6)"; // ombre verte subtile
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.arc(
    x * gridElem + gridElem / 2,
    y * gridElem + gridElem / 2,
    (gridElem - 6) / 2 + pulse,
    0,
    Math.PI * 2
  );
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Draw small green leaf
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(
    x * gridElem + gridElem / 2,
    y * gridElem + gridElem / 2 - 6,
    3,
    0,
    Math.PI * 3
  );
  ctx.fill();

  // Animate pulse
  applePulse += 0.1;
};

window.addEventListener("resize", () => {
  resizeGame();
});

window.addEventListener("click", () => {
  if (!running) {
    running = true;
    requestAnimationFrame(move);
  }
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight": {
      if (direction !== "o") direction = "e";
      break;
    }
    case "ArrowLeft": {
      if (direction !== "e") direction = "o";
      break;
    }
    case "ArrowUp": {
      if (direction !== "s") direction = "n";
      break;
    }
    case "ArrowDown": {
      if (direction !== "n") direction = "s";
      break;
    }
    default: {
    }
  }
});

const gameover = () => {
  if (
    snake[0][0] > canvas.width / gridElem - 1 ||
    snake[0][0] < 0 ||
    snake[0][1] > canvas.height / gridElem - 1 ||
    snake[0][1] < 0
  ) {
    return true;
  } else {
    const [head, ...body] = snake;
    for (let bodyElem of body) {
      if (bodyElem[0] === head[0] && bodyElem[1] === head[1]) {
        return true;
      }
    }
  }
  return false;
};

const generateApple = () => {
  const [x, y] = [
    Math.trunc(Math.random() * (canvas.width / gridElem)),
    Math.trunc(Math.random() * (canvas.height / gridElem)),
  ];

  for (let body of snake) {
    if (body[0] === x && body[1] === y) {
      return generateApple();
    }
  }
  apple = [x, y];
};

const generateSnake = () => {
  const maxX = canvas.width / gridElem - 5;
  const minX = 3;
  const maxY = canvas.height / gridElem - 5;
  const minY = 5;
  const head = [
    Math.floor(Math.random() * (maxX - minX)) + minX,
    Math.floor(Math.random() * (maxY - minY)) + minY,
  ];
  snake.push(head, [head[0] - 1, head[1]], [head[0] - 2, head[1]]);
  direction = ["e", "n", "s"][Math.trunc(Math.random() * 3)];
};

const updateSnakePosition = () => {
  let head;
  switch (direction) {
    case "e": {
      head = [snake[0][0] + 1, snake[0][1]];
      break;
    }
    case "o": {
      head = [snake[0][0] - 1, snake[0][1]];
      break;
    }
    case "n": {
      head = [snake[0][0], snake[0][1] - 1];
      break;
    }
    case "s": {
      head = [snake[0][0], snake[0][1] + 1];
      break;
    }
    default: {
    }
  }
  snake.unshift(head);
  if (head[0] === apple[0] && head[1] === apple[1]) {
    score++;
    if (speed <= 920) speed += 5;
    generateApple();
  } else {
    snake.pop();
  }
  return gameover();
};

const drawScore = () => {
  ctx.fillStyle = "white";
  ctx.font = "40px sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(score, gridElem, gridElem);
};

const move = () => {
  if (!updateSnakePosition()) {
    drawMap();
    drawSnake();
    drawApple();
    drawScore();
    setTimeout(() => {
      requestAnimationFrame(move);
    }, 1000 - speed);
  } else {
    alert(`Perdu, votre score est ${score}`);
    running = false;
    start();
  }
};

const start = () => {
  score = 0;
  speed = 800;
  snake = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "40px sans-serif";
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(
    "Cliquez sur l'écran pour démarrer la partie",
    canvas.width / 2,
    canvas.height / 2
  );
  generateApple();
  generateSnake();
};

const resizeGame = () => {
  if (window.innerWidth < 576) {
    gridElem = 20;
  } else if (window.innerWidth < 768) {
    gridElem = 25;
  } else if (window.innerWidth < 992) {
    gridElem = 30;
  } else if (window.innerWidth < 992) {
    gridElem = 35;
  } else if (window.innerWidth < 1200) {
    gridElem = 40;
  } else if (window.innerWidth >= 1200) {
    gridElem = 45;
  }
  canvas.width = Math.floor((window.innerWidth - 2) / gridElem) * gridElem;
  canvas.height = Math.floor((window.innerHeight - 2) / gridElem) * gridElem;
  start();
};
resizeGame();
