const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const distSchema = new Schema({
    districtId : { type: String, unique: true, required: true },
    districName : { type: String, unique: true, required: true }
})

mongoose.pluralize(null);
const District = mongoose.model('district', distSchema);
module.exports = District;