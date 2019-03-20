import watch from './watch';
import subject from './subject';
import db from './db';
import common from './common';
import { combineReducers } from 'redux';

export default combineReducers({
  watch,
  subject,
  db,
  common
});