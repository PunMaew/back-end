const Joi = require("joi");
const FindHome = require("../model/findHomeModel");
const { default: mongoose } = require("mongoose");


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

exports.Create = async (req, res) => {
    try {
        req.body.author = new mongoose.Types.ObjectId(req.decoded.id);
        const result = findHomeSchema.validate(req.body);
        const newCreate = new FindHome(result.value);
        await newCreate.save();

        return res.status(200).json({
            success: true,
            message: "Create Success",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }

};

exports.FindAllPost = async (req, res) => {
    const getAllPost = await FindHome.find();
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

exports.DeletePost = (req, res) => {
    const id = req.query.id;
    FindHome.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete FindHome with id=${id}. Maybe FindHome was not found!`
                });
            } else {
                res.send({
                    message: "FindHome was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete FindHome with id=" + id
            });
        });
};

exports.Update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.query.id;

    FindHome.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update FindHome with id=${id}. Maybe FindHome was not found!`
                });
            } else res.status(200).send({ message: "FindHome was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating FindHome with id=" + id
            });
        });
};

exports.GetMyPost = async (req, res) => {
    const id = req.query.id;
    const mypost = await FindHome.find({author: id});
    return res.send({mypost});
};

// exports.Upload = (req, res) => {
//     res.send(req.files)
// };