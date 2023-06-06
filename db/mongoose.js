require("dotenv").config();
const mongoose = require("mongoose");

module.exports.Database = async function () {
  mongoose
    .connect(process.env.MONGOOSE_CONEXION, { useNewUrlParser: true })
    .then(() => {
      console.log("Successfully connected to MongoDB.");
      return "Successfully connected to MongoDB.";
    })
    .catch((err) => {
      console.error("Connection error: ", err);
      process.exit();
    });
};
