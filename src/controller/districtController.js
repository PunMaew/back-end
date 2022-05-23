const Joi = require("joi");
const District = require("../model/districtModel");
const { v4: uuid } = require("uuid");
const distSchema = Joi.object().keys({
    districName : Joi.string().required()
  });

  exports.AddDistrict = async (req, res) => {
    const result = distSchema.validate(req.body);
    const distid = uuid(); //Generate unique id for the Role.
    result.value.districtId = distid;

    const newDist = new Role(result.value);
    await newDist.save();
    return res.status(200).json({
        success: true,
        message: "Create districName Success",
      });
}