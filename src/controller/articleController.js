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

exports.AllArticle = async (req, res) => {
    const allArticle = await Article.find().populate({
        path: 'authorAdminInfo', select: ['firstName', 'lastName']
    }).exec();
    try {
        if (allArticle.length < 1) {
            return res.status(200).json([]);
        }
        return res.json(allArticle);
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};

exports.FindOneArticle = async (req, res) => {
    const id = req.query.id;
    try {
        const data = await Article.findById(id).populate('authorAdmin').exec();
        if (!data)
            return res.status(404).send({
                message: "Not found Post with id " + id
            });
        return res.send({
            data: data,
        });
    } catch (err) {
        //res.status(500).send({ message: "Error retrieving Post with id=" + id });
    console.log(err);
    }
};

exports.DeleteArticle = async (req, res) => {
    const id = req.query.id;
    try {
        console.log(id);

        const post = await Article.findById(id)
        console.log(post);

        const nameImage = post.image.filePath.substr(8);
        console.log(nameImage);

        await fs.unlink(`./uploads/${nameImage}`)

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
};

exports.UpdateArticle = async (req, res) => {
    try {

        if (!req.body) {
            return res.status(400).send({
                message: "Data to update can not be empty!"
            });
        }

        const id = req.query.id;
        const data = await Article.findByIdAndUpdate(id, req.body, { useFindAndModify: false })

        if (!data) {
            return res.status(404).send({
                message: `Cannot update Article with id=${id}. Maybe Article was not found!`
            });
        }

        return res.status(200).send({
            message: "Article was updated successfully.",
            postId: data._id.toString()
        });

    } catch (error) {
        res.status(500).send({
            message: "Error updating Article with id=" + id
        });
    }
};

exports.updateImageArticle = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);
        const post = await Article.findById(id)

        if (!post.image.fileName) {
            return res.status(404).send({
                message: `Article was not found!`
            });
        }

        const nameImage = post.image.filePath.substr(8);
        console.log(nameImage);

        fs.unlink(`./uploads/${nameImage}`)
        post.image = undefined
        await post.save()

        const data = await Article.findByIdAndUpdate(id,
            {
                image: {
                    fileName: req.file.originalname,
                    filePath: req.file.path,
                    fileType: req.file.mimetype,
                    fileSize: fileSizeFormatter(req.file.size, 2)
                }
            })

        if (!data) {
            return res.status(404).send({
                message: `Cannot update Article. Maybe Article was not found!`
            });
        }

        res.status(201).send({
            message: 'File Uploaded Successfully',
            image: req.file.originalname
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.readFile = async (req, res) => {
    try {
        const id = req.query.id;
        const post = await Article.findById(id)
        const nameImage = post.image.filePath.substr(8);
        console.log(nameImage);
        const data = await fs.readFile(`./uploads/${nameImage}`);
        return res.end(data);

    } catch (error) {
        res.status(400).send(error.message);
    }
};


