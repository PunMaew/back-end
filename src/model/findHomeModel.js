const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const findHomeSchema = new Schema({
    findHomeId: { type: String, unique: true, required: true },
    generalInfo: {
        catName: { type: String, required: true },
        color: { type: String, required: true },
        breeds: { type: String, required: true },
        age: { type: String, required: true },
        location: {
            province: { type: String, required: true },
            subDistrict: { type: String, required: true },
            district: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
        receiveVaccine: { type: String, required: true },
        receiveDate: { type: String, required: true },
        disease: { type: String, required: true },
        neutered: { type: String, required: true },
        image: { type: String, required: true },
        gender: { type: String, required: true },
        others: { type: String, required: true },
    },
    contact: {
        contactName: { type: String, required: true },
        tel: { type: String, required: true },
        facebook: { type: String, required: true },
        line: { type: String, required: true },
    },
    // author:  
    //     {
    //         type: String, required: true
    //     },
    author: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    

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
