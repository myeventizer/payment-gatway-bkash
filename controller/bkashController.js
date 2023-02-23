const bkashConfig = require("../config/bkashConfig.json");
const createPayment = require("../action/createPayment.js");
const executePayment = require("../action/executePayment.js");
const queryPayment = require("../action/queryPayment.js");
const searchTransaction = require("../action/searchTransaction.js");
const refundTransaction = require("../action/refundTransaction.js");

const checkout = async (req, res) => {
  try {
    const createResult = await createPayment(req.body);
    console.log("Create Successful !!! ");
    res.json(createResult);
  } catch (e) {
    console.log(e);
  }
};

const bkashCallback = async (req, res) => {
  try {
    if (req.query.status === "success") {
      let response = await executePayment(req.query.paymentID);

      if (response.message) {
        response = await queryPayment(req.query.paymentID);
      }
      if (response.statusCode && response.statusCode === "0000") {
        console.log("Payment Successful ", response);
        // Your frontend success route
        res.redirect(
          `${bkashConfig.frontend_success_url}?msg=${response.statusMessage}&trxID=${response.trxID}&paymentID=${response.paymentID}`
        );
      } else {
        console.log("Payment Failed ", response);

        res.redirect(
          `${bkashConfig.frontend_fail_url}?data=${response.statusMessage}`
        );
      }
    } else {
      console.log("Payment Failed !!!");
      // Your frontend failed route
      res.redirect(bkashConfig.frontend_fail_url);
    }
  } catch (e) {
    console.log(e);
  }
};

const search = async (req, res) => {
  console.log(req.body.trxID);
  try {
    let refundUser = await searchTransaction(req.body.trxID);
    res.json(refundUser);
  } catch (e) {
    console.log(e);
  }
};

const refund = async (req, res) => {
  try {
    let refundTran = await refundTransaction(req.body);
    res.json(refundTran);
  } catch (e) {
    console.log(e);
  }
};

const refundStatus = async (req, res) => {
  try {
    let refundStatus = await refundTransaction(req.body);
    res.json(refundStatus);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  checkout,
  bkashCallback,
  search,
  refund,
  refundStatus,
};
