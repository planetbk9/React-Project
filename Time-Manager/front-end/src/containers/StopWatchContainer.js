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
    const { user, time, date, dateItem, watch_sync } = this.props;
    let newTime = window.prompt("변경할 시간을 00:00:00.00 형태로 입력하세요.", funcs.timeToString(time));
    newTime = funcs.stringToTime(newTime);
    if(!newTime) {
      alert('형식에 맞춰서 입력해주세요.');
      return;
    }
    dateItem.time = newTime;
    watch_sync({date, dateItem});
    this.saveTime(user, true, newTime);
  }

  saveTime = (user, force, newTime) => {
    const { time, date, dateItem } = this.props;
    // Guest mode 동작
    if(!user) {
      const subject = dateItem.subject;
      if(!subject) return;
      let guestSubjectList = sessionStorage.getItem('timemanager_list') || '';
      if(guestSubjectList.indexOf(subject) === -1) {
        guestSubjectList += guestSubjectList === '' ? subject : ':' + subject;
      }
      sessionStorage.setItem('timemanager_list', guestSubjectList);
      sessionStorage.setItem('timemanager_'+subject, time);
      return;
    }
    const _id = dateItem._id;

    restAPI.getData(user, _id)
    .then(res => {
      if(force) {
        dateItem.time = newTime;
        restAPI.updateData(user, _id, dateItem)
        .then(res => {
          this.props.db_update({date, _id, newObj: res.data.dateItem});
        })
        .catch(err => {
          console.error(err);
        });
      } else {
        if(!res.data || res.data.time < time) {
          dateItem.time = time;
          restAPI.updateData(user, _id, dateItem)
          .then(res => {
            this.props.db_update({date, _id, newObj: res.data.dateItem});
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
  onBeforeUnload = (e) => {this.saveTime(this.props.user, false);}; // update DB before unload
  onKeyCommon = (e) => {if(e.keyCode !== 32) return; e.stopPropagation();e.preventDefault();};
  onKeyup = (e) => {if(e.keyCode !== 32) return; this.onKeyCommon(e);
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
    const userItems = this.props.userItems;
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
        const userItems = res.data.userItems;
        const dateItems = res.data.userItem.dateItems;
        this.props.db_insert_all({user: this.props.user, userItems});
        dateItem   = dateItems[dateItems.length-1];
        this.props.watch_sync({date, dateItem});
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
    window.addEventListener('unload', this.onBeforeUnload);
    window.addEventListener('close', this.onBeforeUnload);
    this.changeKeyComb(1);
  }

  componentWillUnmount() {
    // Remove unload window eventlistener
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    window.removeEventListener('unload', this.onBeforeUnload);
    window.removeEventListener('close', this.onBeforeUnload);
    this.changeKeyComb(0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.keyCombination !== this.props.keyCombination) {
      this.changeKeyComb(nextProps.keyCombination);
    }

    return this.props !== nextProps || this.state !== nextState;
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

const mapStateToProps = ({watch, db, common}) => ({
  ...watch,
  time: watch.initTime + watch.currentTime - watch.startTime - watch.stoppedTime,
  ...db,
  common
});
const mapDispatchToProps = (dispatch) => bindActionCreators({...watchActions, ...dbActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StopWatchContainer);
