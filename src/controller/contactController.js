const Joi = require("joi");
const Contact = require("../model/contactModel");
const { v4: uuid } = require("uuid");
const contactSchema = Joi.object().keys({
    contactName: Joi.string().required(),
    tel: Joi.string().required(),
    facebook: Joi.string().required(),
    line: Joi.string().required()
});

exports.AddContact = async (req, res) => {
    const result = contactSchema.validate(req.body);
    const contactid = uuid(); 
    result.value.contactId = contactid;

    const newcontactId = new Contact(result.value);
    await newcontactId.save();
    return res.status(200).json({
        success: true,
        message: "Create Contact Success",
    });
}