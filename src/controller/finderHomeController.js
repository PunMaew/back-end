//const Joi = require("joi");
const FindHome = require("../model/findHomeModel")

exports.AddFindHome = async (req, res) => {
    //const result = roleSchema.validate(req.body);

    const newFindHome = new FindHome(result.value);
    await newFindHome.save();
    return res.status(200).json({
        success: true,
        message: "Create FindHome Success",
    });
}