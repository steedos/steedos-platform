import { UsersState } from "./users";
import { SpacesState } from "./spaces";

import { GeneralState } from "./general";

export type GlobalState = {
  entities: {
    general: GeneralState
    users: UsersState
    spaces: SpacesState
  },
  settings: any
}