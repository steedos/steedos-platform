import { GlobalState } from "../../types/store";

export function getSpaces(state: GlobalState) {
  return state.entities.spaces.spaces;
}

export function getMySpaces(state: GlobalState) {
  return Object.values(state.entities.spaces.spaces);
}

export function getSpaceCount(state: GlobalState) {
  return Object.keys(state.entities.spaces.spaces).length;
}

export function getCurrentSpace(state: GlobalState) {
  return state.entities.spaces.spaces[getCurrentSpaceId(state)];
}

export function getCurrentSpaceId(state: GlobalState) {
  return state.entities.spaces.currentSpaceId;
}

export function getSpace(state: GlobalState, spaceId: string) {
  return state.entities.spaces.spaces[spaceId];
}
