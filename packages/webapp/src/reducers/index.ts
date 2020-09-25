import { combineReducers } from 'redux'
import entities from './entities'
import i18n from './i18n'
import settings from './settings'
import requests from './requests'

export default combineReducers({
  entities,
  i18n,
  settings,
  requests,
})