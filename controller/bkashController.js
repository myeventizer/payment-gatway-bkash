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
  console.log(req.query);
  try {
    if (req.query.status === "success") {
      res.redirect(
        `${bkashConfig.frontend_after_complete_redirect}?paymentID=${req.query.paymentID}`
      );
    } else {
      console.log("Payment Failed");
      res.redirect(bkashConfig.frontend_fail_url);
    }
  } catch (e) {
    console.log(e);
  }
};

const afterExecutePayment = async (req, res) => {
  try {
    let response = await executePayment(req.body.paymentID);
    res.json(response);
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
  afterExecutePayment,
};
