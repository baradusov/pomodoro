import { makeAutoObservable, when } from 'mobx';

class Task {
  constructor(rootStore, task) {
    this.rootStore = rootStore;

    this.id = Date.now();

    this.text = task;

    this.completed = false;

    this.tomatos = 1;

    this.endTomato = this.rootStore.tasks.tasks.size + this.tomatos;

    makeAutoObservable(this);

    when(
      () => this.endTomato === this.rootStore.tomato.current,
      () => {
        this.completeTask();
      }
    );
  }

  toggleCompleteTask = () => {
    this.completed = !this.completed;
  };

  completeTask = () => {
    this.completed = true;
  };
}

export class Tasks {
  constructor(rootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  tasks = new Map();

  addNewTask = (taskToAdd) => {
    const task = new Task(this.rootStore, taskToAdd);
    this.tasks.set(task.id, task);
  };
}
