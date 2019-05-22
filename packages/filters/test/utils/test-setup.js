require("source-map-support/register");
require("reflect-metadata");
const chai = require("chai");

chai.should();
chai.use(require("sinon-chai"));
chai.use(require("chai-as-promised"));