const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const articleSchema = new Schema({
    userId: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    details: { type: String, required: true },

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