import watch from './watch';
import history from './history';
import subject from './subject';
import db from './db';
import common from './common';
import { combineReducers } from 'redux';

export default combineReducers({
  watch,
  history,
  subject,
  db,
  common
});