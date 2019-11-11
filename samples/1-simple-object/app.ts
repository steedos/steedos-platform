import "reflect-metadata";
import * as path from "path";
import {ConnectionOptions, createConnection} from "@steedos/objectql";

const options: ConnectionOptions = {
    "name": "default",
    "driver": "mongo",
    "host": "localhost",
    "port": 27017,
    "username": "",
    "password": "",
    "database": "steedos",
    // logger: "file",
    // logging: ["query", "error"],
    // logging: ["error", "schema", "query"],
    // maxQueryExecutionTime: 90,
    //synchronize: true,
    objectFiles: [path.join(__dirname, "objects")]
};

createConnection(options).then(async connection => {
    let post = {
        name: "Hello how are you?",
        body: "hello",
        likesCount: 100
    }
    connection.connect();
    let postObject = connection.getObject("post");

    postObject
        .insert(post)
        .then(post => console.log("Post has been saved: ", post));

}, error => console.log("Cannot connect: ", error));