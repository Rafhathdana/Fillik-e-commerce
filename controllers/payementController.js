require("dotenv").config({ path: "../.env" });
require("custom-env").env(true);
const { ObjectID, ObjectId } = require("bson");
const paypal = require("paypal-rest-sdk");
const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "rzp_test_xAQNIRBNlka1mN",
  key_secret: process.env.KEYSECRET,
});

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.client_id,
  client_secret: process.env.client_secret,
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
          return_url: "/payment-success",
          cancel_url: "/place-order",
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "item",
                  sku: "item",
                  price: total,
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "INR",
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
          console.log("Create Payment Response");
          console.log(payment, "payment type");
          console.log(payment.links[1].href);
          resolve(payment.links[1].href);
        }
      });
    });
  },
  generateRazorpay: (orderId, total) => {
    console.log(orderId, "ordreee");
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
        console.log("new", order);
        resolve(order);
      });
    });
  },
  verifyPayment: (details) => {
    console.log(details, "deeeeeee");
    return new Promise((resolve, reject) => {
      try {
        const crypto = require("crypto");
        let hmac = crypto.createHmac("sha256", process.env.key_secret);
        hmac.update(
          details.payment.razorpay_order_id +
            "|" +
            details.payment.razorpay_payment_id
        );
        hmac = hmac.digest("hex");
        console.log(details, "detailssssssssss");
        console.log(hmac, "hmccccccc");
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
  changePaymentStatus: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: { status: "placed" },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },

  verifyPaymentPost: (req, res) => {
    try {
      paymentHelpers
        .verifyPayment(req.body)
        .then(() => {
          console.log(req.body, "rq.body");
          paymentHelpers
            .changePaymentStatus(req.body.order.receipt)
            .then(() => {
              console.log("success full");
              res.json({ status: true });
            });
        })
        .catch((err) => {
          console.log(err, "is the error in the user.js verify payment");
          res.json({ status: false, erMsg: "payment failed" });
        });
    } catch (error) {
      console.log("Someethoing Went Wrong in Paymnent Verification");
      res.redirect("/SomethingWentwrong");
    }
  },
};
