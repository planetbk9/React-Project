import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as watchActions from 'store/modules/watch';
import TimeManager from '../components/TimeManager';

class TimeManagerContainer extends Component {
  timeNum = 0;
  forceStop = false;

  countTime = () => {
    this.timeNum = setInterval(this.props.progress, 10);
  };
  stopTime = () => {
    clearInterval(this.timeNum);
  };
  handleStart = () => {
    this.props.start();
    this.countTime();
  };
  
  handlePause = () => {
    this.stopTime();
    this.props.pause();
  }

  handleResume = () => {
    this.props.resume();
    this.countTime();
  }
  
  handleReset = () => {
    this.props.reset();
    this.stopTime();
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
  }

  render() {
    const { initTime, startTime, stoppedTime, currentTime, state } = this.props;
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