const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const breedSchema = new Schema({
    breedId: { type: String, unique: true, required: true },
    breedName: { type: String, unique: true, required: true }
})


mongoose.pluralize(null);
const Breed = mongoose.model('breeds', breedSchema);
module.exports = Breed;