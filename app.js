const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
require("dotenv").config();

//connect to the database
const PORT = 5443;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Database connection Success.");

  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);

  });

//health check
app.get("/ping", (req, res) => {
  return res.send({
    error: false,
    message: "Server is healthy",
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());
app.use('/user', require('./routes/users'));
app.use('/article', require('./routes/articles'));
app.use('/findhome', require('./routes/finderHome'));

app.listen(PORT, () => {
  console.log("Server started listening on PORT : " + PORT);

});