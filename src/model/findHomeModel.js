const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const findHomeSchema = new Schema({
    generalInfo: {
        catName: { type: String, required: true },
        color: { type: String, required: true },
        breeds: { type: String, required: false, default: "-" },
        age: { type: String, required: false, default: "-" },
        ageRange: { type: String, required: false },
        location: {
            province: { type: String, required: true },
            //subDistrict: { type: String, required: true }, //!เอาออก
            district: { type: String, required: true },
            //zipCode: { type: String, required: true }, //!เอาออก
        },
        vaccination:{ type: String, required: true },
        //receiveVaccine: { type: String, required: true }, //!แก้เป็น Array
        receiveVaccine: { type: Array, required: true }, //*แก้เป็น Array
        receiveDate: { type: String, required: false, default: "-" },
        disease: { type: String, required: false, default: "-" },
        neutered: { type: String, required: true },
        gender: { type: String, required: true },
        //characteristic: { type: Array, required: true },//!แก้เป็นรับแบบ text
        characteristic:{
            hair: { type: String, required: true },
            size: { type: String, required: true },
            habit: { type: Array, required: true }, //*แก้เป็น Array
            sandbox: { type: String, required: true },
        },
        others: { type: String, required: false, default: "-" },
    },
    contact: {
        contactName: { type: String, required: true },
        tel: { type: String, required: true },
        facebook: { type: String, required: false, default: "-" },
        line: { type: String, default: "-", required: false, },
    },
    author: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    statusbar: { type: String, required: false, default: "ยังไม่ถูกรับเลี้ยง" },
    image: {
        fileName: {
            type: String, required: false
        },
        filePath: {
            type: String, required: false
        },
        fileType: {
            type: String, required: false
        },
        fileSize: {
            type: String, required: false
        }
    },
},
{
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        versionKey: false
    }
);

findHomeSchema.virtual('authorInfo', {
    ref: "user", //data
    localField: 'author',
    foreignField: '_id',
    justOne: true
})


mongoose.pluralize(null);
const FindHome = mongoose.model("finderHome", findHomeSchema);
module.exports = FindHome;
