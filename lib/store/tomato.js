import { autorun, makeAutoObservable } from 'mobx';
import * as workerTimer from 'worker-timers';

const ms = 60 * 1000;

export const settings = {
  tomato: 0.3 * ms,
  shortBreak: 0.2 * ms,
  longBreak: 20 * ms,
  longBreakDelay: 4,
};

export class Tomato {
  startTime = null;
  endTime = null;
  remained = null;
  duration = settings.tomato;
  timer = null;
  isPaused = false;
  resting = false;
  current = 0;

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);

    autorun(() => {
      if (this.remained || this.current) {
        localStorage.setItem(
          'tomato',
          JSON.stringify({
            startTime: this.startTime,
            endTime: this.endTime,
            remained: this.remained,
            isPaused: true,
            resting: this.resting,
            current: this.current,
          })
        );
      }
    });
  }

  // TODO: maybe move to tasks?
  get sessions() {
    return Array.from(this.rootStore.tasks.allTasks).reduce(
      (acc, [_id, task]) => {
        return acc + task.tomatos;
      },
      0
    );
  }

  get isLongBreak() {
    return this.current % settings.longBreakDelay === 0;
  }

  tick = () => {
    const time = this.endTime - Date.now();

    if (time <= 1000) {
      this.rootStore.audio.play();
      this.stop();

      return;
    }

    this.remained = time;
  };

  start = () => {
    if (this.timer) {
      return;
    }

    const time = this.remained ? this.remained : this.duration;

    this.startTime = Date.now();
    this.endTime = this.startTime + time;
    this.timer = workerTimer.setInterval(this.tick, 100);
    this.isPaused = false;
  };

  pause = () => {
    if (this.isPaused) return;

    workerTimer.clearInterval(this.timer);

    this.timer = null;
    this.remained = this.endTime - Date.now();
    this.startTime = null;
    this.endTime = null;
    this.isPaused = true;
  };

  stop = () => {
    this.remained = null;
    this.startTime = null;
    this.endTime = null;
    this.isPaused = false;

    workerTimer.clearInterval(this.timer);
    this.timer = null;

    this.next();
  };

  get time() {
    if (this.remained) {
      return this.remained;
    }

    return this.duration;
  }

  setDuration = (duration) => {
    this.duration = duration;
  };

  next = () => {
    const resting = !this.resting;
    const current = Number(resting) + this.current;

    this.current = current;
    this.resting = resting;

    const timeForNext = this.getTimeForNext();
    this.setDuration(timeForNext);

    if (this.resting) {
      this.start();
    } else {
      this.remained = timeForNext;
      this.isPaused = true;
    }
  };

  getTimeForNext = () => {
    if (this.remained) {
      return this.remained;
    }

    const time = this.resting ? settings.shortBreak : settings.tomato;

    if (this.resting && this.isLongBreak) {
      return settings.longBreak;
    }

    return time;
  };

  init = () => {
    const rawTomato = localStorage.getItem('tomato');
    if (rawTomato) {
      Object.entries(JSON.parse(rawTomato)).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  };
}
