import { autorun, makeAutoObservable, when } from 'mobx';

class Task {
  constructor(rootStore, task) {
    console.log(task);
    this.rootStore = rootStore;
    this.id = task.id || Date.now();
    this.text = task.text;
    this.completed = task.completed || false;
    this.tomatos = task.tomatos || 1;
    this.startTomato =
      task.startTomato ||
      this.rootStore.tasks.totalTomatos + this.rootStore.tomato.current;
    this.endTomato =
      task.endTomato || this.rootStore.tasks.allTasks.size + this.tomatos;

    makeAutoObservable(this);
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

    autorun(() => {
      const tasks = Array.from(this.allTasks).map(
        ([_, { id, text, tamatos, completed, startTomato, endTomato }]) => {
          return {
            id,
            text,
            tamatos,
            completed,
            startTomato,
            endTomato,
          };
        }
      );

      if (Boolean(tasks.length)) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    });
  }

  allTasks = new Map();

  addNewTask = (taskToAdd) => {
    const task = new Task(this.rootStore, taskToAdd);
    this.allTasks.set(task.id, task);
  };

  get totalTomatos() {
    return this.allTasks.size;
  }

  get currentTask() {
    const [current, next] = Array.from(this.allTasks).filter(([_id, task]) => {
      return !Boolean(task.completed);
    });

    if (current) {
      return current[1];
    }
  }

  init = () => {
    const rawTaks = localStorage.getItem('tasks');

    if (rawTaks) {
      const tasks = JSON.parse(rawTaks);

      if (Boolean(tasks.length)) {
        tasks.forEach((task) => {
          this.addNewTask(task);
        });
      }
    }
  };
}
