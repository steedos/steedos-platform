import {Client4} from '../client';
import {GetStateFunc, DispatchFunc, ActionFunc, ActionResult, batchActions, Action} from '../types/actions';
import {SpaceTypes, UserTypes} from '../action_types';
import {Space, SpaceUser} from '../types/spaces';
import {logError} from './errors';
import {bindClientFunc, forceLogoutIfNecessary} from './helpers';
import LocalStorageStore from '../stores/local_storage_store';
import { getCurrentUserId } from '../selectors/entities/users';
import { getSpace } from '../selectors/entities/spaces';
import { getRootUrl } from '../selectors/settings';
import store from '../stores/redux_store';

import { checkRedirectUrlWhitelist } from '../utils/check';

import { hashHistory } from "../utils/hash_history";

export function selectSpace(spaceId?: string | null): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    const userId = getCurrentUserId(getState());
    if (!userId)
      return {data: false};
    let selectedSpaceId = spaceId;
    
    if (!selectedSpaceId)
      selectedSpaceId = LocalStorageStore.getPreviousSpaceId(userId);
    else {
      const space = getSpace(getState(), selectedSpaceId);
      if (!space)
        return {data: false};
    }

    dispatch({
      type: SpaceTypes.SELECT_SPACE,
      data: selectedSpaceId,
    });
    LocalStorageStore.setPreviousSpaceId(userId, selectedSpaceId);

    return {data: selectedSpaceId};
  };
}

export function acceptInvitation(spaceId, email): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    try {
        const result = await Client4.acceptInvitation(spaceId, email);
    } catch (error: any) {
        forceLogoutIfNecessary(error, dispatch, getState);
        dispatch(logError(error));
        return {error};
    }
    return {data: spaceId};
  };
}

export function declineInvitation(spaceId, email): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    try {
        const result = await Client4.declineInvitation(spaceId, email);
    } catch (error: any) {
        forceLogoutIfNecessary(error, dispatch, getState);
        dispatch(logError(error));
        return {error};
    }
    return {data: spaceId};
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
      let space:any = null;

      try {
        space = await Client4.createSpace(name);
      } catch (error: any) {
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


export function goSpaceHome(location, settings): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    const userId: any = LocalStorageStore.getItem('userId');
    const authToken: any =  LocalStorageStore.getItem('token');
    const spaceId: any =  LocalStorageStore.getItem('spaceId');
    const rootUrl: any = getRootUrl(store.getState());

    const searchParams = new URLSearchParams(location.search);
    let redirect_uri = searchParams.get("redirect_uri");
  
    if (redirect_uri){
      if(!redirect_uri.startsWith("http://") && !redirect_uri.startsWith("https://")){
        redirect_uri = window.location.origin + redirect_uri
      }
      let u = new URL(redirect_uri);

      u.searchParams.append('X-Space-Id',spaceId);
      u.searchParams.append('X-Auth-Token',authToken);
      u.searchParams.append('X-User-Id',userId);

      if(u.origin != window.location.origin){
        // 不满足指定的域名校验
        if(!checkRedirectUrlWhitelist(settings, u.origin)){
          return hashHistory.push({
            pathname: '/link',
            search: `target=${encodeURIComponent(u.toString())}`,
          });
        }
      }
      window.location.href = u.toString();
    }
    else{
      // window.location.href = rootUrl ? rootUrl : "/";
      window.location.href = "/";
    }

    return { data: true };
  }
}