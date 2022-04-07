import { Tomato } from './tomato';
import { Audio } from './audio';

export class RootStore {
  constructor() {
    this.tomato = new Tomato(this);
    this.audio = new Audio(this);
  }
}
