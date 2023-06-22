const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://mousmani323:Qwerty.654321@cluster0.xnysc6t.mongodb.net/"

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to mongoose");
  } catch (error) {
    console.error("Error connecting to mongoose:", error);
  }
};

module.exports = connectToMongo;
