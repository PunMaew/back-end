const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const contactSchema = new Schema({
    contactId: { type: String, unique: true, required: true },
    contactName: { type: String, unique: true, required: true },
    tel: { type: String, unique: true, required: true },
    facebook: { type: String, unique: true },
    line: { type: String, unique: true }
})

mongoose.pluralize(null);
const Contact = mongoose.model('contact', contactSchema);
module.exports = Contact;