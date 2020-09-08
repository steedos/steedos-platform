import {Client4} from '../client';
import {GetStateFunc, DispatchFunc, ActionFunc, ActionResult, batchActions, Action} from '../types/actions';
import {SpaceTypes, UserTypes} from '../action_types';
import {Space, SpaceUser} from '../types/spaces';
import {bindClientFunc, forceLogoutIfNecessary} from './helpers';

export function selectSpace(space: Space | string): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
      const spaceId = (typeof space === 'string') ? space : space._id;
      dispatch({
          type: SpaceTypes.SELECT_SPACE,
          data: spaceId,
      });

      return {data: true};
  };
}

export function getMySpaces(): ActionFunc {
  return bindClientFunc({
      clientFunc: Client4.getMySpaces,
      onRequest: SpaceTypes.MY_SPACES_REQUEST,
      onSuccess: [SpaceTypes.RECEIVED_SPACES_LIST, SpaceTypes.MY_SPACES_SUCCESS],
      onFailure: SpaceTypes.MY_SPACES_FAILURE,
  });
}