// NPM Package
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;
console.log("uri" , uri)
const connectDb = async () => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Connection Created");
    })
    .catch((error) => {
      console.log("Error ocurred while connecting DB", error);
    });
};

module.exports = connectDb;
