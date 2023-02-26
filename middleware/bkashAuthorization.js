const globals = require("node-global-storage");
const jwt_decode = require("jwt-decode");
const grantToken = require("../action/grantToken.js");

const authCheck = async (req, res, next) => {
  let id_token = globals.get("id_token");

  console.log("out", id_token);
  if (!id_token) {
    console.log("in");
    await grantToken();
  } else {
    console.log("2nd in");
    const decodedToken = jwt_decode(id_token);
    if (decodedToken.exp < Date.now() / 1000) {
      console.log("3rd in");
      await grantToken();
    } else {
      console.log("You already have a token !!");
    }
  }
  next();
};

module.exports = authCheck;
