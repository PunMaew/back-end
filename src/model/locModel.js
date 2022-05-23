const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    locationId: { type: String, unique: true, required: true },
    provinceId: { type: String, unique: true, required: true },
    districtId: { type: String, unique: true, required: true },
    areaId: { type: String, unique: true, required: true },
    zipCode: { type: String, unique: true, required: true }
})


mongoose.pluralize(null);
const Location = mongoose.model('location', locationSchema);
module.exports = Location;