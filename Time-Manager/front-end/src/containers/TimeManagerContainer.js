import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as watchActions from 'store/modules/watch';
import TimeManager from '../components/TimeManager';
import axios from 'axios';
import server from 'utils/serverinfo';
import funcs from 'utils/funcs';

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
    this.saveTime(false);
    this.props.pause(Date.now());
  }

  handleResume = () => {
    this.props.resume(Date.now());
    this.countTime();
  }
  
  handleReset = () => {
    this.props.reset(Date.now());
    this.stopTime();
    this.saveTime(true);
  }

  saveTime = (force) => {
    const { initTime, startTime, stoppedTime, currentTime } = this.props;
    const time = initTime + currentTime - startTime - stoppedTime;
    if(!force) {
      axios.get(server + '/api/times/' + funcs.getDate(), {})
      .then(res => {
        if(res.data === null || res.data.time < time) {
          axios.put(server + '/api/update/' + funcs.getDate(), {
            time: time
          })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.error(err);
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
    } else {
      axios.put(server + '/api/update/' + funcs.getDate(), {
        time: 0
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
    }
  }

  onBlur = () => {this.stopTime(); if(this.props.state === 'progress') this.forceStop = true;}
  onFocus = () => {if(this.forceStop) {this.countTime();this.forceStop = false;} };
  onBeforeUnload = () => {this.saveTime(false);}; // update DB before unload
  onKeyCommon = (e) => {if(e.code !== 'Space' && e.code !== 'Enter') return; e.stopPropagation();e.preventDefault();};
  onKeyup = (e) => {if(e.code !== 'Space' && e.code !== 'Enter') return; this.onKeyCommon(e);
    this.props.state === 'progress' ? this.handlePause() : this.props.state === 'stop' ? this.handleStart() : this.handleResume();
  };

  componentDidMount() {
    window.addEventListener('blur', this.onBlur.bind(this));
    window.addEventListener('focus', this.onFocus.bind(this));
    window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
    window.addEventListener('keyup', this.onKeyup.bind(this));
    window.addEventListener('keydown', this.onKeyCommon.bind(this));
    window.addEventListener('keypress', this.onKeyCommon.bind(this));
    this.props.getInit(funcs.getDate());
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
    const { initTime, startTime, stoppedTime, currentTime, state, date } = this.props;
    const { handleStart, handlePause, handleResume, handleReset } = this;
    const time = initTime + currentTime - startTime - stoppedTime;

    return (
      <TimeManager
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
