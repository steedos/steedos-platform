
function checkNodeModule(id){
    try {
        require.resolve(id);
    } catch (error) {
        throw new Error(`_datasources_driver_error_notFind_${id}`);
    }
}

function checkDriver(driver){
    switch (driver) {
        case 'sqlserver':
            checkNodeModule('mssql');
            break;
        case 'postgres':
            checkNodeModule('pg');
            break;
        case 'oracle':
            checkNodeModule('oracledb');
            break;
        case 'mysql':
            checkNodeModule('mysql');
            break;
        case 'sqlite':
            checkNodeModule('sqlite3');
            break;
        default:
            break;
    }
}

module.exports = {
    checkDriver
}