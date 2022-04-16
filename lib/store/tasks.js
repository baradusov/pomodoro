import { autorun, makeAutoObservable, when } from 'mobx';

class Task {
  constructor(rootStore, task) {
    this.rootStore = rootStore;
    this.id = task.id || Date.now();
    this.text = task.text;
    this.completed = task.completed || false;
    this.tomatos = task.tomatos || 1;
    // TODO: неправильно работает, если отметить задачи сделанными
    this.startTomato =
      task.startTomato ||
      this.rootStore.tasks.totalTomatos + this.rootStore.tomato.current;
    this.endTomato =
      task.endTomato || this.rootStore.tasks.allTasks.size + this.tomatos;

    this.isEditing = false;

    makeAutoObservable(this);

    // when(
    //   () => this.endTomato === this.rootStore.tomato.current,
    //   () => {
    //     this.completeTask();
    //   }
    // );
  }

  get currentTomato() {
    const currentTomato = this.rootStore.tomato.current - this.startTomato;

    if (currentTomato < 0) {
      return 0;
    }

    return currentTomato;
  }

  toggleCompleteTask = () => {
    this.completed = !this.completed;
  };

  completeTask = () => {
    this.completed = true;
  };

  toggleEditing = () => {
    this.isEditing = !this.isEditing;
  };

  setText = (value) => {
    this.text = value;
  };

  setTomatos = (value) => {
    this.tomatos = value;
  };
}

export class Tasks {
  constructor(rootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);

    autorun(() => {
      const tasks = Array.from(this.allTasks).map(
        ([_, { id, text, tomatos, completed, startTomato, endTomato }]) => {
          return {
            id,
            text,
            tomatos,
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

  removeTask = (id) => {
    this.allTasks.delete(id);
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

    if (next && !this.rootStore.tomato.resting) {
      return next[1];
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
