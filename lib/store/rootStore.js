import { Tomato } from './tomato';
import { Audio } from './audio';
import { Tasks } from './tasks';

export class RootStore {
  constructor() {
    this.audio = new Audio(this);
    this.tasks = new Tasks(this);
    this.tomato = new Tomato(this);
  }

  init = () => {
    this.tasks.init();
    this.tomato.init();
  };
}
