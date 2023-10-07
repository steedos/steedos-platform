const utils = require('./utils');

async function exec() {
  let version = null;
  try {
    version = await utils.getCurrentSteedosVersion();
  } catch (err) {
    console.error("Error fetching current Steedos version", err);
    process.exit(1);
  }
  if (version) {
    console.log(version);
  }
  else {
    console.error("Error: could not find the current Steedos version")
    process.exit(1);
  }
}

module.exports = {
  exec,
};
