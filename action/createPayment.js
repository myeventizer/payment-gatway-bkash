const bkashConfig = require("../config/bkashConfig.json");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
const authHeaders = require("../action/authHeader.js");
let isDevelopment = false
const createPayment = async (req) => {
  console.log("Create Payment API Start !!!");
  try {
    const createResopnse = await fetch(bkashConfig.create_payment_url, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({
        mode: "0011",
        payerReference: req.bkashNumber,
        callbackURL: isDevelopment
          ? bkashConfig.backend_callback_urlDev
          : bkashConfig.backend_callback_urlProd,
        amount: req.amount ? req.amount : 1,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
      }),
    });
    const createResult = await createResopnse.json();

    return createResult;
  } catch (e) {
    console.log(e);
  }
};

module.exports = createPayment;
