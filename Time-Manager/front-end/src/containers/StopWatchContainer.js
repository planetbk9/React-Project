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

  changeKeyComb = (comb) => {
    if(comb === 1) {
      window.addEventListener('keyup', this.onKeyup);
      window.addEventListener('keydown', this.onKeyCommon);
      window.addEventListener('keypress', this.onKeyCommon);
    } else {
      window.removeEventListener('keyup', this.onKeyup);
      window.removeEventListener('keydown', this.onKeyCommon);
      window.removeEventListener('keypress', this.onKeyCommon);
    }
  }

  changeDate = (dateObj) => {
    const userItems = this.props.db.userItems;
    const date = funcs.getDate(dateObj);
    let userItem = funcs.findUserItemByDate(userItems, date);
    let dateItem = null;
    if(userItem && userItem.dateItems) {
      dateItem = userItem.dateItems[userItem.dateItems.length-1];
      this.props.watch_sync({date, dateItem});
    } else {
      dateItem = {
        subject: '',
        time: 0
      }
      userItem = {date, dateItems: [dateItem]};
      restAPI.addData(this.props.user, userItem)
      .then(res => {
        const dateItems = res.data.dateItems;
        dateItem = dateItems[dateItems.length-1];
        this.props.watch_sync({date, dateItem});
        this.props.fetchDB(this.props.user);
      })
      .catch(err => {
        console.error(err);
      });
    }
  }

  componentDidMount() {
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('focus', this.onFocus);
    window.addEventListener('beforeunload', this.onBeforeUnload);
    this.changeKeyComb(1);
    
    const { user, watch_sync, fetchDB } = this.props;
    const today = funcs.getDate();
    restAPI.getUserAllData(user)
    .then(res => {
      let existDate = false;
      if(!res || !res.data || !res.data.userItems) throw new Error('user data missing');
      res.data.userItems.some(userItem => {
        if(userItem.date === today) {
          if(userItem.dateItems) {
            fetchDB(user);
            watch_sync({date: userItem.date, dateItem: userItem.dateItems[userItem.dateItems.length-1]});
          }
          existDate = true;
          return true;
        }
        return false;
      });
      if(!existDate) {
        restAPI.addData(user, {date: today, dateItems: [{subject: '', time: 0}]})
        .then(res => {
          fetchDB(user)
          .then(res => {
            if(!res || !res.userItems) return null;
            const userItem = funcs.findUserItemByDate(res.userItems, today);
            if(userItem) watch_sync({date: userItem.date, dateItem: userItem.dateItems[userItem.dateItems.length-1]});
          });
        });
      }
    })
    .catch(err => {
      console.error(err);
    })
  }

  componentWillUnmount() {
    // Remove unload window eventlistener
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    this.changeKeyComb(0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.keyCombination !== this.props.keyCombination) {
      this.changeKeyComb(nextProps.keyCombination);
    }

    return true;
  }

  render() {
    const { time, state, date, dateItem } = this.props;
    const { handleStart, handlePause, handleResume, handleReset, changeTime, changeDate } = this;

    return (
      <StopWatch
        time={time}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
        onAdjust={changeTime}
        date={date}
        changeDate={changeDate}
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
