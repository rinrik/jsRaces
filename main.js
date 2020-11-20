const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div');
car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
/*Keys*/
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArroRight: false,
  ArrowLeft: false,
};
/*Setting */
const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 2,
  random: 0,
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

/*Start Game */
function startGame() {
  start.classList.add('hide');
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = i * 100 + 'px';
    line.y = i * 95;
    gameArea.appendChild(line);
  }
  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    if (Math.random() >= 0.5) {
      enemy.classList.add('enemy');
    } else {
      enemy.classList.add('enemy2');
    }

    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    gameArea.appendChild(enemy);
  }
  setting.start = true;
  gameArea.appendChild(car);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    requestAnimationFrame(moveRoad);
    moveEnemy();
    moveRoad();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed / 2;
    }
    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {
      setting.x += setting.speed / 2;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed - 1;
    }
    if (
      keys.ArrowDown &&
      setting.y < gameArea.offsetHeight - car.offsetHeight
    ) {
      setting.y += setting.speed;
    }
    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    requestAnimationFrame(playGame);
  }
}
/*Start Run */
function startRun(event) {
  event.preventDefault();
  keys[event.key] = true;
  console.log(event.key);
}
/*Stop Run */
function stopRun(event) {
  event.preventDefault();
  keys[event.key] = false;
}

/*Road Move */
function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function (line) {
    line.y += setting.speed - 2;
    line.style.top = line.y + 'px';
    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

/*Move enemy*/
function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy , .enemy2');
  enemy.forEach(function (item) {
    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -300 * setting.traffic;
      item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}
