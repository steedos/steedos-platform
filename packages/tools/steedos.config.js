module.exports = {
    datasources: {
        default: {
            driver: 'mongo', 
            url: 'mongodb://127.0.0.1/steedos',
            objectFiles: [__dirname + "/../standard-objects"]
        },
        rbzc: {
            driver: "sqlserver",
			options: {
				tdsVersion: "7_2",
				useUTC: true
			},
            url: "mssql://sa:hotoainc.@192.168.0.190/hotoa_main_stock",
            objectFiles: ["G:/projects/steedos-contracts-app/stock"]
        }
    },
    getRoles: function(userId){
        return ['admin']
    }
}