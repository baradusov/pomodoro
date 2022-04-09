import { makeAutoObservable, when } from 'mobx';

class Task {
  constructor(rootStore, task) {
    this.rootStore = rootStore;

    this.id = Date.now();

    this.text = task;

    this.completed = false;

    this.tomatos = 1;

    this.startTomato =
      this.rootStore.tasks.totalTomatos + this.rootStore.tomato.current;

    this.endTomato = this.rootStore.tasks.allTasks.size + this.tomatos;

    makeAutoObservable(this);

    when(
      () => this.endTomato === this.rootStore.tomato.current,
      () => {
        this.completeTask();
      }
    );
  }

  get currentTomato() {
    return this.rootStore.tomato.current - this.startTomato;
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

  allTasks = new Map();

  addNewTask = (taskToAdd) => {
    const task = new Task(this.rootStore, taskToAdd);
    this.allTasks.set(task.id, task);
  };

  get totalTomatos() {
    return Array.from(this.allTasks).reduce((acc, [_id, task]) => {
      return acc + task.tomatos;
    }, 0);
  }

  get currentTask() {
    const [current, next] = Array.from(this.allTasks).filter(([_id, task]) => {
      return !Boolean(task.completed);
    });

    if (current && this.rootStore.tomato.resting) {
      return current[1];
    }

    if (next) {
      return next[1];
    }
  }
}
