const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const articleSchema = new Schema({
    title: { type: String, required: true },
    details: { type: String, required: true },
    authorAdmin:
    {
        type: mongoose.Schema.Types.ObjectId,
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
    }
)

mongoose.pluralize(null);
const Article = mongoose.model('article', articleSchema);
module.exports = Article;