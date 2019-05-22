const DevExpress = require("devextreme/bundles/modules/core");
const DevExpressData = require("devextreme/bundles/modules/data");
const DevExpressODataStore = require("devextreme/bundles/modules/data.odata");

DevExpress.data = DevExpressData;
DevExpress.data.odata = DevExpressODataStore;

export default DevExpress;
