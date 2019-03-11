import * as bodyParser from "body-parser";
import "reflect-metadata"; // this shim is required
import {createExpressServer} from "routing-controllers";
import {ODataController} from "./ODataController";

// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
   controllers: [ODataController] // we specify controllers we want to use
});
app.use(bodyParser.json());

// run express application on port 3000
app.listen(3000);