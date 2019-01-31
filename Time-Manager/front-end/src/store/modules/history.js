import { createAction, handleActions } from 'redux-actions';

const INSERT = 'history/insert';
const UPDATE = 'history/update';
const REMOVE = 'history/update';

export const insert = createAction(INSERT);
export const update = createAction(UPDATE);
export const remove = createAction(REMOVE);

const initialState = {
  items: []
};

export default handleActions({
  [INSERT]: (state, action) => {
    return {
      items: state.items.concat(action.payload)
    };
  }
}, initialState);