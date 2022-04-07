import { makeAutoObservable } from 'mobx';

export class Audio {
  audio = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAudio = (audio) => {
    this.audio = audio;
  };

  play = () => {
    this.audio.play();
  };
}
