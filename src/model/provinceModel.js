const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const provinceSchema = new Schema({
    provinceId: { type: String, unique: true, required: true },
    provinceName: { type: String, unique: true, required: true }
})


mongoose.pluralize(null);
const Province = mongoose.model('province', provinceSchema);
module.exports = Province;