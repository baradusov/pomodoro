import React from "react";
import "./App.css";
import audio from "./ding.wav";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      remained: null,
      endTime: null,
      duration: 25 * 60 * 1000,
      isRunning: false
    };
    this.timer = null;
    this.audio = new Audio(audio);
  }

  tick = () => {
    const { endTime } = this.state;
    const time = endTime - Date.now();

    if (time < 0) {
      this.playSound();
      this.stopTimer();
    } else {
      this.setState({ remained: time });
    }
  };

  startTimer = () => {
    const { remained, duration } = this.state;
    const time = remained ? remained : duration;
    const start = Date.now();
    const end = start + time;

    this.setState({
      endTime: end,
      isRunning: true
    });

    this.timer = setInterval(this.tick, 100);
  };

  pauseTimer = () => {
    clearInterval(this.timer);

    this.setState(({ endTime }) => {
      return {
        remained: endTime - Date.now(),
        startTime: null,
        endTime: null,
        isRunning: false
      };
    });
  };

  stopTimer = () => {
    this.setState({
      startTime: null,
      endTime: null,
      remained: null,
      isRunning: false
    });

    clearInterval(this.timer);
    this.timer = null;
  };

  toggleTimer = () => {
    const { isRunning } = this.state;
    isRunning ? this.pauseTimer() : this.startTimer();
  };

  renderTime = millis => {
    const rawMinutes = Math.floor(millis / 60000);
    const rawSeconds = Math.floor((millis % 60000) / 1000);
    const formatedSeconds = rawSeconds > 60 ? 59 : rawSeconds;
    const minutes = rawMinutes < 10 ? `0${rawMinutes}` : rawMinutes;
    const seconds =
      formatedSeconds < 10 ? `0${formatedSeconds}` : formatedSeconds;
    return `${minutes}:${seconds}`;
  };

  componentWillUnmount = () => {
    clearInterval(this.timer);
  };

  playSound = () => {
    this.audio.play();
  };

  render() {
    const { remained, duration, isRunning } = this.state;
    const timeToRender = remained
      ? this.renderTime(remained)
      : this.renderTime(duration);
    return (
      <main className="app">
        <p>{timeToRender}</p>
        <div>
          <button onClick={this.toggleTimer}>
            {isRunning ? "Пауза" : "Старт"}
          </button>
          <button onClick={this.stopTimer}>Стоп</button>
        </div>
      </main>
    );
  }
}

export default App;
