import { createAction, handleActions } from 'redux-actions';
import funcs from 'utils/funcs';

const INSERT = 'subject/insert';
const CLEAR = 'subject/clear';

export const subject_insert = createAction(INSERT);
export const subject_clear = createAction(CLEAR);

const initialState = {
  subjects: []
};

export default handleActions({
  [INSERT]: (state, action) => {
    if(funcs.hasSubject(state.subjects, action.payload)) {
      return {
        ...state
      };
    } else {
      let subjects = action.payload !== '' ? state.subjects.concat(action.payload) : state.subjects;
      if(subjects.length > 10) subjects.shift();
      return {
        ...state,
        subjects
      };
    }
  },
  [CLEAR]: (state, action) => {
    return {
      subjects: []
    }
  }
}, initialState);