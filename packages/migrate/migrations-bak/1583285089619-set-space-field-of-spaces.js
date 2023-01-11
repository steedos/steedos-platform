const db = require("../db");

async function setSpaceField() {
  let spaces = await db.find('spaces', {});
  for (let space of spaces) {
    await db.updateOne('spaces', space._id, { space: space._id });
  }
}

module.exports.up = async function (next) {
  try {
    await setSpaceField();
  } catch (error) {
    console.log(error);
  }

};

module.exports.down = async function (next) {

};