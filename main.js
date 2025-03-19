const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  start2 = document.querySelector('.start2'),
  start3 = document.querySelector('.start3'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div');
car.classList.add('car');

start2.style.top = start.offsetHeight;
start3.style.top = start2.offsetHeight + start.offsetHeight;

// Вызов getRequest() при загрузке страницы
window.addEventListener('load', () => {
  getRequest();
});

start.addEventListener('click', startGame);
start2.addEventListener('click', startGame, (speed = 8));
start3.addEventListener('click', startGame, (speed = 10));
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

/*save score*/
function saveScore() {
  let savedScore = setting.score;
  localStorage.setItem('Score', JSON.stringify(savedScore));
  savedScore = JSON.parse(localStorage.getItem('Score'));
}

function playAudio() {
  let audio = new Audio(); // Создаём новый элемент Audio
  audio.src = 'sound.mp3'; // Указываем путь к звуку "клика"
  audio.autoplay = true; // Автоматически запускаем
}

//added for testing purposes
function getRequest() {
  fetch('https://gsddsfsdfdsf.com/spec.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Ошибка:', error));
}

/*Start Game */
function startGame() {
  console.log(speed);
  start.classList.add('hide');
  start2.classList.add('hide');
  start3.classList.add('hide');
  gameArea.innerHTML = '';
  playAudio();
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
  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = `Score<br>` + setting.score;
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
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      setting.start = false;
      console.warn('DTP');
      start.classList.remove('hide');
      start2.classList.remove('hide');
      start3.classList.remove('hide');
      start.style.top = score.offsetHeight;
      start2.style.top = score.offsetHeight + start.offsetHeight;
      start3.style.top =
        start2.offsetHeight + start.offsetHeight + score.offsetHeight;
      if (localStorage.getItem('Score') < setting.score) {
        alert('Позрадвляю! Вы побили рекорд.');
        saveScore();
      } else {
        saveScore();
      }
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -300 * setting.traffic;
      item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}
