require("dotenv").config({ path: "../.env" });
require("custom-env").env(true);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

module.exports = {
  connect: async () => {
    try {
      const conn = await mongoose.connect(
        `mongodb+srv://danarafha:${process.env.MONGO_PASSWORD}@rafhathdana.yikfxw3.mongodb.net/fillik`
      );
      console.log(`Database connected : ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
    }
  },
};
