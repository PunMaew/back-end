const Joi = require("joi");
const FindHome = require("../model/findHomeModel");
const User = require("../model/userModel");
const { default: mongoose } = require("mongoose");
const fs = require('fs/promises');
const { Console } = require("console");

const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) { return '0 Bytes'; }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
}

const findHomeSchema = Joi.object().keys(
    {
        generalInfo: {
            catName: Joi.string().required(),
            color: Joi.string().required(),
            breeds: Joi.string().required(),
            age: Joi.string().required(),
            location:
            {
                province: Joi.string().required(),
                subDistrict: Joi.string().required(),
                district: Joi.string().required(),
                zipCode: Joi.string().required(),
            },
            receiveVaccine: Joi.string().required(),
            receiveDate: Joi.string().required(),
            disease: Joi.string().required(),
            neutered: Joi.string().required(),
            image: Joi.string().required(),
            gender: Joi.string().required(),
            others: Joi.string().required(),
        },
        contact: {
            contactName: Joi.string().required(),
            tel: Joi.string().required(),
            facebook: Joi.string().required(),
            line: Joi.string().required(),
        },

    })

//--------------------- User ---------------------
exports.Create = async (req, res, next) => {
    try {

        const idUser = req.decoded.id;
        const user = await User.findById(idUser);

        if (user) {
            req.body.author = idUser;
            const result = findHomeSchema.validate(req.body);
            const newCreate = new FindHome(result.value);
            await newCreate.save();

            const newPost = await FindHome.create(newCreate)
            return res.status(200).json({
                success: true,
                message: "Create Success",
                postId: newPost._id.toString(),
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "No user found",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }

};

exports.GetMyPost = async (req, res) => {
    const id = req.query.id;
    const mypost = await FindHome.find({ author: id });
    return res.send({ mypost });
};

//--------------------- User and Admin ---------------------
exports.FindAllPost = async (req, res) => {
    const getAllPost = await FindHome.find().populate({
        path:'authorInfo', select: ['firstName', 'lastName']
    }).exec();
    try {
        if (getAllPost.length < 1) {
            return res.status(404).json({
                error: "No post was found in DB"
            });
        }


        return res.json(getAllPost);
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};

exports.FindOnePost = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await FindHome.findById(id).populate('author').exec();
        if (!data)
            return res.status(404).send({
                message: "Not found Post with id " + id
            });
        return res.send({
            data: data,
        });
    } catch (err) {
        res.status(500).send({ message: "Error retrieving Post with id=" + id });
    }
};

exports.DeletePost = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);

        const post = await FindHome.findById(id)
        console.log(post);

        await fs.unlink(`./uploads/${post.image.fileName}`)

        const data = await FindHome.findByIdAndRemove(id)
        if (!data) {
            return res.status(404).send({
                message: `Cannot delete FindHome with id=${id}. Maybe FindHome was not found!`
            });
        }
        return res.status(200).send({
            message: "FindHome was deleted successfully!"
        });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete FindHome "
        });
    }
};

exports.Update = async (req, res) => {
    try {

        if (!req.body) {
            return res.status(400).send({
                message: "Data to update can not be empty!"
            });
        }

        const id = req.query.id;
        const data = await FindHome.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        if (!data) {
            return res.status(404).send({
                message: `Cannot update FindHome with id=${id}. Maybe FindHome was not found!`
            });
        } return res.status(200).send({
            message: "FindHome was updated successfully.",
            postId: data._id.toString()
        });
    } catch (error) {
        res.status(500).send({
            message: "Error updating FindHome with id=" + id
        });
    }

};

exports.updateImageFindHome = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);
        const post = await FindHome.findById(id)

        if (!post.image.fileName) {
            return res.status(404).send({
                message: `FindHome was not found!`
            });
        }

        fs.unlink(`./uploads/${post.image.fileName}`)
        post.image = undefined
        await post.save()

        const data = await FindHome.findByIdAndUpdate(id,
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
                message: `Cannot update FindHome. Maybe FindHome was not found!`
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

exports.GetMultipleRandom = async (req, res) => {
    const getAllPost = await FindHome.find();
    if (!getAllPost || getAllPost.length === 0) {
        return res.status(201).send({
            message: "No Post Now"
        });
    }
    function getMultipleRandom(arr, num) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }
    const randomPost = getMultipleRandom(getAllPost, 3)
    return res.status(200).json(randomPost);
}

exports.Singleupload = async (req, res) => {
    try {
        if (!req.params.postId) {
            throw new Error('require field')
        }
        await FindHome.findByIdAndUpdate(req.params.postId, {


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

exports.getallSingleFiles = async (req, res, next) => {
    try {
        const files = await FindHome.find();
        res.status(200).send(files);
    } catch (error) {
        res.status(400).send(error.message);
    }
}




