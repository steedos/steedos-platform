import {$ID, IDMappedObjects, RelationOneToMany, RelationOneToOne, Dictionary} from './utilities';

export type Space = {
  _id: string;
  name: string;
};

export type SpaceUser = {
  _id: string
  space: string;
  user: string;
};

export type SpacesState = {
  currentSpaceId: string;
  spaces: IDMappedObjects<Space>;
  mySpaces: IDMappedObjects<Space>;
  mySpacesCount: number
};
