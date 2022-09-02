const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roleSchema = new Schema({
    roleName: { type: String, unique: true, required: true }
})

mongoose.pluralize(null);
const Role = mongoose.model('role', roleSchema);
module.exports = Role;