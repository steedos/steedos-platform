export { Objects, ObjectManager } from './object';
export { Apps, AppManager } from './app';
export { Reports, ReportManager } from './report';
export { Triggers, TriggerManager } from './trigger';
export { Validators, ValidatorManager } from './validator';

export * from "./module";

require('./validator').ValidatorManager.loadCoreValidators();

import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes";

// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests
createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register all application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.path, (request: Request, response: Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    });

    // run app
    app.listen(3000);

    console.log("Express application is up and running on port 3000");

}).catch(error => console.log("TypeORM connection error: ", error));

