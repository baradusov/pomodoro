import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { observer } from 'mobx-react-lite';
import cn from 'clsx';

import { useStore } from 'lib/hooks/useStore';

import styles from 'styles/Home.module.css';

const Home = () => {
  const {
    tomato: {
      time,
      start,
      pause,
      resting,
      current,
      isLongBreak,
      isPaused,
      remained,
      sessions,
    },
    tasks: { allTasks, addNewTask, currentTask, removeTask },
    audio,
    reset,
  } = useStore();

  const inputRef = useRef(null);

  const seconds = time / 1000;

  const getTime = () => {
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');

    return `${m}:${s}`;
  };

  const timer = getTime();

  const canPause = isPaused || !remained;

  const toggleState = () => {
    if (canPause) {
      start();
    } else {
      pause();
    }
  };

  const renderBreakInfo = () => {
    if (resting) {
      if (isLongBreak) {
        return 'long break';
      }

      return 'short break';
    }

    return 'working';
  };

  const handleAddNewTask = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      addNewTask({ text: event.target.value });

      inputRef.current.value = '';
    }
  };

  const handleRemoveTask = (taskId) => {
    removeTask(taskId);
  };

  useEffect(() => {
    audio.setAudio(new Audio('/ding.wav'));
  }, [audio]);

  return (
    <>
      <Head>
        <title>{timer}</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.timerContainer}>
          <p className={styles.timer}>{timer}</p>
          {currentTask && (
            <p className={styles.currentTask}>
              {currentTask.text}{' '}
              <span>
                ({currentTask.currentTomato}/{currentTask.tomatos})
              </span>
            </p>
          )}
        </div>

        <div className={styles.tasks}>
          <p className={styles.taskTitle}>Plan</p>

          <ul className={styles.taskList}>
            {Array.from(allTasks).map(([id, task]) => {
              const classes = cn(
                styles.task,
                task.completed && styles.completed
              );

              const handleToggleEditing = (event) => {
                if (event.key === 'Enter' && event.target.value.trim() !== '') {
                  task.toggleEditing();
                }
              };

              const handleSetText = (event) => {
                task.setText(event.target.value);
              };

              const handleSetTomatos = (event) => {
                task.setTomatos(Number(event.target.value));
              };

              return (
                <li
                  className={classes}
                  key={id}
                  // onClick={() => handleCompleteTask(task)}
                >
                  {task.isEditing ? (
                    <>
                      <div className={styles.taskControls}>
                        <p
                          style={{
                            display: 'block',
                            paddingRight: 10,
                            cursor: 'pointer',
                          }}
                          title="Complete task"
                          onClick={task.toggleCompleteTask}
                        >
                          {task.completed ? '+' : '-'}
                        </p>
                        <input
                          autoFocus
                          className={styles.input}
                          value={task.text}
                          onChange={handleSetText}
                          onKeyDown={handleToggleEditing}
                        />
                      </div>

                      <input
                        className={styles.input}
                        style={{ width: '100px' }}
                        type="number"
                        min={1}
                        value={task.tomatos}
                        onChange={handleSetTomatos}
                        onKeyDown={handleToggleEditing}
                      />
                    </>
                  ) : (
                    <>
                      <div className={styles.taskControls}>
                        <p
                          style={{
                            display: 'block',
                            paddingRight: 10,
                            cursor: 'pointer',
                          }}
                          title="Complete task"
                          onClick={task.toggleCompleteTask}
                        >
                          {task.completed ? '+' : '-'}
                        </p>
                        <p title="Edit task" onClick={task.toggleEditing}>
                          {task.text}
                        </p>
                      </div>
                      <div className={styles.taskControls}>
                        <p title="Edit task" onClick={task.toggleEditing}>
                          {task.tomatos}
                        </p>
                        <p
                          style={{ marginLeft: 15, cursor: 'pointer' }}
                          title="Remove task"
                          onClick={() => handleRemoveTask(task.id)}
                        >
                          X
                        </p>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>

          <input
            className={styles.input}
            ref={inputRef}
            type="text"
            placeholder="Enter new task"
            onKeyDown={handleAddNewTask}
          />
        </div>

        <div className={styles.buttons}>
          <button className={styles.button} onClick={toggleState}>
            {canPause ? 'Start' : 'Pause'}
          </button>
          <button className={styles.button} onClick={reset}>
            Reset
          </button>
        </div>

        <div className={styles.info}>
          <p>
            completed {current} of {sessions} tomatos
          </p>
          <p>{renderBreakInfo()}</p>
        </div>
      </main>
    </>
  );
};

export default observer(Home);
