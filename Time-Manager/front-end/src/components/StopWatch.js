import React, { Component } from 'react';
import funcs from 'utils/funcs';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './StopWatch.scss';

class StopWatch extends Component {
  render() {
    const { time, onStart, onPause, onReset, onResume, onAdjust, state, date, subject, changeDate } = this.props;
    const timeString = funcs.timeToString(time);
    const resumeBtnStr = state === 'pause' ? '재개' : '정지';
    const resumeBtnCb = state === 'progress' ? onPause : onResume;

    return (
      <div className="watch-container">
        <header>초시계</header>
        <main>
          <div className="watch-info">
            <div className="watch-date">{date}
              <div className="date-container">
                <DatePicker className="datepicker" selected={new Date(date)} onChange={changeDate}/>
              </div>
            </div>
            <div className="watch-subject">{subject}</div>
          </div>
          <div className="watch-time" onClick={onAdjust}>
            <p>{timeString}</p>
          </div>
          <div className="watch-control">
            <div className={`${state !== 'stop' ? 'watch-hidden' : ''}`}>
              <div id="watch-on-stop">
                <button id="watch-start" onClick={onStart}>시작</button>
              </div>
            </div>
            <div className={`${state === 'stop' ? 'watch-hidden' : ''}`}>
              <div id="watch-on-progress">
                <button id="watch-reset" onClick={onReset}>리셋</button>
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