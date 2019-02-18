import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as watchActions from 'store/modules/watch';
import * as dbActions from 'store/modules/db';
import StopWatch from '../components/StopWatch';
import * as restAPI from 'utils/restAPI';
import funcs from 'utils/funcs';

class StopWatchContainer extends Component {
  timeNum = 0;
  forceStop = false; // For reset event

  countTime = () => {
    this.timeNum = setInterval(() => {
      this.props.watch_progress(Date.now());
    }, 10);
  };
  stopTime = () => {
    clearInterval(this.timeNum);
  };
  handleStart = () => {
    this.countTime();
    this.props.watch_start(Date.now());
  }; 
  
  handlePause = () => {
    this.stopTime();
    this.saveTime(this.props.user, false);
    this.props.watch_pause(Date.now());
  }

  handleResume = () => {
    this.countTime();
    this.props.watch_resume(Date.now());
  }
  
  handleReset = () => {
    this.stopTime();
    this.props.watch_reset(Date.now());
    this.saveTime(this.props.user, true, 0);
  }
  
  changeTime = () => {
    const { db, time, date, dateItem, watch_sync } = this.props;
    let newTime = window.prompt("변경할 시간을 00:00:00.00 형태로 입력하세요.", funcs.timeToString(time));
    newTime = funcs.stringToTime(newTime);
    if(!newTime) {
      alert('형식에 맞춰서 입력해주세요.');
      return;
    }
    dateItem.time = newTime;
    watch_sync({date, dateItem});
    this.saveTime(db.user, true, newTime);
  }

  saveTime = (user, force, newTime) => {
    if(!user) return;
    const { time, dateItem, fetchDB } = this.props;
    const _id = dateItem._id;

    restAPI.getData(user, _id)
    .then(res => {
      if(force) {
        dateItem.time = newTime;
        restAPI.updateData(user, _id, dateItem)
        .then(res => {
          console.log(res);
          fetchDB(user);
        })
        .catch(err => {
          console.error(err);
        });
      } else {
        if(!res.data || res.data.time < time) {
          dateItem.time = time;
          restAPI.updateData(user, _id, dateItem)
          .then(res => {
            console.log(res);
            fetchDB(user);
          })
          .catch(err => {
            console.error(err);
          });
        }
      }
    })
    .catch(err => {
      console.log('saveTime Error');
    });
  }

  onBlur = () => {this.stopTime(); if(this.props.state === 'progress') this.forceStop = true;}
  onFocus = () => {if(this.forceStop) {this.countTime();this.forceStop = false;} };
  onBeforeUnload = () => {this.saveTime(this.props.user, false);}; // update DB before unload
  onKeyCommon = (e) => {if(e.code !== 'Space') return; e.stopPropagation();e.preventDefault();};
  onKeyup = (e) => {if(e.code !== 'Space') return; this.onKeyCommon(e);
    this.props.state === 'progress' ? this.handlePause() : this.props.state === 'stop' ? this.handleStart() : this.handleResume();
  };

  componentDidMount() {
    window.addEventListener('blur', this.onBlur.bind(this));
    window.addEventListener('focus', this.onFocus.bind(this));
    window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
    window.addEventListener('keyup', this.onKeyup.bind(this));
    window.addEventListener('keydown', this.onKeyCommon.bind(this));
    window.addEventListener('keypress', this.onKeyCommon.bind(this));
    
    const { user, watch_sync, fetchDB } = this.props;
    const today = funcs.getDate();
    restAPI.getUserAllData(user)
    .then(res => {
      let existDate = false;
      res.data.userItems.some(userItem => {
        if(userItem.date === today) {
          if(userItem.dateItems.length === 0) {
            restAPI.addData(user, {userItem: {date: today, dateItems: [{subject: '', time: 0}]}});
          }
          existDate = true;
          return true;
        }
        return false;
      });
      if(!existDate) {
        restAPI.addData(user, {userItem: {date: today, dateItems: [{subject: '', time: 0}]}});
      }
    })
    .then(res => {
      fetchDB(user)
      .then(res => {
        const userItem = funcs.findUserItemByDate(res.userItems, today);
        if(userItem) watch_sync({date: today, dateItem: userItem.dateItems[0]});
      });
    })
    .catch(err => {
      console.error(err);
    })
  }

  componentWillUnmount() {
    // Remove unload window eventlistener
    window.removeEventListener('blur', this.onBlur.bind(this));
    window.removeEventListener('focus', this.onFocus.bind(this));
    window.removeEventListener('beforeunload', this.onBeforeUnload.bind(this));
    window.removeEventListener('keyup', this.onKeyup.bind(this));
    window.removeEventListener('keydown', this.onKeyCommon.bind(this));
    window.removeEventListener('keypress', this.onKeyCommon.bind(this));
  }

  render() {
    const { time, state, date, dateItem } = this.props;
    const { handleStart, handlePause, handleResume, handleReset, changeTime } = this;
  
    return (
      <StopWatch
        time={time}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
        onAdjust={changeTime}
        date={date}
        subject={dateItem.subject}
        state={state}/>
    );
  }
}

const mapStateToProps = ({watch, db}) => ({
  ...watch,
  time: watch.initTime + watch.currentTime - watch.startTime - watch.stoppedTime,
  db: db
});
const mapDispatchToProps = (dispatch) => bindActionCreators({...watchActions, ...dbActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StopWatchContainer);
