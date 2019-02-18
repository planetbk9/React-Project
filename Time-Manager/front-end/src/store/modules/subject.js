import { createAction, handleActions } from 'redux-actions';

const INSERT = 'subject/insert';

export const subject_insert = createAction(INSERT);

const initialState = {
  subjects: []
};

export default handleActions({
  [INSERT]: (state, action) => {
    return {
      ...state,
      subjects: state.subjects.concat(action.payload)
    };
  }
}, initialState);