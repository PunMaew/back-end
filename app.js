const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');


require("dotenv").config();
const PORT = 3000;
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
const app = express();
// const corsOptions = {
//   origin: 'http://punmaew.sit.kmutt.ac.th:8080',
//   credentials: true,
// };
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //optional
app.get("/ping", (req, res) => {
  return res.send({
    error: false,
    message: "Server is healthy",
  });
});
// app.use(cors(corsOptions));
app.use(cors());
app.use('/user', require('./routes/users'));
app.use('/role', require('./routes/roles'));
app.use('/breeds', require('./routes/breeds'));
app.use('/contact', require('./routes/contacts'));
app.use('/article', require('./routes/articles'));
app.use('/findHome', require('./routes/finderHome'));

app.listen(PORT, () => {
  console.log("Server started listening on PORT : " + PORT);

});