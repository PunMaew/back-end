const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const multer = require('multer');
const path = require('path');
var fs = require('fs');
var imgModel = require('./src/model/models');

require("dotenv").config();

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

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //optional

app.get("/ping", (req, res) => {
  return res.send({
    error: false,
    message: "Server is healthy",
  });
});

// Set EJS as templating engine 
app.set("view engine", "ejs");

// set up multer for storing uploaded files

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

// the GET request handler that provides the HTML UI
app.get('/', (req, res) => {
  imgModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
    }
    else {
      res.render('imagesPage', { items: items });
    }
  });
});

app.post('/', upload.single('image'), (req, res, next) => {

  var obj = {
    img: {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  imgModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    }
    else {
      // item.save();
      res.redirect('/');
    }
  });
});

// app.use(cors(corsOptions));
app.use(cors());
app.use('/user', require('./routes/users'));
app.use('/article', require('./routes/articles'));
app.use('/findHome', require('./routes/finderHome'));
app.use(express.static('uploads'));

app.listen(PORT, () => {
  console.log("Server started listening on PORT : " + PORT);

});