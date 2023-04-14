require("dotenv").config({ path: "../.env" });
require("custom-env").env(true);

module.exports = {
  OTP: (mobile, otp) => {
    return new Promise((resolve, reject) => {
      var unirest = require("unirest");
      var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
      req.headers({
        authorization: process.env.AUTH,
        "Content-Type": "application/json",
      });
      var message = `${otp} By https://Fellik.com`;
      req.form({
        sender_id: "FTWSMS",
        variables_values: otp,
        message: message,
        route: "v3",
        numbers: mobile,
      });

      req.end(function (res) {
        if (res.error) {
          console.log("error");
          reject(res.error);
        } else {
          console.log("sussecc");
          resolve(res.body);
        }
      });
    });
  },
};
