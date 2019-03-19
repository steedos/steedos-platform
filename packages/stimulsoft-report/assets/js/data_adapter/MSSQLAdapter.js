exports.process = function (command, onResult) {
    
    var end = function (result) {
        try {
            if (connection) connection.close();
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
            connection = new sql.ConnectionPool(config, function (error) {
                if (error) onError(error.message);
                else onConnect();
            });
        }
        
        var query = function (queryString) {
            var request = connection.request();
            request.query(queryString, function (error, recordset) {
                if (error) onError(error.message);
                else {
                    onQuery(recordset);
                }
            });
        }
        
        var onConnect = function () {
            if (command.queryString) query(command.queryString);
            else end({ success: true });
        }
        
        var onQuery = function (recordset) {
			recordset = recordset.recordset;
            var columns = [];
            var rows = [];
			var types = [];
            var isColumnsFill = false;
			if (recordset.length > 0 && Array.isArray(recordset[0])) recordset = recordset[0];
            for (var recordIndex in recordset) {
                var row = [];
                for (var columnName in recordset[recordIndex]) {
                    if (!isColumnsFill) columns.push(columnName);	
					var columnIndex = columns.indexOf(columnName);
                    if (types[columnIndex] != "array") types[columnIndex] = typeof recordset[recordIndex][columnName];
                    if (recordset[recordIndex][columnName] instanceof Uint8Array) {
                        types[columnIndex] = "array";
                        recordset[recordIndex][columnName] = new Buffer(recordset[recordIndex][columnName]).toString('base64');
                    }
					
                    if (recordset[recordIndex][columnName] != null && typeof recordset[recordIndex][columnName].toISOString === "function") {
                        recordset[recordIndex][columnName] = recordset[recordIndex][columnName].toISOString();
                        types[columnIndex] = "datetime";
                    }

                    row.push(recordset[recordIndex][columnName]);
                }
                isColumnsFill = true;
                rows.push(row);
            }
            
            end({ success: true, columns: columns, rows: rows, types: types });
        }

        var getHostInfo = function (host) {
            const regexFull = /.*:(.*)/;
            const regexHostPort = /(.*),([0-9]+)/;
            const matchFull = regexFull.exec(host);

            if (matchFull) {
                const matchHostPort1 = regexHostPort.exec(matchFull[1]);
                if (matchHostPort1) return { host: matchHostPort1[1].trim(), port: matchHostPort1[2].trim() };
                return { host: matchFull[1].trim() };
            }
            else {
                const matchHostPort2 = regexHostPort.exec(host);
                if (matchHostPort2) return { host: matchHostPort2[1].trim(), port: matchHostPort2[2].trim() };
                return { host: host };
            }
        }

        var getConnectionStringConfig = function (connectionString) {
            var config = {
            };
            
            for (var propertyIndex in connectionString.split(";")) {
                var property = connectionString.split(";")[propertyIndex];
                if (property) {
                    var match = property.split("=");
                    if (match && match.length >= 2) {
                        match[0] = match[0].trim().toLowerCase();
                        match[1] = match[1].trim();
                        
                        switch (match[0]) {
                            case "data source":
                            case "server":
                                var hostInfo = getHostInfo(match[1]);
                                config["server"] = hostInfo.host;
                                if ("port" in hostInfo) config["port"] = hostInfo.port;
                                break;

                            case "database":
                            case "initial catalog":
                                config["database"] = match[1];
                                break;

                            case "uid":
                            case "user":
                            case "user id":
                                config["user"] = match[1];
                                break;

                            case "pwd":
                            case "password":
                                config["password"] = match[1];
                                break;

                            case "encrypt":
                                config.options["encrypt"] = match[1];
                                break;
                        }
                    }
                }
            }
            
            return config;
        };
        
        var sql = require('mssql');
        var config = getConnectionStringConfig(command.connectionString);
        
        connect();
    }
    catch (e) {
        onError(e.stack);
    }
}