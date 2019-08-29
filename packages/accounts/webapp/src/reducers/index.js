import { combineReducers } from 'redux'
import views from './views'
import settings from './settings'

export default combineReducers({
  views,
  settings
})