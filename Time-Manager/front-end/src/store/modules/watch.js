import { createAction, handleActions } from 'redux-actions';

const START = 'watch/start';
const PAUSE = 'watch/pause';
const RESUME = 'watch/resume';
const RESET = 'watch/reset';
const PROGRESS = 'watch/progress';

export const start = createAction(START);
export const pause = createAction(PAUSE);
export const resume = createAction(RESUME);
export const reset = createAction(RESET);
export const progress = createAction(PROGRESS);

const getTime = () => new Date().getTime();

const initialState = {
  initTime: '00:00:00:00',
  startTime: getTime(),
  stoppedTime: 0,
  pauseTime: 0,
  currentTime: getTime(),
  lifeCycle: 'stop'
};

export default handleActions({
  [START]: (state) => {
    return {
      ...state,
      startTime: getTime(),
      currentTime: getTime(),
      lifeCycle: 'progress'
    };
  },
  [PAUSE]: (state) => {
    return {
      ...state,
      pauseTime: getTime(),
      currentTime: getTime(),
      lifeCycle: 'pause'
    }
  },
  [RESUME]: (state) => {
    const stopped = state.stoppedTime + getTime() - state.pauseTime;
    return {
      ...state,
      stoppedTime: stopped,
      currentTime: getTime(),
      lifeCycle: 'progress'
    }
  },
  [RESET]: (state) => {
    return {
      initTime: '00:00:00:00',
      startTime: getTime(),
      stoppedTime: 0,
      pauseTime: 0,
      currentTime: getTime(),
      lifeCycle: 'stop'
    }
  },
  [PROGRESS]: (state) => {
    return {
      ...state,
      currentTime: getTime(),
      lifeCycle: 'progress'
    }
  }
}, initialState);