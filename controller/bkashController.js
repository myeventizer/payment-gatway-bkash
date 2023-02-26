const bkashConfig = require("../config/bkashConfig.json");
const createPayment = require("../action/createPayment.js");
const executePayment = require("../action/executePayment.js");
const queryPayment = require("../action/queryPayment.js");
const searchTransaction = require("../action/searchTransaction.js");
const refundTransaction = require("../action/refundTransaction.js");
let failed_redirect = "";
const checkout = async (req, res) => {
  try {
    const createResult = await createPayment(req.body);
    console.log("Create Successful !!! ");
    failed_redirect = req.body.failed_redirect;
    res.json(createResult);
  } catch (e) {
    console.log(e);
  }
};

const bkashCallback = async (req, res) => {
  console.log(req.query);
  let frontend_fail_redirect_url = `${bkashConfig.frontend_fail_redirect}${failed_redirect}`;
  try {
    if (req.query.status === "success") {
      res.redirect(
        `${bkashConfig.frontend_after_complete_redirect}?paymentID=${req.query.paymentID}`
      );
    } else if (req.query.status === "cancel") {
      res.redirect(
        `${frontend_fail_redirect_url}?issue="You cancel your payment request."`
      );
    } else {
      res.redirect(
        `${frontend_fail_redirect_url}?issue="Payment Failed! Please try again"`
      );
    }
  } catch (e) {
    console.log(e);
    res.redirect(
      `${frontend_fail_redirect_url}?issue="Payment Failed! Please try again"`
    );
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
