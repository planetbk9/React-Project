import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

const START = 'watch/start';
const PAUSE = 'watch/pause';
const RESUME = 'watch/resume';
const RESET = 'watch/reset';
const PROGRESS = 'watch/progress';
const FETCH_DATA = 'db/fetch';
const INSERT_DATA = 'db/insert';
const UPDATE_DATA = 'db/update';
const DELETE_DATA = 'db/delete';

export const start = createAction(START);
export const pause = createAction(PAUSE);
export const resume = createAction(RESUME);
export const reset = createAction(RESET);
export const progress = createAction(PROGRESS);
// DB actions
export const fetch_data = createAction(FETCH_DATA);
export const insert_data = createAction(INSERT_DATA);
export const update_data = createAction(UPDATE_DATA);
export const delete_data = createAction(DELETE_DATA);

// Get data from server using middleware
export const getInit = (date) => dispatch => {
  return axios.get('http://kevin9.iptime.org:9000/api/times/' + date)
  .then(res => {
    if(res.data === null) {
      axios.post('http://kevin9.iptime.org:9000/api/time', {
        _id: date,
        date: Date.now(),
        time: 0
      })
      .then(res => {
        dispatch(fetch_data({date: date, time: res.data.time}))
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      })
      return;
    }
    console.log("data received from server: " + res.data.time);
    dispatch(fetch_data({date: date, time: res.data.time})); 
  })
  .catch(err => {
    console.error(err);
  })
};


const initialState = {
  initTime: 0,
  startTime: Date.now(),
  stoppedTime: 0,
  pauseTime: 0,
  currentTime: Date.now(),
  date: '1900-00-00',
  lifeCycle: 'stop'
};

export default handleActions({
  [START]: (state, action) => {
    return {
      ...state,
      startTime: action.payload,
      currentTime: action.payload,
      lifeCycle: 'progress'
    };
  },
  [PAUSE]: (state, action) => {
    return {
      ...state,
      pauseTime: action.payload,
      currentTime: action.payload,
      lifeCycle: 'pause'
    }
  },
  [RESUME]: (state, action) => {
    const stopped = state.stoppedTime + action.payload - state.pauseTime;
    return {
      ...state,
      stoppedTime: stopped,
      currentTime: action.payload,
      lifeCycle: 'progress'
    }
  },
  [RESET]: (state, action) => {
    return {
      initTime: '00:00:00:00',
      startTime: action.payload,
      stoppedTime: 0,
      pauseTime: 0,
      currentTime: action.payload,
      lifeCycle: 'stop'
    }
  },
  [PROGRESS]: (state, action) => {
    return {
      ...state,
      currentTime: action.payload,
      lifeCycle: 'progress'
    }
  },
  [FETCH_DATA]: (state, action) => {
    return {
      ...state,
      initTime: action.payload['time'],
      date: action.payload['date']
    }
  }
}, initialState);