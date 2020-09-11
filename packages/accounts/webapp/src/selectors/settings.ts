import { GlobalState } from "../types/store";

export function getRootUrl(state: GlobalState) {
  console.log(state)
  return state.settings.root_url;
}
