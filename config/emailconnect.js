require("dotenv").config({ path: "../.env" });
require("custom-env").env(true);

const nodemailer = require("nodemailer");
module.exports = {
  EMAILRESETOTP: (email, otp) => {
    return new Promise(async (resolve, reject) => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAILPASS,
        },
      });

      let message = {
        from: process.env.MAIL,
        to: email,
        subject: "Reset password - verification code",
        text: "verification",
        html: `Your email verification code is <b>${otp}</b>`,
      };

      transporter.sendMail(message, function (error, info) {
        if (error) {
          console.log("error");
          reject({ Success: false });
        } else {
          resolve({ Success: true });
        }
      });
    });
  },
};
