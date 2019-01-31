import React, { Component } from 'react';
import './TimeManager.scss';
import funcs from 'utils/funcs';

class TimeManager extends Component {
  render() {
    const { time, onStart, onPause, onReset, onResume, state, date } = this.props;
    const timeString = funcs.timeToString(time);
    const resumeBtnStr = state === 'pause' ? 'Resume' : 'Pause';
    const resumeBtnCb = state === 'progress' ? onPause : onResume;

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