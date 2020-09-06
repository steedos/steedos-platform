import { GlobalState } from "../../types/store";

export function getSpaceUsers(state: GlobalState) {
  return state.entities.spaces.mySpaceUsers;
}

export function getCurrentSpace(state: GlobalState) {
  return state.entities.spaces.spaces[getCurrentSpaceId(state)];
}

export function getCurrentSpaceId(state: GlobalState) {
  return state.entities.spaces.currentSpaceId;
}
