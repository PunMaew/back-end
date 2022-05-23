const Joi = require("joi");
const Location = require("../model/locModel");
const { v4: uuid } = require("uuid");
const LocationSchema = Joi.object().keys({
    provinceName: Joi.string().required(),
    districName: Joi.string().required(),
    areaName: Joi.string().required(),
    zipCode: Joi.string().required()
});

exports.AddLoc = async (req, res) => {
    const result = LocationSchema.validate(req.body);
    const locid = uuid(); 
    result.value.locationId = locid;

    const newLoc = new Location(result.value);
    await newLoc.save();
    return res.status(200).json({
        success: true,
        message: "Create Location Success",
      });
 }