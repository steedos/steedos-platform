
import * as UserActions from '../actions/users';

export function loadMeAndConfig() {
  return async (dispatch) => {
      // if any new promise needs to be added please be mindful of the order as it is used in root.jsx for redirection
      const promises = [
          // dispatch(getClientConfig()),
          // dispatch(getLicenseConfig()),
      ];

      // // need to await for clientConfig first as it is required for loadMe
      const resolvedPromises = await Promise.all(promises);
      if (document.cookie.indexOf('X-User-Id=') > -1) {
          resolvedPromises.push(await dispatch(UserActions.loadMe()));
      }

      return resolvedPromises;
  };
}