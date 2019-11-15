import "reflect-metadata";
import * as path from "path";
import {ConnectionOptions, createConnection, getConnectionManager} from "@steedos/objectql";

const options: ConnectionOptions = {
    "name": "mongo",
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

getConnectionManager().create(options).then(async connection => {
    let newPost = {
        name: "Hello how are you?",
        body: "hello",
        likesCount: 100
    }

    const post = await connection.getObject("posts")
        .insert(newPost)
    console.log(post);

    const posts = await connection.getObject("posts").find({
        fields: ['name', 'body', 'likesCount'],
        filters: [['likesCount', '>', 10]],
        top: 20,
        skip: 0,
        sort: 'likesCount desc'
    });
    console.log(posts);
    connection.close();
    
}, error => console.log("Cannot connect: ", error));

