const Joi = require("joi");
const FindHome = require("../model/findHomeModel");
const { v4: uuid } = require("uuid");
const User = require("../model/userModel");
const { request } = require("express");
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

exports.AddFindHome = async (req, res) => {
    const result = findHomeSchema.validate(req.body);
    const newFindHome = new FindHome(result.value);
    await newFindHome.save();
    return res.status(200).json({
        success: true,
        message: "Create FindHome Success",
    });
}

// Create and Save a new information cat
exports.create = async (req, res) => {
    try {
        console.log(req.decoded._id);
        //req.body.author = req.decoded.id;
        req.body.author = new mongoose.Types.ObjectId(req.decoded._id);
        const result = findHomeSchema.validate(req.body);
        console.log("A");
        const id = uuid(); //Generate unique id for the user.
        console.log("B");
        result.value.findHomeId = id;
        console.log("C");
        const newCreate = new FindHome(result.value);
        console.log("D");
        await newCreate.save();
        return res.status(200).json({
            success: true,
            message: "Registration Success",
        });
    } catch (error) {
        //console.log(newCreate);
        console.log(error);
        return res.status(500).send(error)
        // json({
        //     error: error,
        //     message: "Cannot Create new information cat",
        // });
    }

};