import {combineReducers} from 'redux';
import { GenericAction } from '../../types/actions';
import { GeneralTypes, UserTypes } from '../../action_types/';


// function config(state: Partial<ClientConfig> = {}, action: GenericAction) {
//   switch (action.type) {
//   case GeneralTypes.CLIENT_CONFIG_RECEIVED:
//       return Object.assign({}, state, action.data);
//   case UserTypes.LOGIN: // Used by the mobile app
//   case GeneralTypes.SET_CONFIG_AND_LICENSE:
//       return Object.assign({}, state, action.data.config);
//   case GeneralTypes.CLIENT_CONFIG_RESET:
//   case UserTypes.LOGOUT_SUCCESS:
//       return {};
//   default:
//       return state;
//   }
// }

function appState(state = false, action: GenericAction) {
  switch (action.type) {
  case GeneralTypes.RECEIVED_APP_STATE:
      return action.data;

  default:
      return state;
  }
}

function credentials(state: any = {}, action: GenericAction) {
  switch (action.type) {
  case GeneralTypes.RECEIVED_APP_CREDENTIALS:
      return Object.assign({}, state, action.data);

  case UserTypes.LOGIN: // Used by the mobile app
      return {
          url: action.data.url,
      };
  case UserTypes.LOGOUT_SUCCESS:
      return {};
  default:
      return state;
  }
}


function deviceToken(state = '', action: GenericAction) {
  switch (action.type) {
  case GeneralTypes.RECEIVED_APP_DEVICE_TOKEN:
      return action.data;
  default:
      return state;
  }
}

function serverVersion(state = '', action: GenericAction) {
  switch (action.type) {
  case GeneralTypes.RECEIVED_SERVER_VERSION:
      return action.data;
  case UserTypes.LOGOUT_SUCCESS:
      return '';
  default:
      return state;
  }
}

export default combineReducers({
  appState,
  credentials,
  deviceToken,
  serverVersion,
});