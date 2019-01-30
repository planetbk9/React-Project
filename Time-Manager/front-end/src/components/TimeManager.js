import React, { Component } from 'react';
import './TimeManager.scss';

const timeToString = (time) => {
  time = Math.floor(time / 10);
  let ms = String(time % 100);
  while (!/\d{2}/.test(ms)) ms = '0'.concat(ms);
  time = Math.floor(time /= 100);

  let seconds = String(time % 60);
  while (!/[0-5]\d/.test(seconds)) {
    seconds = '0'.concat(seconds);
  }
  time = Math.floor(time /= 60);

  let minutes = time % 60;
  while (!/[0-5]\d/.test(minutes)) {
    minutes = '0'.concat(minutes);
  }
  time = Math.floor(time /= 60);

  let hour = time;

  return hour + ":" + minutes + ":" + seconds + "." + ms;
};

class TimeManager extends Component {
  render() {
    const { init, time, onStart, onPause, onReset, onResume, state, date } = this.props;
    const timeString = timeToString(init + time);
    const resumeBtnStr = state === 'pause' ? 'Resume' : 'Pause';
    const resumeBtnCb = state === 'progress' ? onPause : onResume;

    document.onkeyup = (e) => {
      if(e.code !== 'Space' && e.code !== 'Enter') return;
      
      state === 'progress' ? onPause() : state === 'stop' ? onStart() : onResume();
    };

    return (
      <div className="container">
        <header>Time Manager</header>
        <main>
          <div className="date">
            <p>{date}</p>
          </div>
          <div className="time">
            <p>{timeString}</p>
          </div>
          <div className="control">
            <div className={`${state !== 'stop' ? 'hidden' : ''}`}>
              <div id="on-stop">
                <button id="start" onClick={onStart}>Start</button>
              </div>
            </div>
            <div className={`${state === 'stop' ? 'hidden' : ''}`}>
              <div id="on-progress">
                <button id="reset" onClick={onReset}>Reset</button>
                <button id="resume" onClick={resumeBtnCb}>{resumeBtnStr}</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default TimeManager;