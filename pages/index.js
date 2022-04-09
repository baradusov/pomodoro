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
    tasks: { tasks, addNewTask },
    audio,
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
      addNewTask(event.target.value);

      inputRef.current.value = '';
    }
  };

  const handleCompleteTask = (task) => {
    task.toggleCompleteTask();
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
        <div className={styles.timer}>
          <p>{timer}</p>
        </div>

        <div className={styles.tasks}>
          <p className={styles.taskTitle}>Plan</p>

          <ul className={styles.taskList}>
            {Array.from(tasks).map(([id, task]) => {
              const classes = cn(
                styles.task,
                task.completed && styles.completed
              );

              return (
                <li
                  className={classes}
                  key={id}
                  onClick={() => handleCompleteTask(task)}
                >
                  <p>{task.text}</p>
                  <p>{task.tomatos}</p>
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
