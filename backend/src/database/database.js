const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config()

const URL = process.env.MONGO_URL;

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch(() => {
    console.log("Error in connection to database");
  });
