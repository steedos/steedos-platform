exports.getAppBranch = function(appPath){
    switch (appPath) {
        case 'steedos-app-admin':
            return '1.23';
        case 'steedos-app-contract':
            return '1.23';
        case 'steedos-app-crm':
            return '1.23';
        default:
            return 'master';
    }
}