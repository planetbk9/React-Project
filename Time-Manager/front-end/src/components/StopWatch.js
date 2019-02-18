import React, { Component } from 'react';
import './StopWatch.scss';
import funcs from 'utils/funcs';

class StopWatch extends Component {
  render() {
    const { time, onStart, onPause, onReset, onResume, onAdjust, state, date, subject } = this.props;
    const timeString = funcs.timeToString(time);
    const resumeBtnStr = state === 'pause' ? 'Resume' : 'Pause';
    const resumeBtnCb = state === 'progress' ? onPause : onResume;

    return (
      <div className="watch-container">
        <header>StopWatch</header>
        <main>
          <div className="watch-info">
            <div className="watch-date">{date}</div>
            <div className="watch-subject">{subject}</div>
          </div>
          <div className="watch-time" onClick={onAdjust}>
            <p>{timeString}</p>
          </div>
          <div className="watch-control">
            <div className={`${state !== 'stop' ? 'watch-hidden' : ''}`}>
              <div id="watch-on-stop">
                <button id="watch-start" onClick={onStart}>Start</button>
              </div>
            </div>
            <div className={`${state === 'stop' ? 'watch-hidden' : ''}`}>
              <div id="watch-on-progress">
                <button id="watch-reset" onClick={onReset}>Reset</button>
                <button id="watch-resume" onClick={resumeBtnCb}>{resumeBtnStr}</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default StopWatch;