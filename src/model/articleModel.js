const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const articleSchema = new Schema({
    title: { type: String, required: true },
    details: [{
        id: {type: mongoose.Schema.Types.ObjectId, require: true},
        paraNumber : {type: String , require: true},
        text : {type: String, require: true}
    }],
    authorAdmin:
    {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
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
articleSchema.virtual('authorAdminInfo', {
    //ref: "user", //data
    ref: "admin", //data
    localField: 'authorAdmin',
    foreignField: '_id',
    justOne: true
})

mongoose.pluralize(null);
const Article = mongoose.model('article', articleSchema);
module.exports = Article;