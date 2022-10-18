const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        required: true
    }
}, { timestamps: true });

mongoose.pluralize(null);
const Image = mongoose.model('image', imageSchema);
module.exports = Image;