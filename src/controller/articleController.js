const Joi = require("joi");
const Article = require("../model/articleModel");
const { default: mongoose } = require("mongoose");
const fs = require('fs/promises')

const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) { return '0 Bytes'; }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}

const articleSchema = Joi.object().keys(
    {
        title: Joi.string().required(),
        details: Joi.string().required(),
    }
);

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
            postIdArticle: newArticle._id.toString(),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

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

exports.DeleteArticle = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);

        const post = await Article.findById(id)
        console.log(post);

        await fs.unlink(`./uploads/${post.image.fileName}`)

        const data = await Article.findByIdAndRemove(id)
        if (!data) {
            return res.status(404).send({
                message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
            });
        }
        return res.status(200).send({
            message: "Article was deleted successfully!"
        });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Article with id=" + id
        });
    }
    // const id = req.query.id;
    // Article.findByIdAndRemove(id)
    //     .then(data => {
    //         if (!data) {
    //             res.status(404).send({
    //                 message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
    //             });
    //         } else {
    //             res.send({
    //                 message: "Article was deleted successfully!"
    //             });
    //         }
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message: "Could not delete Article with id=" + id
    //         });
    //     });
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

exports.SingleuploadArticle = async (req, res) => {
    try {
        if (!req.params.postId) {
            throw new Error('require field')
        }
        await Article.findByIdAndUpdate(req.params.postId, {
            image: {
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2)
            }
        })
        res.status(201).send({
            message: 'File Uploaded Successfully',
            image: req.file.originalname
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};