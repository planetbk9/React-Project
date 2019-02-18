import { createAction, handleActions } from 'redux-actions';
import * as restAPI from 'utils/restAPI';

const INSERT_ALL = 'db/insert_all';
const UPDATE = 'db/update';

export const db_insert_all = createAction(INSERT_ALL);
export const db_update = createAction(UPDATE);

const initialState = {
  user: 'kevin.koo',
  userItems: []
};

export const fetchDB = (user) => dispatch => {
  return restAPI.getUserAllData(user)
  .then(res => {
    dispatch(db_insert_all(res.data.userItems));
    return res.data;
  });
};

export default handleActions({
  [INSERT_ALL]: (state, action) => {
    return {
      ...state,
      userItems: action.payload
    };
  },
  [UPDATE]: (state, action) => {
    return {
      ...state,
      
    }
  }
}, initialState);