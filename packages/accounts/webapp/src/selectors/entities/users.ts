
import { GlobalState } from "../../types/store";

export function getCurrentUser(state: GlobalState) {
  return state.entities.users.users[getCurrentUserId(state)];
}

export function getCurrentUserId(state: GlobalState) {
  return state.entities.users.currentUserId;
}

export function getUsers(state: GlobalState) {
  return state.entities.users.users;
}
