const Joi = require("joi");
const Province = require("../model/provinceModel");
const { v4: uuid } = require("uuid");
const provinceSchema = Joi.object().keys({
    provinceName : Joi.string().required()
  });

exports.AddProvince = async (req, res) => {
    const result = provinceSchema.validate(req.body);
    const proid = uuid();  
    result.value.provinceId = proid;

    const newPro = new Province(result.value);
    await newPro.save();
    return res.status(200).json({
        success: true,
        message: "Create Role Success",
      });
}