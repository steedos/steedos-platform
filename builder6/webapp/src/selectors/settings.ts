import { GlobalState } from "../types/store";

export function getRootUrl(state: GlobalState) {
  return state.settings.root_url;
}
