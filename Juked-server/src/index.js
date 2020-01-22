const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// setting up express routing
const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(userRoutes);
app.use(reviewRoutes);

/**
 * @param {Object} res - the incoming HTTP request
 * @param {Object} req - the outgoing response
 */
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Listening on: localhost:${PORT}`);
});
