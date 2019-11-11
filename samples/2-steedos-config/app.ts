import "reflect-metadata";
import {createConnection} from "@steedos/objectql";

createConnection('default').then(async connection => {
    let post = {
        name: "Hello how are you?",
        body: "hello",
        likesCount: 100
    }
    let postObject = connection.getObject("post");

    postObject
        .insert(post)
        .then(post => console.log("Post has been saved: ", post));

    connection.close();
    
}, error => console.log("Cannot connect: ", error));

