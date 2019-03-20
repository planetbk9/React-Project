import { createAction, handleActions } from 'redux-actions';
import * as restAPI from 'utils/restAPI';
import funcs from 'utils/funcs';

const INSERT_ALL = 'db/insert_all';
const UPDATE = 'db/update';
const CLEAR = 'db/clear';
const DELETE = 'db/delete';

export const db_insert_all = createAction(INSERT_ALL);
export const db_update = createAction(UPDATE);
export const db_clear = createAction(CLEAR);
export const db_delete = createAction(DELETE);

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
    let newUserItems = [];
    newUserItems = Object.assign(newUserItems, state.userItems);
    funcs.updateItem(newUserItems, action.payload['date'], action.payload['_id'], action.payload['newObj']);
    return {
      ...state,
      userItems: newUserItems
    }
  },
  [DELETE]: (state, action) => {
    let newUserItems = [];
    newUserItems = Object.assign(newUserItems, state.userItems);
    funcs.deleteItem(newUserItems, action.payload['date'], action.payload['_id']);
    return {
      ...state,
      userItems: newUserItems
    }
  },
  [CLEAR]: (state, action) => {
    return {
      user: '',
      userItems: []
    }
  }
}, initialState);