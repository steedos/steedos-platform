exports.process = function (command, onResult) {
    
    var end = function (result) {
        try {
            if (connection) connection.end();
            onResult(result);
        }
        catch (e) {
        }
    }
    
    var onError = function (message) {
        end({ success: false, notice: message });
    }
    
    try {
        var connect = function () {
            connection.connect(function (error) {
                if (error) onError(error.message);
                else onConnect();
            });
        }
        
        var query = function (queryString) {
            connection.query("USE " + command.connectionStringInfo.database);
            //queryString = queryString.replace(/\'/gi, "\"");
            connection.query(queryString, function (error, rows, fields) {
                if (error) onError(error.message);
                else {
                    onQuery(rows, fields);
                }
            });
        }
        
        var onConnect = function () {
            if (command.queryString) query(command.queryString);
            else end({ success: true });
        }
        
        var onQuery = function (recordset, fields) {
            var columns = [];
            var rows = [];
            var types = [];
            //var isColumnsFill = false;

            for (var columnIndex in fields) {
                var column = fields[columnIndex]
                columns.push(column.name);
                

                switch (column.type) {
                    case 0x01: // aka TINYINT, 1 byte
                        types[columnIndex] = "boolean"; break;

                    case 0x02: // aka SMALLINT, 2 bytes
                    case 0x03: // aka INT, 4 bytes
                    case 0x05: // aka DOUBLE, 8 bytes
                    case 0x08: // aka BIGINT, 8 bytes
                    case 0x09: // aka MEDIUMINT, 3 bytes
                    case 0x10: // aka BIT, 1-8 byte
                        types[columnIndex] = "int"; break;

                    case 0x00: // aka DECIMAL
                    case 0xf6: // aka DECIMAL
                    case 0x04: // aka FLOAT, 4-8 bytes
                        types[columnIndex] = "number"; break;

                    case 0x0f: // aka VARCHAR (?)
                    case 0xfd: // aka VARCHAR, VARBINARY
                    case 0xfe: // aka CHAR, BINARY
                        types[columnIndex] = "string"; break;

                    case 0x0a: // aka DATE
                    case 0x0b: // aka TIME
                    case 0x13: // aka TIME with fractional seconds
                    case 0x0c: // aka DATETIME
                    case 0x12: // aka DATETIME with fractional seconds
                    case 0x0d: // aka YEAR, 1 byte (don't ask)
                    case 0x0e: // aka ?
                        types[columnIndex] = "datetime"; break;

                    case 0x07: // aka TIMESTAMP
                    case 0x11: // aka TIMESTAMP with fractional seconds
                    case 0xf5: // aka JSON
                    case 0x06: // NULL (used for prepared statements, I think)
                    case 0xf7: // aka ENUM
                    case 0xf8: // aka SET
                    case 0xff: // aka GEOMETRY
                        types[columnIndex] = "string"; break;

                    /*case 0xf9: // aka TINYBLOB, TINYTEXT
                    case 0xfa: // aka MEDIUMBLOB, MEDIUMTEXT
                    case 0xfb: // aka LONGBLOG, LONGTEXT
                    case 0xfc: // aka BLOB, TEXT
                        types[columnIndex] = "array"; break;*/
                }
            }

			if (recordset.length > 0 && Array.isArray(recordset[0])) recordset = recordset[0];
            for (var recordIndex in recordset) {
                var row = [];
                for (var columnName in recordset[recordIndex]) {
                    //if (!isColumnsFill) columns.push(columnName);
                    var columnIndex1 = columns.indexOf(columnName);
                    if (types[columnIndex1] != "array") types[columnIndex1] = typeof recordset[recordIndex][columnName];
                    if (recordset[recordIndex][columnName] instanceof Uint8Array) {
                        types[columnIndex1] = "array";
                        recordset[recordIndex][columnName] = new Buffer(recordset[recordIndex][columnName]).toString('base64');
                    }
					
                    if (recordset[recordIndex][columnName] != null && typeof recordset[recordIndex][columnName].toISOString === "function") {
                        recordset[recordIndex][columnName] = recordset[recordIndex][columnName].toISOString();
                        types[columnIndex1] = "datetime";
                    }

                    row.push(recordset[recordIndex][columnName]);
                }
                //isColumnsFill = true;
                rows.push(row);
            }
            
            end({ success: true, columns: columns, rows: rows, types: types });
        }
        
        var getConnectionStringInfo = function (connectionString) {
            var info = { host: "localhost", port: "3306", charset: "utf8" };
            
            for (var propertyIndex in connectionString.split(";")) {
                var property = connectionString.split(";")[propertyIndex];
                if (property) {
                    var match = property.split("=");
                    if (match && match.length >= 2) {
                        match[0] = match[0].trim().toLowerCase();
                        match[1] = match[1].trim();
                        
                        switch (match[0]) {
                            case "server":
                            case "host":
                            case "location":
                                info["host"] = match[1];
                                break;

                            case "port":
                                info["port"] = match[1];
                                break;

                            case "database":
                            case "data source":
                                info["database"] = match[1];
                                break;

                            case "uid":
                            case "user":
                            case "username":
                            case "userid":
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
                        }
                    }
                }
            }
            
            return info;
        };

        var mysql = require('mysql');
        command.connectionStringInfo = getConnectionStringInfo(command.connectionString);

        var connection = mysql.createConnection({
            host: command.connectionStringInfo.host,
            user: command.connectionStringInfo.userId,
            password: command.connectionStringInfo.password,
            port: command.connectionStringInfo.port,
            charset: command.connectionStringInfo.charset,
            database: command.connectionStringInfo.database
        });
        
        connect();
        
        
    }
    catch (e) {
        onError(e.stack);
    }
}