import { UserTypes } from '../action_types/';
import { ActionFunc, DispatchFunc, GetStateFunc, batchActions } from "../types/actions";
import { UserProfile } from '../types/users';
import { Client4 } from '../client/';


export function login(loginId: string, password: string, mfaToken = ''): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
      dispatch({type: UserTypes.LOGIN_REQUEST, data: null});

      const deviceId = getState().entities.general.deviceToken;
      let data;

      try {
          data = await Client4.login(loginId, password, mfaToken, deviceId);
      } catch (error) {
          dispatch(batchActions([
              {
                  type: UserTypes.LOGIN_FAILURE,
                  error,
              },
              //logError(error),
          ]));
          return {error};
      }

      return completeLogin(data)(dispatch, getState);
  };
}


function completeLogin(data: any): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
      const user = data.user
      dispatch({
          type: UserTypes.RECEIVED_ME,
          data: user,
      });

      Client4.setUserId(user._id);
      
      let teamMembers;

      // const promises = [
      //     dispatch(getMyTeams()),
      //     dispatch(getClientConfig()),
      // ];

      // try {
      //     await Promise.all(promises);
      // } catch (error) {
      //     dispatch(batchActions([
      //         {type: UserTypes.LOGIN_FAILURE, error},
      //         //logError(error),
      //     ]));
      //     return {error};
      // }

      return {data: true};
  };
}

export function loadMe(): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
      const state = getState();

      // const deviceId = state.entities.general.deviceToken;
      // if (deviceId) {
      //     Client4.attachDevice(deviceId);
      // }

      // const promises = [
      //     dispatch(getMe()),
      //     dispatch(getMyTeams()),
      // ];

      // await Promise.all(promises);

      const {currentUserId} = getState().entities.users;
      const user = getState().entities.users.users[currentUserId];
      if (currentUserId) {
          Client4.setUserId(currentUserId);
      }

      return {data: true};
  };
}

export function logout(): ActionFunc {
  return async (dispatch: DispatchFunc) => {
      dispatch({type: UserTypes.LOGOUT_REQUEST, data: null});

      try {
          //await Client4.logout();
      } catch (error) {
          // nothing to do here
      }

      dispatch({type: UserTypes.LOGOUT_SUCCESS, data: null});

      return {data: true};
  };
}