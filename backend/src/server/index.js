const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

require("../database/database");

const authRoutes = require("../Routes/auth");
const postRoutes = require("../Routes/post")

const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes Usage
app.use("/auth", authRoutes);
app.use("/post", postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up & running or port ${PORT}`);
});
