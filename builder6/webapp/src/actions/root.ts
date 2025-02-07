import * as UserActions from './users';
import { loadSettings } from './settings';
import LocalStorageStore from '../stores/local_storage_store';
import { Client4 } from '../client';
import { Dispatch } from 'redux';

export function loadMeAndConfig() {
  return async (dispatch: Dispatch<any>): Promise<any[]> => {
    const token: string | null = LocalStorageStore.getItem('token');
    if (token) {
      Client4.setToken(token);
    }

    const promises: Promise<any>[] = [
      dispatch(loadSettings()),
    ];

    const resolvedPromises = await Promise.all(promises);
    if (LocalStorageStore.getWasLoggedIn()) {
      resolvedPromises.push(await dispatch(UserActions.loadMe()));
    }
    return resolvedPromises;
  };
}
