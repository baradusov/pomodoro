import { makeAutoObservable, runInAction } from 'mobx';

const ms = 60 * 1000;

export const settings = {
  tomato: 25 * ms,
  shortBreak: 5 * ms,
  longBreak: 20 * ms,
  sessions: 4,
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
  }

  get isLongBreak() {
    console.log(this.current % settings.sessions);
    return this.current % settings.sessions === 0;
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
    this.timer = setInterval(this.tick, 100);
    this.isPaused = false;
  };

  pause = () => {
    if (this.isPaused) return;

    clearInterval(this.timer);

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

    clearInterval(this.timer);
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
}
