const Joi = require("joi");
const Area = require("../model/areaModel");
const { v4: uuid } = require("uuid");
const areaSchema = Joi.object().keys({
    areaName : Joi.string().required()
  });

exports.AddArea = async (req, res) => {
    const result = areaSchema.validate(req.body);
    const areaid = uuid();  
    result.value.areaId = areaid;

    const newArea = new Area(result.value);
    await newArea.save();
    return res.status(200).json({
        success: true,
        message: "Create Area Success",
      });
}