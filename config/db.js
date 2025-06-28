// NPM Package
const mongoose = require("mongoose");

const connectDb = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "WonderTale",
    })
    .then(() => {
      console.log("Connection Created");
    })
    .catch((error) => {
      console.log("Error ocurred while connecting DB", error);
    });
};

module.exports = connectDb;
