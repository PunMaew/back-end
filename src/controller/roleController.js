const Joi = require("joi");
const Role = require("../model/roleModel");
const { v4: uuid } = require("uuid");
const roleSchema = Joi.object().keys({
  roleName : Joi.string().required()
  });

exports.AddRole = async (req, res) => {
    const result = roleSchema.validate(req.body);
    const roleid = uuid(); //Generate unique id for the Role.
    result.value.roleId = roleid;

    const newRole = new Role(result.value);
    await newRole.save();
    return res.status(200).json({
        success: true,
        message: "Create Role Success",
      });
}