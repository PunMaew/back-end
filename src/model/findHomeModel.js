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
            district: { type: String, required: true },
        },
        vaccination:{ type: String, required: true },
        receiveVaccine: { type: Array, required: true }, 
        disease: { type: String, required: false, default: "-" },
        neutered: { type: String, required: true },
        gender: { type: String, required: true },
        characteristic:{
            hair: { type: String, required: false },
            size: { type: String, required: false },
            habit: { type: Array, required: false }, 
            sandbox: { type: String, required: false },
        },
        others: { type: String, required: false, default: "-" },
    },
    contact: {
        terms:{ type: Boolean, default: false },
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
    ref: "user", 
    localField: 'author',
    foreignField: '_id',
    justOne: true
})

mongoose.pluralize(null);
const FindHome = mongoose.model("finderHome", findHomeSchema);
module.exports = FindHome;
