const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
require("dotenv").config();
// var fs = require('fs');
// var path = require('path');
// const imgModel = require('./src/model/imageModel');

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

// Set EJS as templating engine 
// app.set("view engine", "ejs");

// //set up multer for storing uploaded files

// var multer = require('multer');

// var storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'uploads')
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, file.fieldname + '-' + Date.now())
// 	}
// });

// var upload = multer({ storage: storage });

// //the GET request handler that provides the HTML UI
// app.get('/', (req, res) => {
// 	imgModel.find({}, (err, items) => {
// 		if (err) {
// 			console.log(err);
// 			res.status(500).send('An error occurred', err);
// 		}
// 		else {
// 			res.render('imagesPage', { items: items });
// 		}
// 	});
// });

// //the POST handler for processing the uploaded file

// app.post('/', upload.single('image'), (req, res, next) => {
// 	var obj = {
// 		img: {
// 			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
// 			contentType: 'image/png'
// 		}
// 	}
// 	imgModel.create(obj, (err, item) => {
// 		if (err) {
// 			console.log(err);
// 		}
// 		else {
// 			// item.save();
// 			res.redirect('/');
// 		}
// 	});
// });

app.use(cors());
app.use('/user', require('./routes/users'));
app.use('/article', require('./routes/articles'));
app.use('/findhome', require('./routes/finderHome'));

app.listen(PORT, () => {
  console.log("Server started listening on PORT : " + PORT);

});