import users from './users';
import spaces from './spaces';
import general from './general';
import { combineReducers } from 'redux';

export default combineReducers({
  general,
  users,
  spaces
})