const { boolean } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const interestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [{
        itemId: {
            type: mongoose.Types.ObjectId,
            ref: 'finderHome',
            required: true
        },
    }],
    like:{ type: Boolean},
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
}
);

interestSchema.virtual('userinfo', {
    ref: "user", //data
    localField: 'author',
    foreignField: '_id',
    justOne: true
})

const Interest = mongoose.model('interest', interestSchema)

module.exports = Interest