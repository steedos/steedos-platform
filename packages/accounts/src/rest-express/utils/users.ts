import { db } from '../../db';
import * as _ from 'lodash';

export const getUserSpaces = async (userId) =>{
  return await db.find("space_users", {
    filters: [["user", "=", userId],["user_accepted", "=", true]],
    fields: ["space"]
  });
}

export const getUserSpace = async (userId, spaceId)=>{
  const userSpaces = await getUserSpaces(userId);
  if(!userSpaces || userSpaces.length < 1){
    return ;
  }

  if(spaceId && _.find(userSpaces, function(o) { return o.space === spaceId; })){
    return spaceId
  }

  return userSpaces[0].space
}