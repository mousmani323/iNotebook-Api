const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://mousmani323:0XtnZPiVaa6sjlf0@inotebookapi.exyjp5k.mongodb.net/"

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to mongoose");
  } catch (error) {
    console.error("Error connecting to mongoose:", error);
  }
};

module.exports = connectToMongo;
