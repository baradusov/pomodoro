// Таймер
const buttonStart = document.querySelector('.start');
const audio = document.querySelector('audio');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
let minutesValue = Number(minutes.textContent ) * 60;
let secondsValue = Number(seconds.textContent);
let timer = minutesValue + secondsValue;
let isRunning = false;
let countdown;
let pausedTime;

// Таймер
const pomodoro = (customSeconds) => {
  isRunning = true;
 
  const start = Date.now();
  
  // clearInterval(countdown);
  countdown = setInterval(() => {
    const secondsPassed = Math.floor((Date.now() - start) / 1000);
    const secondsLeft = customSeconds - secondsPassed;
    const remainderSeconds = secondsLeft % 60;
    const minutesLeft = Math.floor(secondsLeft / 60);
    minutes.textContent = `${minutesLeft}`;
    seconds.textContent = `${remainderSeconds < 10 ? 0 : ''}${remainderSeconds}`;
    
    if (secondsLeft < 0) {
      clearInterval(countdown);
      minutes.textContent = minutesValue;
      seconds.textContent = secondsValue;
      document.title = '0:00';
      audio.play();
    }
  }, 1000);
};

minutes.addEventListener('input', () => {
  minutesValue = minutes.textContent;
});

seconds.addEventListener('input', () => {
  secondsValue = seconds.textContent;
});


// Пауза, сброс и продолжение таймера
const startTimer = () => {
  const remainingTime = (Number(minutes.textContent ) * 60) + Number(seconds.textContent);
  pomodoro(remainingTime);
}

const pauseTimer = () => {
  clearInterval(countdown);
  isRunning = false;
}

const timerHandler = () => {
  if (isRunning === false) {
    startTimer();
  } else if (isRunning === true) {
    pauseTimer();
  }
  
  buttonStart.textContent === 'старт' ? buttonStart.textContent = 'пауза' : buttonStart.textContent = 'старт';
}

buttonStart.addEventListener('click', timerHandler);


// Список задач
const input = document.querySelector('.todo-input');
const button = document.querySelector('.todo-add');
const list = document.querySelector('.todo-container');

const addItem = () => {
  if (input.value.length > 0) {
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";

    const label = document.createElement('label');
    label.append(checkbox);

    label.append(input.value);
    list.append(label);
    input.value = '';
  }
};

button.addEventListener('click', addItem);
input.addEventListener('keyup', e => {
  if (e.keyCode === 13) {
    addItem();
  }
});
