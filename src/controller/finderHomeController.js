const Joi = require("joi");
const FindHome = require("../model/findHomeModel");
const User = require("../model/userModel");


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
                area: Joi.string().required(),
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