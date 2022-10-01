var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    img:
    {
        data: Buffer,
        contentType: String
    }
});

//Image is a model which has a schema imageSchema
mongoose.pluralize(null);
module.exports = new mongoose.model('image', imageSchema);