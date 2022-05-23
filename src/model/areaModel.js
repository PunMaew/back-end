const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const areaSchema = new Schema({
    areaId: { type: String, unique: true, required: true },
    areaName: { type: String, unique: true, required: true }
})


mongoose.pluralize(null);
const Area = mongoose.model('area', areaSchema);
module.exports = Area;