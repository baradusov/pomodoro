/**
 * "Ленивая" загрузка
 */

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = 0;
  document.body.classList.add('unloaded');
  document.body.style.opacity = '';
});

window.onload = () => {
  document.body.classList.remove('unloaded');
};


/**
 * Переменные
 */

// Таймер
const buttonStart = document.querySelector('.button-start');
const buttonStop = document.querySelector('.button-stop');
const audio = document.querySelector('audio');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
let isRunning = false;
let countdown;
let pausedTime;
let currentIndexOfSequence = 0;
let currentSequence;

// Настройки
let timerState = {
  currentState: null,
  isRunning: false,
  pomodoro: 25, // в минутах
  shortBreak: 5, // в минутах
  longBreak: 5, // в минутах
  startTime: null,
  endTime: null,
  remainedTime: null,
  time: null,
  autoStart: true
};

// Последовательность таймеров и перерывов
let sequence = [
  'pomodoro',
  'shortBreak',
  'pomodoro',
  'shortBreak',
  'pomodoro',
  'shortBreak',
  'pomodoro',
  'longBreak'
];


/**
 * Автоматическое переключение сессий
 */

const autoStartTimer = () => {
  currentSequence = sequence[currentIndexOfSequence];
  currentIndexOfSequence += 1;

   if (sequence[currentIndexOfSequence] === 'shortBreak') {
     shortBreak();
   }

   if (sequence[currentIndexOfSequence] === 'pomodoro') {
     startTimer();
   }

   if (sequence[currentIndexOfSequence] === 'longBreak') {
     longBreak();
   }
}


/**
 * Таймер
 */

 const pomodoro = (time) => {
   timerState.isRunning = true;

   countdown = setInterval(() => {
     const secondsPassed = Math.floor((Date.now() - timerState.startTime) / 1000);
     const secondsLeft = time - secondsPassed;
     const remainderSeconds = secondsLeft % 60;
     const minutesLeft = Math.floor(secondsLeft / 60);

     minutes.textContent = `${minutesLeft}`;
     seconds.textContent = `${remainderSeconds < 10 ? 0 : ''}${remainderSeconds}`;
     document.title = `${minutesLeft}:${remainderSeconds < 10 ? 0 : ''}${remainderSeconds}`;

     if (secondsLeft <= 0) {
       clearInterval(countdown);
       audio.play();

       // Автоматически переключаем сессию
       autoStartTimer();
     }
   }, 1000);
 };


/**
 * Сессии таймера
 */

// Короткий перерыв
const shortBreak = () => {
  timerState.time = timerState.shortBreak * 60000;
  timerState.startTime = Date.now();
  timerState.endTime = timerState.startTime + timerState.time;
  pomodoro(Math.floor(timerState.time / 1000));
}

// Большой перерыв
const longBreak = () => {
  timerState.time = timerState.longBreak * 60000;
  timerState.startTime = Date.now();
  timerState.endTime = timerState.startTime + timerState.time;
  pomodoro(Math.floor(timerState.time / 1000));
  currentIndexOfSequence = -1;
}

// Запуск таймера
const startTimer = () => {
  // Перевод минут в миллисекунды, заменить timerState.pomodoro на общее
  timerState.time = timerState.remainedTime !== null ? timerState.remainedTime : timerState.pomodoro * 60000;
  timerState.startTime = Date.now();
  timerState.endTime = timerState.startTime + timerState.time;
  pomodoro(Math.floor(timerState.time / 1000));
}

// Пауза таймера
const pauseTimer = () => {
  clearInterval(countdown);
  timerState.isRunning = false;
  timerState.remainedTime = timerState.endTime - Date.now();
  timerState.endTime = null;
  timerState.startTime = null;
}

// Управление запуском, паузой и продолжением таймера
const timerHandler = () => {
  if (timerState.isRunning === false) {
    buttonStart.textContent = 'пауза';
    startTimer();
  } else if (timerState.isRunning === true) {
    buttonStart.textContent = 'старт';
    pauseTimer();
  }
}

// Сброс таймера
const resetTimer = () => {
  clearInterval(countdown);
  timerState.isRunning = false;
  timerState.remainedTime = null;
  timerState.endTime = null;
  timerState.startTime = null;
  buttonStart.textContent = 'старт';

  if (currentSequence === 'pomodoro') {
    timerState.time = timerState.pomodoro;
  }

  if (currentSequence === 'shortBreak') {
    timerState.time = timerState.shortBreak;
  }

  if (currentSequence === 'longBreak') {
    timerState.time = timerState.longBreak;
  }

  // TODO: Переделать рендеринг времени при сбросе
  minutes.textContent = timerState.time / 60000;
  seconds.textContent = '00';
}

// Запуск таймера по кнопке
buttonStart.addEventListener('click', timerHandler);
document.addEventListener('keyup', (e)  => {
  if (e.keyCode === 32) {
    e.preventDefault();
    timerHandler();
  }
});

// Сброс таймера
buttonStop.addEventListener('click', resetTimer);
