import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as watchActions from 'store/modules/watch';
import TimeManager from '../components/TimeManager';
import axios from 'axios';

class TimeManagerContainer extends Component {
  timeNum = 0;
  forceStop = false;

  countTime = () => {
    this.timeNum = setInterval(() => {
      this.props.progress(Date.now());
    }, 10);
  };
  stopTime = () => {
    clearInterval(this.timeNum);
  };
  handleStart = () => {
    this.props.start(Date.now());
    this.countTime();
  };
  
  handlePause = () => {
    this.stopTime();
    this.props.pause(Date.now());
  }

  handleResume = () => {
    this.props.resume(Date.now());
    this.countTime();
  }
  
  handleReset = () => {
    this.props.reset(Date.now());
    this.stopTime();
  }

  onUnload = (event) => {
    const { initTime, startTime, stoppedTime, currentTime } = this.props;
    const time = initTime + currentTime - startTime - stoppedTime;
    axios.put('http://kevin9.iptime.org:9000/api/update/' + getDate(), {
      time: time
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentDidMount() {
    window.onblur = () => {
      this.stopTime();
      if(this.props.state === 'progress') this.forceStop = true;
    };
    window.onfocus = () => {
      if(this.forceStop) {
        this.countTime();
        this.forceStop = false;
      } 
    }
    window.onbeforeunload = this.onUnload; // update DB before unload
    this.props.getInit(getDate());
  }

  componentWillUnmount() {
    // Remove unload window eventlistener
    window.removeEventListener('beforeunload', this.onUnload);
  }

  render() {
    const { initTime, startTime, stoppedTime, currentTime, state, date } = this.props;
    const { handleStart, handlePause, handleResume, handleReset } = this;
    const time = currentTime - startTime - stoppedTime;
    return (
      <TimeManager 
        init={initTime}
        time={time}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
        date={date}
        state={state}/>
    );
  }
}

const mapStateToProps = ({watch}) => ({
  ...watch,
  state: watch.lifeCycle
});

const mapDispatchToProps = (dispatch) => bindActionCreators(watchActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TimeManagerContainer);

const getDate = () => {
  const dateObj = new Date();

  let dateString = dateObj.getFullYear() + '-';
  const month = dateObj.getMonth() + 1;
  dateString += (/\d{2}/.test(month) ? month : '0' + month) + '-';
  const date = dateObj.getDate();
  dateString += /\d{2}/.test(date) ? date : '0' + date;
  
  return dateString;
};