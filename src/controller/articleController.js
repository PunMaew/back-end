const Joi = require("joi");
const Article = require("../model/articleModel");
const articleSchema = Joi.object().keys({
    title: Joi.string().required(),
    details: Joi.string().required()
});

exports.AddArticle = async (req, res) => {
    const result = articleSchema.validate(req.body);
    const newArticle = new Article(result.value);
    await newArticle.save();
    return res.status(200).json({
        success: true,
        message: "Create Article Success",
    });
}
