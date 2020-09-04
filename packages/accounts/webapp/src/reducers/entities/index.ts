import users from './users';
import general from './general';
import { combineReducers } from 'redux';

export default combineReducers({
  general,
  users
})