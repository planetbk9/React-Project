import { createAction, handleActions } from 'redux-actions';
import * as restAPI from 'utils/restAPI';

const INSERT_ALL = 'db/insert_all';
const UPDATE = 'db/update';
const CLEAR = 'db/clear';

export const db_insert_all = createAction(INSERT_ALL);
export const db_update = createAction(UPDATE);
export const db_clear = createAction(CLEAR);

export const fetchDB = (user) => dispatch => {
  return restAPI.getUserAllData(user)
  .then(res => {
    if(!res || !res.data || !res.data.userItems) return null;
    dispatch(db_insert_all({user: res.data.user, userItems: res.data.userItems}));
    return res.data;
  });
};

const user = sessionStorage.getItem("timemanager_loggedin");
const initialState = {
  user: user ? user : '',
  userItems: []
};

export default handleActions({
  [INSERT_ALL]: (state, action) => {
    return {
      ...state,
      user: action.payload['user'],
      userItems: action.payload['userItems']
    };
  },
  [UPDATE]: (state, action) => {
    return {
      ...state,
    }
  },
  [CLEAR]: (state, action) => {
    return {
      user: '',
      userItems: []
    }
  }
}, initialState);