import {expect} from "chai";
import {getConnectionManager} from "typeorm";
import {Connection} from "typeorm/connection/Connection";
import {EntityManager} from "typeorm/entity-manager/EntityManager";

import {closeTestingConnections, createTestingConnections, setupSingleTestingConnection} from "../../utils/test-utils";


describe.skip("Connection", () => {
    describe("before connection is established", function() {

        let connection: Connection;
        before(async () => {
            const options = setupSingleTestingConnection("mongodb", {
                name: "default",
                entities: []
            });
            if (!options)
                return;

            connection = getConnectionManager().create(options);
        });
        after(() => {
            if (connection && connection.isConnected)
                return connection.close();

            return Promise.resolve();
        });

        it("connection.isConnected should be false", () => {
            if (!connection)
                return;

            connection.isConnected.should.be.false;
        });

        // todo: they aren't promises anymore
        /*it("import entities, entity schemas, subscribers and naming strategies should work", () => {
        return Promise.all([
        connection.importEntities([Post]).should.be.fulfilled,
        connection.importEntitySchemas([]).should.be.fulfilled,
        connection.importSubscribers([]).should.be.fulfilled,
        connection.importNamingStrategies([]).should.be.fulfilled,
        connection.importEntitiesFromDirectories([]).should.be.fulfilled,
        connection.importEntitySchemaFromDirectories([]).should.be.fulfilled,
        connection.importSubscribersFromDirectories([]).should.be.fulfilled,
        connection.importNamingStrategiesFromDirectories([]).should.be.fulfilled
        ]);
        });*/


        it.skip("should not be able to use repositories", () => {
            if (!connection)
                return;

            // expect(() => connection.getRepository(Post)).to.throw(NoConnectionForRepositoryError);
            // expect(() => connection.getTreeRepository(Category)).to.throw(NoConnectionForRepositoryError);
            // expect(() => connection.getReactiveRepository(Post)).to.throw(NoConnectionForRepositoryError);
            // expect(() => connection.getReactiveTreeRepository(Category)).to.throw(NoConnectionForRepositoryError);
        });

        it("should be able to connect", () => {
            if (!connection)
                return;
            return connection.connect().should.be.fulfilled;
        });
    });

    describe("after connection is established successfully", function() {

        let connections: Connection[];
        beforeEach(() => createTestingConnections({ entities: [], schemaCreate: true, dropSchema: true }).then(all => connections = all));
        afterEach(() => closeTestingConnections(connections));

        it("connection.isConnected should be true", () => connections.forEach(connection => {
            connection.isConnected.should.be.true;
        }));

        it("entity manager and reactive entity manager should be accessible", () => connections.forEach(connection => {
            expect(connection.manager).to.be.instanceOf(EntityManager);
            // expect(connection.reactiveEntityManager).to.be.instanceOf(ReactiveEntityManager);
        }));

        it("should not be able to connect again", () => connections.forEach(connection => {
            return connection.connect().should.be.rejected; // CannotConnectAlreadyConnectedError
        }));

        it("should be able to close a connection", async () => Promise.all(connections.map(connection => {
            return connection.close();
        })));

    });
});