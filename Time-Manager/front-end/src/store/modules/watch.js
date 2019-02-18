import { createAction, handleActions } from 'redux-actions';
import funcs from 'utils/funcs';
import * as restAPI from 'utils/restAPI';

const START = 'watch/start';
const PAUSE = 'watch/pause';
const RESUME = 'watch/resume';
const RESET = 'watch/reset';
const PROGRESS = 'watch/progress';
const SYNC = 'watch/sync';
const UPDATE_DB = 'watch/update_db';

export const watch_start = createAction(START);
export const watch_pause = createAction(PAUSE);
export const watch_resume = createAction(RESUME);
export const watch_reset = createAction(RESET);
export const watch_progress = createAction(PROGRESS);
export const watch_sync = createAction(SYNC);
export const watch_update_db = createAction(UPDATE_DB);

const initialState = {
  user: 'kevin.koo',
  date: funcs.getDate(),
  dateItem: {},
  initTime: 0,
  startTime: Date.now(),
  stoppedTime: 0,
  pauseTime: 0,
  currentTime: Date.now(),
  state: 'stop'
};

export default handleActions({
  [START]: (state, action) => {
    return {
      ...state,
      startTime: action.payload,
      currentTime: action.payload,
      state: 'progress'
    };
  },
  [PAUSE]: (state, action) => {
    return {
      ...state,
      pauseTime: action.payload,
      currentTime: action.payload,
      state: 'pause'
    }
  },
  [RESUME]: (state, action) => {
    const stopped = state.stoppedTime + action.payload - state.pauseTime;
    return {
      ...state,
      stoppedTime: stopped,
      currentTime: action.payload,
      state: 'progress'
    }
  },
  [RESET]: (state, action) => {
    return {
      ...state,
      initTime: 0,
      startTime: action.payload,
      stoppedTime: 0,
      pauseTime: 0,
      currentTime: action.payload,
      state: 'stop'
    }
  },
  [PROGRESS]: (state, action) => {
    return {
      ...state,
      currentTime: action.payload,
      state: 'progress'
    }
  },
  [SYNC]: (state, action) => {
    const date = action.payload['date'];
    const dateItem = action.payload['dateItem'];
    
    return {
      ...state,
      date,
      dateItem,
      initTime: dateItem.time,
      startTime: Date.now(),
      stoppedTime: 0,
      pauseTime: 0,
      currentTime: Date.now(),
      state: 'stop'
    };
  },
  [UPDATE_DB]: (state, action) => {
    const newDateItem = {
      ...state.dateItem,
      ...action.payload
    };
    restAPI.updateData(state.user, state.dateItem._id, newDateItem)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.error(err);
    });
    return {
      ...state
    }
  }
}, initialState);
