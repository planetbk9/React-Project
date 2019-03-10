import { createAction, handleActions } from 'redux-actions';
import * as restAPI from 'utils/restAPI';

const PAGE = 'common/page';
const MODAL = 'common/modal';
const LOGIN = 'common/login';
const LOGOUT = 'common/logout';
const MONTH = 'common/month';

export const common_page = createAction(PAGE);
export const common_modal = createAction(MODAL);
export const common_login = createAction(LOGIN);
export const common_logout = createAction(LOGOUT);
export const common_month = createAction(MONTH);

export const registerUser = (id, password) => dispatch => {
  return restAPI.checkUser(id)
  .then(res => {
    if(!res.data) return {id, password};
    else {
      alert('존재하는 ID 입니다.');
      throw new Error('User already exist');
    }
  })
  .then(res => {
    if(!res) throw new Error('response is null');
    return restAPI.addUser(res);
  })
  .then(res => {
    if(!res) throw new Error('response is null');
    else dispatch(common_login(res.data));
    return res.data;
  });
};

export const loginUser = (id, password) => dispatch => {
  return restAPI.loginUser(id, password)
  .then(res => {
    if(res.data.result === 0) {
      alert(res.data.message);
      throw new Error(res.data.message);
    } else return res.data;
  })
  .then(id => {
    if(!id) throw new Error('id is ' + id);
    else {
      dispatch(common_login(id));
      return id;
    }
  });
}

export const changeUserInfo = (id, password) => dispatch => {
  return restAPI.checkUser(id)
  .then(res => {
    if(!res || !res.data) throw new Error('존재하지 않는 아이디입니다.');
    else return restAPI.changeUserInfo(res.data, password);
  })
  .then(res => {
    if(res.data.result === 0) throw new Error(res.data.message);
    return id;
  });
}

const screen = ['home', 'report'];
const user = sessionStorage.getItem("timemanager_loggedin");
const initialState = {
  screen: screen[0],
  modal: false,
  modalType: '',
  state: user ? 'login' : 'logout',
  reportDateObj: new Date()
};


export default handleActions({
  [PAGE]: (state, action) => {
    return {
      ...state,
      screen: screen[action.payload]
    };
  },
  [MODAL]: (state, action) => {
    return {
      ...state,
      modal: action.payload['modal'],
      modalType: action.payload['modalType']
    }
  },
  [LOGIN]: (state, action) => {
    sessionStorage.setItem("timemanager_loggedin", action.payload);
    return {
      ...state,
      user: action.payload,
      state: 'login'
    }
  },
  [LOGOUT]: (state, action) => {
    sessionStorage.removeItem("timemanager_loggedin");
    return {
      ...state,
      user: '',
      userItems: [],
      state: 'logout'
    }
  },
  [MONTH]: (state, action) => {
    const dateObj = state.reportDateObj;
    dateObj.setMonth(dateObj.getMonth() + action.payload);
    return {
      ...state,
      reportDateObj: new Date(dateObj)
    }
  }
}, initialState);