import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "typeorm";
import {MongoRepository} from "typeorm/repository/MongoRepository";

import {PostEntity} from "./entity/PostEntity";
// import {Post} from "./model/Post";
import {CategoryEntity} from "./entity/CategoryEntity";

describe("entity schemas > basic functionality", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        enabledDrivers: ["mongodb"],
        entities: [
            PostEntity,
            CategoryEntity
        ],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("connection should return mongo repository when requested", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(PostEntity);
        postRepository.should.be.instanceOf(MongoRepository);
    })));

    it("entity manager should return mongo repository when requested", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.manager.getRepository(PostEntity);
        postRepository.should.be.instanceOf(MongoRepository);
    })));

    it("should perform basic operations with entity", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(PostEntity);

        // save few posts
        const firstPost = postRepository.create({
            title: "Post #1",
            text: "Everything about post #1"
        });
        await postRepository.save(firstPost);

        // save few posts
        const secondPost = {
            title2: "Post #2",
            text: "Everything about post #2",
            tags: ["a","b"]
        };
        await postRepository.save(secondPost);

        const categoryRepository = connection.getMongoRepository(CategoryEntity);
        const category = categoryRepository.create({
            name: "First Category"
        });
        await categoryRepository.save(category);


        const postMongoRepository = connection.getMongoRepository(PostEntity);
        const cursor = postMongoRepository.createEntityCursor({
            title: "Post #1"
        });

        const loadedPosts = await cursor.toArray();
        loadedPosts.length.should.be.equal(1);
        //loadedPosts[0].should.be.instanceOf(Post);
        loadedPosts[0].id.should.be.eql(firstPost.id);
        loadedPosts[0].title.should.be.equal("Post #1");
        loadedPosts[0].text.should.be.equal("Everything about post #1");


    })));

});
