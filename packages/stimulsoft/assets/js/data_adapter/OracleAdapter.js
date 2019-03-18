exports.process = function (command, onResult) {

    var end = function (result) {
        try {
            if (connection) connection.release();
            onResult(result);
        }
        catch (e) {
        }
    }

    var onError = function (message) {
        end({ success: false, notice: message });
    }

    try {
        var connect = function (error, connection1) {
            connection = connection1;
            if (error) onError(error.message);
            else onConnect(connection);
        }

        var onConnect = function () {
            if (command.queryString) query(command.queryString);
            else end({ success: true });
        }

        var query = function (queryString) {
            connection.execute(queryString, function (error, result) {
                if (error) onError(error.message);
                else {
                    onQuery(result);
                }
            });
        }

        

        var onQuery = function (result) {
            var columns = [];
            var rows = [];
            var types = [];
            var isColumnsFill = false;
            for (var recordIndex in result.rows) {
                var row = [];
                for (var columnIndex in result.metaData) {
                    var columnName = result.metaData[columnIndex].name;
                    if (!isColumnsFill) columns.push(columnName);
                    if (types[columnIndex] != "array") types[columnIndex] = typeof result.rows[recordIndex][columnIndex];
                    if (result.rows[recordIndex][columnIndex] instanceof Uint8Array) {
                        types[columnIndex] = "array";
                        result.rows[recordIndex][columnIndex] = new Buffer(result.rows[recordIndex][columnIndex]).toString('base64');
                    }
                    row.push(result.rows[recordIndex][columnIndex]);
                }
                isColumnsFill = true;
                rows.push(row);
            }

            end({ success: true, columns: columns, rows: rows, types: types });
        }

        var getConnectionStringInfo = function (connectionString) {
            var info = { database: "", userId: "", password: "", charset: "AL32UTF8", privilege: "" };


            for (var propertyIndex in connectionString.split(";")) {
                var property = connectionString.split(";")[propertyIndex];
                if (property) {
                    var match = property.split("=");
                    if (match && match.length >= 2) {
                        match[0] = match[0].trim().toLowerCase();
                        match[1] = match[1].trim();

                        switch (match[0]) {
                            case "database":
                            case "data source":
                                info["database"] = match.splice(1, match.length).join("=");
                                break;

                            case "uid":
                            case "user":
                            case "user id":
                                info["userId"] = match[1];
                                break;

                            case "pwd":
                            case "password":
                                info["password"] = match[1];
                                break;

                            case "charset":
                                info["charset"] = match[1];
                                break;

                            case "dba privilege":
                            case "privilege":
                                var value = match[1].toLowerCase();
                                info["privilege"] = "OCI_DEFAULT";
                                if (value == "sysoper" || value == "oci_sysoper") info["privilege"] = "OCI_SYSOPER";
                                if (value == "sysdba" || value == "oci_sysdba") info["privilege"] = "OCI_SYSDBA";
                                break;
                        }
                    }
                }
            }

            return info;
        };

        command.connectionStringInfo = getConnectionStringInfo(command.connectionString);
        var oracledb = require('oracledb');
        var connection;

        oracledb.getConnection(
            {
                user: command.connectionStringInfo.userId,
                password: command.connectionStringInfo.password,
                connectString: command.connectionStringInfo.database
            }, connect);

    }
    catch (e) {
        onError(e.stack);
    }
}