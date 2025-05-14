import * as _ from "lodash";
import { getObject } from "@steedos/objectql";

export const getHandlersByUserAndRoles = async (
  user_id,
  role_ids,
  space_id,
) => {
  let user_ids = [];

  for (const role_id of role_ids) {
    const flowRole = await getObject("flow_roles").findOne(role_id);
    if (flowRole) {
      const users = await getHandlersByUserAndRole(user_id, role_id, space_id);
      if (users.length > 0) {
        return (user_ids = user_ids.concat(users));
      }
    } else {
      throw new Error("role_id已经被删除");
    }
  }

  if (user_ids.length > 0) {
    user_ids = _.uniq(user_ids);
    return user_ids;
  } else {
    throw new Error("根据user_id和role_ids没查到对应的处理人");
  }
};

export const getHandlersByUserAndRole = async (user_id, role_id, space_id) => {
  const orgs = await getObject("organizations").find({
    filters: [
      ["space", "=", space_id],
      ["users", "=", user_id],
    ],
  });

  let user_ids = [];
  for (const org of orgs) {
    const users = await getHandlersByOrgAndRole(org._id, role_id, space_id);
    if (users.length > 0) {
      return (user_ids = user_ids.concat(users));
    }
  }

  user_ids = _.uniq(user_ids);
  return user_ids;
};

export const getHandlersByOrgAndRole = async (org_id, role_id, space_id) => {
  const org = await getObject("organizations").findOne(org_id);
  let positions = await getObject("flow_positions").find({
    filters: [
      ["space", "=", space_id],
      ["org", "=", org_id],
      ["role", "=", role_id],
    ],
  });

  let user_ids = [];
  _.each(positions, function (position) {
    return (user_ids = user_ids.concat(position.users));
  });
  if (user_ids.length === 0) {
    const parents = org.parents;
    for (const parent_id of parents) {
      positions = await getObject("flow_positions").find({
        filters: [
          ["space", "=", space_id],
          ["org", "=", parent_id],
          ["role", "=", role_id],
        ],
      });
      if (positions.length > 0) {
        return _.each(positions, function (position) {
          return (user_ids = user_ids.concat(position.users));
        });
      }
    }
  }
  user_ids = _.uniq(user_ids);
  return user_ids;
};
