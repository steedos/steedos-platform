
import * as UserActions from '../actions/users';
import { loadSettings } from '../actions/settings';
import LocalStorageStore from '../stores/local_storage_store';
import {Client4} from '../client';

export function loadMeAndConfig() {
  return async (dispatch) => {

      const token = LocalStorageStore.getItem('token')
      if (token)
        Client4.setToken(token);

      // if any new promise needs to be added please be mindful of the order as it is used in root.jsx for redirection
      const promises = [
          dispatch(loadSettings()),
          // dispatch(getLicenseConfig()),
      ];

      // // need to await for clientConfig first as it is required for loadMe
      const resolvedPromises = await Promise.all(promises);
      if (LocalStorageStore.getWasLoggedIn()) {
        resolvedPromises.push(await dispatch(UserActions.loadMe()));
      }

      return resolvedPromises;
  };
}

export function initServer(spaceId, apiKey) {
  return async (dispatch) => {
    const promises = [
      dispatch(async () => {
        return await Client4.doFetch(`${Client4.getBaseRoute()}/initServer`, {
          method: 'POST', body: JSON.stringify({
            spaceId,
            apiKey
          })
        });
      }),
    ];
    const resolvedPromises = await Promise.all(promises);
    const result = resolvedPromises[0];
    if (result && result.success != true) {
      return { error: result.error };
    }
    resolvedPromises.push(await dispatch(loadSettings()));
    return resolvedPromises;
  };
}