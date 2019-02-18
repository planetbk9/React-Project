import { createAction, handleActions } from 'redux-actions';
import * as restAPI from 'utils/restAPI';

const INSERT = 'history/insert';
const UPDATE = 'history/update';
const REMOVE = 'history/update';
const FETCH_ALL = 'history/fetch_all';

export const history_insert = createAction(INSERT);
export const history_update = createAction(UPDATE);
export const history_remove = createAction(REMOVE);
export const history_fetch_all = createAction(FETCH_ALL);

// Get data from server using middleware
export const fetchAllHistory = (user) => dispatch => {
  return restAPI.getUserAllData(user)
    .then(res => {
      dispatch(history_fetch_all(res.data.userItems));
    })
    .catch(err => {
      console.error(err);
    });
};

const initialState = {
  data: []
};

export default handleActions({
  [INSERT]: (state, action) => {
    return {
      data: state.data.concat(action.payload)
    };
  },
  [UPDATE]: (state, action) => {
    const data = state.data.map((data) => {
      if(data['_id'] !== action.payload['_id']) return data;
      else {
        data = Object.assign({}, data);
        data['date'] = action.payload['date'];
        data['time'] = action.payload['time'];
        return data;
      }
    });
    return {
      data: data
    };
  },
  [FETCH_ALL]: (state, action) => {
    return {
      data: action.payload
    }
  }
}, initialState);