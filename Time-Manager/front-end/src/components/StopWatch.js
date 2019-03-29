import React, { Component } from 'react';
import funcs from 'utils/funcs';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './StopWatch.scss';

class StopWatch extends Component {
  isMobile = () => {
    const filter = "win16|win32|win64|mac|macintel";
    if(navigator.platform) {
      if(filter.indexOf(navigator.platform.toLowerCase()) === -1) {
        return true;
      }
    }
    return false;
  }
  render() {
    const { time, onStart, onPause, onReset, onResume, onAdjust, state, date, subject, changeDate } = this.props;
    const timeString = funcs.timeToString(time);
    const resumeBtnStr = state === 'pause' ? 'Resume' : 'Stop';
    const resumeBtnCb = state === 'progress' ? onPause : onResume;
    const watchMention = this.isMobile() ? '버튼으로 조작하세요!' : "단축키는 '스페이스바' 입니다!";

    return (
      <div className="watch-container">
        <h2 className="watch-mention">
          {watchMention}
        </h2>
        <section>
          <div className="watch-info">
            <div className="watch-date">{date}
              <div className="date-container">
                <DatePicker className="datepicker" selected={new Date(date)} onChange={changeDate}/>
              </div>
            </div>
            <div className="watch-subject">{subject}</div>
          </div>
          <div className="watch-time">
            <h2 className="watch-time-string" onClick={onAdjust}>{timeString}</h2>
          </div>
          <div className="watch-control">
            {
              state === 'stop' ?
              <div id="watch-on-stop">
                <button id="watch-start" onClick={onStart}>Start</button>
              </div>
              :
              <div id="watch-on-progress">
                <button id="watch-reset" onClick={onReset}>Reset</button>
                <button id="watch-resume" className="second-item" onClick={resumeBtnCb}>{resumeBtnStr}</button>
              </div>
            }
          </div>
        </section>
      </div>
    );
  }
}

export default StopWatch;