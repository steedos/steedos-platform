import { UsersState } from "./users";
import { GeneralState } from "./general";

export type GlobalState = {
  entities: {
    general: GeneralState
    users: UsersState
  }
}