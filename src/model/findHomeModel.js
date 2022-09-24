const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const findHomeSchema = new Schema({
    generalInfo: {
        catName: { type: String, required: true },
        color: { type: String, required: true },
        breeds: { type: String, required: false, default: "-" },
        age: { type: String, required: false, default: "-" },
        ageRange : { type: String, required: true },
        location: {
            province: { type: String, required: true },
            subDistrict: { type: String, required: true },
            district: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
        receiveVaccine: { type: String, required: true },
        receiveDate: { type: String, required: false, default: "-" },
        disease: { type: String, required: false, default: "-" },
        neutered: { type: String, required: true },
        image: { type: String, required: false },
        gender: { type: String, required: true },
        characteristic: { type: Array, required: true },
        others: { type: String, required: false, default: "-" },
    },
    contact: {
        contactName: { type: String, required: true },
        tel: { type: String, required: true },
        facebook: { type: String, required: false, default: "-" },
        line: {
            type: String, default: "-", required: false,
        },
    },
    author:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    statusbar: { type: String, required: false, default: "ยังไม่ถูกรับเลี้ยง" },
},
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

mongoose.pluralize(null);
const FindHome = mongoose.model("finderHome", findHomeSchema);
module.exports = FindHome;
