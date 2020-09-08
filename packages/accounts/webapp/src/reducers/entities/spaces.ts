import { UserTypes, SpaceTypes } from '../../action_types/';
import { GenericAction } from '../../types/actions';
import { IDMappedObjects } from '../../types/utilities';
import { UserProfile } from '../../types/users';
import { combineReducers } from 'redux';
import { listToMap } from  '../../utils/utils';

const currentSpaceId = (state = '', action: GenericAction) => {
    switch (action.type) {
      case SpaceTypes.SELECT_SPACE:
          return action.data;
      case UserTypes.LOGOUT_SUCCESS:
        return '';
      default:
        return state;
    }
}

const spaces = (state: IDMappedObjects<UserProfile> = {}, action: GenericAction) => {
  switch (action.type) {
    case SpaceTypes.RECEIVED_SPACES_LIST:
      return Object.assign({}, state, listToMap(action.data));
    case UserTypes.LOGOUT_SUCCESS:
      return {};

    default:
      return state;
    }
}


export default combineReducers({
  currentSpaceId,
  spaces,
})