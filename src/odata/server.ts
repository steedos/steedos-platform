import * as bodyParser from "body-parser";
import "reflect-metadata"; // this shim is required
import { createConnection } from "typeorm";

import { createExpressServer, Action } from "routing-controllers";
import { ODataController } from "./ODataController";

import { getFromContainer } from "../container";
import { ODataManager } from "./ODataManager";

/**
 * Gets a ObjectSchemaManager which creates object schema.
 */
export function getODataManager(): ODataManager {
   return getFromContainer(ODataManager);
}

createConnection("default").then(connection => {
});

// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
   controllers: [ODataController], // we specify controllers we want to use
   currentUserChecker: async (action: Action) => {
      // here you can use request/response objects from action
      // you need to provide a user object that will be injected in controller actions
      // demo code:
      // const token = action.request.headers["authorization"];
      // return getEntityManager().findOneByToken(User, token);
      return { _id: 'hwJJbdc2WmFriMzb6' };
   }
});
app.use(bodyParser.json());

app.listen(3001);

console.log("Express application is up and running on port 3001");