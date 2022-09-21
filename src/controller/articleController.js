const Joi = require("joi");
const Article = require("../model/articleModel");
const { default: mongoose } = require("mongoose");

const articleSchema = Joi.object().keys(
    {
        title: Joi.string().required(),
        details: Joi.string().required(),
        imageArt: Joi.string().required()
    }
);

//testing
exports.CreateArticle = async (req, res) => {
    try {
        req.body.authorAdmin = new mongoose.Types.ObjectId(req.decoded.id);
        const result = articleSchema.validate(req.body);
        const newArticle = new Article(result.value);
        console.log(newArticle);
        await newArticle.save();

        return res.status(200).json({
            success: true,
            message: "Create Success",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

//testing
exports.AllArticle = async (req, res) => {
    const allArticle = await Article.find();
    try {
        if (allArticle.length < 1) {
            return res.status(404).json({
                error: "No post was found in DB"
            });
        }
        return res.json(allArticle);
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};

//testing
exports.DeleteArticle = (req, res) => {
    const id = req.query.id;
    Article.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
                });
            } else {
                res.send({
                    message: "Article was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Article with id=" + id
            });
        });
};

exports.UpdateArticle = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.query.id;

    Article.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Article with id=${id}. Maybe Article was not found!`
                });
            } else res.status(200).send({ message: "Article was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Article with id=" + id
            });
        });
};