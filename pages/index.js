import { useEffect } from 'react';
import Head from 'next/head';
import { observer } from 'mobx-react-lite';

import { useStore } from 'lib/hooks/useStore';

import styles from 'styles/Home.module.css';
import { settings } from 'lib/store/tomato';

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
    },
    audio,
  } = useStore();

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

  useEffect(() => {
    audio.setAudio(new Audio('/ding.wav'));
  }, [audio.setAudio]);

  return (
    <>
      <Head>
        <title>{timer}</title>
      </Head>
      <main className={styles.main}>
        <p className={styles.timer}>{timer}</p>

        <div className={styles.buttons}>
          <button className={styles.button} onClick={toggleState}>
            {canPause ? 'Start' : 'Pause'}
          </button>
        </div>

        <div className={styles.info}>
          <p>
            passed: {current} of {settings.sessions}
          </p>
          <p>{renderBreakInfo()}</p>
        </div>
      </main>
    </>
  );
};

export default observer(Home);
