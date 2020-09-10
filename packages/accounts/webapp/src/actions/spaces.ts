import {Client4} from '../client';
import {GetStateFunc, DispatchFunc, ActionFunc, ActionResult, batchActions, Action} from '../types/actions';
import {SpaceTypes, UserTypes} from '../action_types';
import {Space, SpaceUser} from '../types/spaces';
import {logError} from './errors';
import {bindClientFunc, forceLogoutIfNecessary} from './helpers';
import LocalStorageStore from '../stores/local_storage_store';
import { getCurrentUserId } from '../selectors/entities/users';
import { getSpace } from '../selectors/entities/spaces';

export function selectSpace(spaceId?: string | null): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    const userId = getCurrentUserId(getState());
    if (!userId)
      return
    let selectedSpaceId = spaceId;
    
    if (!selectedSpaceId)
      selectedSpaceId = LocalStorageStore.getPreviousSpaceId(userId);
    const space = getSpace(getState(), selectedSpaceId);
    if (!space)
      return {data: false};

    dispatch({
      type: SpaceTypes.SELECT_SPACE,
      data: selectedSpaceId,
    });
    LocalStorageStore.setPreviousSpaceId(userId, selectedSpaceId);

    return {data: selectedSpaceId};
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


export function createSpace(name: string): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
      let space = null;

      try {
        space = await Client4.createSpace(name);
      } catch (error) {
          forceLogoutIfNecessary(error, dispatch, getState);
          dispatch(logError(error));
          return {error};
      }

      if (space && space._id) {
        const promises = [
          dispatch(getMySpaces()),
          dispatch(selectSpace(space._id)),
        //   dispatch(getClientConfig()),
        ];
  
        try {
            await Promise.all(promises);
        } catch (error) {
            return {error};
        }
      }

      return {data: space};
  };
}
