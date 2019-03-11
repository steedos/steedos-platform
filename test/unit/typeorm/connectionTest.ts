import {getConnectionManager} from "typeorm";
import {Connection} from "typeorm/connection/Connection";
import {setupSingleTestingConnection} from "../../utils/test-utils";



describe("before connection is established", function() {

    let connection: Connection;
    before(async () => {
        const options = setupSingleTestingConnection("mysql", {
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

    it("should not be able to close", () => {
        if (!connection)
            return;
        return connection.close().should.be.rejected; // CannotCloseNotConnectedError
    });

    it("should not be able to sync a schema", () => {
        if (!connection)
            return;
        return connection.synchronize().should.be.rejected; // CannotCloseNotConnectedError
    });

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