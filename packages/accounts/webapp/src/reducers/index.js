import { combineReducers } from 'redux'
import i18n from './i18n'
import tenant from './tenant'
import settings from './settings'

export default combineReducers({
  i18n,
  settings,
  tenant,
})