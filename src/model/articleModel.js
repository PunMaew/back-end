const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const articleSchema = new Schema({
    title: { type: String, required: true },
    details: { type: String, required: true },
    imageArt: { type: String, required: false },
    authorAdmin:
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
)

mongoose.pluralize(null);
const Article = mongoose.model('article', articleSchema);
module.exports = Article;