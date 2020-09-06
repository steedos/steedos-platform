import { GlobalState } from "../../types/store";

export function getSpaceUsers(state: GlobalState) {
  return state.entities.spaces.mySpaceUsers;
}
