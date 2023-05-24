require("dotenv").config({ path: "../.env" });
require("custom-env").env(true);
const { ObjectID, ObjectId } = require("bson");
const paypal = require("paypal-rest-sdk");
const Razorpay = require("razorpay");
var Order = require("../models/orderSchema");
var instance = new Razorpay({
  key_id: "rzp_test_xAQNIRBNlka1mN",
  key_secret: process.env.KEYSECRET,
});

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.PAYPALKEYID,
  client_secret: process.env.PAYPALKEYSECRET,
});

module.exports = {
  genaretePaypal: (orderId, total) => {
    return new Promise((resolve, reject) => {
      var create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `http://localhost:3000/paymentSuccess/${orderId}`,
          cancel_url: `http://localhost:3000/cancelledpayment/${orderId}`,
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "item",
                  sku: "item",
                  price: parseInt(total),
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "USD",
              total: total,
            },
            description: "This is the payment description.",
          },
        ],
      };
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          resolve(payment.links[1].href);
        }
      });
    });
  },
  generateRazorpay: (orderId, total) => {
    total = parseFloat(total);
    return new Promise((resolve, reject) => {
      var options = {
        amount: total * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err, "is the err occured in the generate rzp");
        }
        resolve(order);
      });
    });
  },
  verifyPayment: (details) => {
    return new Promise((resolve, reject) => {
      try {
        const crypto = require("crypto");
        let hmac = crypto.createHmac("sha256", process.env.KEYSECRET);
        hmac.update(
          details.payment.razorpay_order_id +
            "|" +
            details.payment.razorpay_payment_id
        );
        hmac = hmac.digest("hex");
        if (hmac == details.payment.razorpay_signature) {
          resolve();
        } else {
          console.log("failed");
          reject();
        }
      } catch (error) {
        reject();
        console.log(error, "is the error in order placing");
      }
    });
  },
};
