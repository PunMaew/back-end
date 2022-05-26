const Joi = require("joi");
const Breed = require("../model/breedModel");
const { v4: uuid } = require("uuid");
const breedSchema = Joi.object().keys({
    breedName: Joi.string().required()
});

exports.AddBreeds = async (req, res) => {
    const result = breedSchema.validate(req.body);
    const breedid = uuid();  
    result.value.breedId = breedid;

    const newBreeds = new Breed(result.value);
    await newBreeds.save();
    return res.status(200).json({
        success: true,
        message: "Create Breeds Success",
    });
}