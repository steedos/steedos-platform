import {
  $ID,
  IDMappedObjects,
  RelationOneToMany,
  RelationOneToOne,
  Dictionary,
} from "./utilities";

export type UserProfile = {
  authToken: any;
  spaceId: any;
  _id: string;
  create_at: number;
  update_at: number;
  delete_at: number;
  username: string;
  password: string;
  email: string;
  email_verified: boolean;
  name: string;
  failed_attempts: number;
  locale: string;
};

export type UsersState = {
  currentUserId: string;
  users: IDMappedObjects<UserProfile>;
};
