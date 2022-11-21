const bcrypt = require("bcryptjs/dist/bcrypt");
const Joi = require("joi");
const { sendEmail } = require("../helpers/mailer");
const User = require("../model/userModel");
const Admin = require("../model/adminModel");
const FindHome = require("../model/findHomeModel");
const { generateJwt } = require("../helpers/generateJwt");
const jwt = require("jsonwebtoken");
const fs = require('fs/promises');
const { find } = require("../model/userModel");

const userSchema = Joi.object().keys({
  firstName: Joi.string().min(4).max(30).required(),
  lastName: Joi.string().min(4).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required().min(6),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
});

const emailSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 })
});

const AdminSchema = Joi.object().keys({
  firstName: Joi.string().min(4).max(30).required(),
  lastName: Joi.string().min(4).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required().min(6),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
});

exports.EditProfile = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.query.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.status(200).send({ message: "User was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating FindHome with id=" + id
      });
    });
};

exports.IdealCat = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!"
    });
  }

  const id = req.decoded.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update user with id=${id}. Maybe User was not found!`
        });
      } else res.status(200).send({ message: "ideal cat information was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating ideal cat with user id=" + id
      });
    });
};

exports.Signup = async (req, res) => {
  try {
    const result = userSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    var user = await User.findOne({
      email: result.value.email,
    });
    if (user) {
      return res.status(401).json({
        error: true,
        message: "Email is already in use",
      });
    }
    if (result.value.password != result.value.confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Password Or Confirm Password Not Match",
      });
    }
    const hash = await User.hashPassword(result.value.password);


    delete result.value.confirmPassword;
    result.value.password = hash;
    let code = Math.floor(100000 + Math.random() * 900000);
    let expiry = Date.now() + 60 * 1000 * 15;
    const sendCode = await sendEmail(result.value.email, code);
    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send verification email.",
      });
    }

    result.value.emailToken = code;
    result.value.emailTokenExpires = new Date(expiry);

    const userEmail = result.value.email;
    console.log(userEmail);

    const newUser = new User(result.value);
    await newUser.save();


    return res.status(200).json({
      success: true,
      message: "Registration Success",
      _id: newUser.id
    });
  } catch (error) {
    console.error("signup-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot Register",
    });
  }
};

exports.Logout = async (req, res) => {
  try {
    const { id } = req.decoded;
    let user = await User.findOne({
      _id: id,
    });
    user.accessToken = "";
    await user.save();
    return res.send({
      success: true,
      message: "User Logged out",
    });
  } catch (error) {
    console.error("user-logout-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.Activate = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.json({
        error: true,
        status: 400,
        message: "Please make a valid request",
      });
    }
    const user = await User.findOne({
      email: email,
      emailToken: code,
      emailTokenExpires: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid details",
      });
    } else {
      if (user.active)
        return res.send({
          error: true,
          message: "Account already activated",
          status: 400,
        });
      user.emailToken = "";
      user.emailTokenExpires = null;
      user.active = true;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Account activated.",
      });
    }
  } catch (error) {
    console.error("activation-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({
        status: 400,
        error: true,
        message: "Cannot be processed",
      });
    }
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.send({
        success: true,
        message: "Account not found",
      });
    }

    // let code = Math.floor(100000 + Math.random() * 900000);
    // let response = await sendEmail(user.email, code);
    // if (response.error) {
    //   return res.status(500).json({
    //     error: true,
    //     message: "Couldn't send mail. Please try again later.",
    //   });
    // }
    // let expiry = Date.now() + 60 * 1000 * 15;
    // user.resetPasswordToken = code;
    // user.resetPasswordExpires = expiry;
    // await user.save();
    return res.send({
      success: true,
      message:
        "We will send you an email to reset your password",
      _id: user.id,
    });
  } catch (error) {
    console.error("forgot-password-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.ResetOtp = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(403).json({
        error: true,
        message:
          "Couldn't process request. Please provide all mandatory fields",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Password reset token is invalid or has expired.",
      });
    }

    await user.save();
    return res.send({
      success: true,
      message: "otp passed",
    });
  } catch (error) {
    console.error("not pass otp", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) {
      return res.status(403).json({
        error: true,
        message:
          "Couldn't process request. Please provide all mandatory fields",
      });
    }
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return res.send({
        error: true,
        message: "Password reset token is invalid or has expired.",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Passwords didn't match",
      });
    }
    const hash = await User.hashPassword(req.body.newPassword);
    user.password = hash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = "";
    await user.save();
    return res.send({
      success: true,
      message: "Password has been changed",
    });
  } catch (error) {
    console.error("reset-password-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.AgainOTPSignup = async (req, res) => {
  const id = req.query.id;
  const data = await User.findById(id);
  try {
    const result = userSchema.validate(data);
    var user = await User.findOne({
      email: result.value.email,
    });
    let code = Math.floor(100000 + Math.random() * 900000);
    let expiry = Date.now() + 60 * 1000 * 15;
    const sendCode = await sendEmail(result.value.email, code);
    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send verification email.",
      });
    }
    result.value.emailToken = code;
    result.value.emailTokenExpires = new Date(expiry);
    const newUser = new User(result.value);
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "Registration Success",
    });
  } catch (error) {
    console.error("signup-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot Register",
    });
  }
}

exports.SignupAdmin = async (req, res) => {
  try {
    const result = AdminSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    var user = await Admin.findOne({
      email: result.value.email,
    });
    if (user) {
      return res.status(401).json({
        error: true,
        message: "Email is already in use",
      });
    }
    const hash = await Admin.hashPassword(result.value.password);

    delete result.value.confirmPassword;
    result.value.password = hash;
    let code = Math.floor(100000 + Math.random() * 900000);
    let expiry = Date.now() + 60 * 1000 * 15;
    const sendCode = await sendEmail(result.value.email, code);
    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send verification email.",
      });
    }
    result.value.emailToken = code;
    result.value.emailTokenExpires = new Date(expiry);

    const userEmail = result.value.email;
    console.log(userEmail);

    const newUser = new Admin(result.value);
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "Registration Success",
      _id: newUser.id
    });
  } catch (error) {
    console.error("signup-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot Register",
    });
  }
};

exports.ActivateAdmin = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.json({
        error: true,
        status: 400,
        message: "Please make a valid request",
      });
    }
    const user = await Admin.findOne({
      email: email,
      emailToken: code,
      emailTokenExpires: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid details",
      });
    } else {
      if (user.active)
        return res.send({
          error: true,
          message: "Account already activated",
          status: 400,
        });
      user.emailToken = "";
      user.emailTokenExpires = null;
      user.active = true;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Account activated.",
      });
    }
  } catch (error) {
    console.error("activation-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.LoginAdminPunmeaw = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Cannot authorize user.",
      });
    }

    const user = await Admin.findOne({
      email: email,
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found",
      });
    }

    if (!user.active) {
      return res.status(400).json({
        error: true,
        message: "You must verify your email to activate your account",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid Email or Password.",
      });
    }

    const { error, token } = await generateJwt(user.email, user._id);
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }

    user.accessToken = token;

    await user.save();

    return res.send({
      success: true,
      message: "Admin logged in successfully",
      accessToken: token,
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later.",
    });
  }
};

exports.LogoutAdmin = async (req, res) => {
  try {
    const { id } = req.decoded;
    let user = await Admin.findOne({
      _id: id,
    });
    user.accessToken = "";
    await user.save();
    return res.send({
      success: true,
      message: "Admin Logged out",
    });
  } catch (error) {
    console.error("user-logout-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.GetAllUsers = async (req, res) => {
  let users = await User.find();
  try {
    if (users.length < 1) {
      return res.status(200).json([]);
    }
    return res.json(users);
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

exports.GetUserByEmail = async (req, res) => {
  let email = await User.findOne({
    email: req.body.email,
  });
  try {
    if (!email) {
      return res.status(404).json({
        error: "Email not found",
      });
    }
    return res.json(email);
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

exports.getUser = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization.split(" ")[1],
      decoded;
    try {
      decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).send("unauthorized");
    }
    var userId = decoded.id;

    try {
      const user = await User.findOne({
        _id: userId,
      });
      console.log(user);
      if (user) {
        return res.send({
          status: 200,
          user: user,
        });
      }
    } catch (error) {
      console.log(error);
      return res.send({
        status: 500,
        error: error.message,
      });
    }
  }
  return res.send(500);
};

exports.DeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.query.id);
    if (user) {

      const findAllPostById = await FindHome.find({ author: req.query.id })

      for (let index = 0; index < findAllPostById.length; index++) {
        const nameImage = findAllPostById[index].image.filePath.substr(8);
        await fs.unlink(`./uploads/${nameImage}`)
        await FindHome.findByIdAndDelete(findAllPostById[index]._id);
      }
      await User.findByIdAndDelete(req.query.id);
      return res.status(200).json({
        message: "Delete User " + user.firstName + " Success."
      })

    } else {
      const error = new Error("User ID " + req.query.id + " not found");
      error.code = 404;
      throw error;
    }
  } catch (error) {
    return res.status(error.code).json({
      error: error.message,
      status: error.code
    });

    console.log(error);
  }
};

exports.GetUserById = async (req, res) => {
  let id = await User.findOne({
    id: req.body.id,
  });
  try {
    if (!id) {
      return res.status(404).json({
        error: "Email not found",
      });
    }
    return res.json(id);
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

exports.getIdealCat = async (req, res) => {
  const id = req.decoded.id;

  try {
    const getideal = await User.findById(id).select('idealCat.answer');
    return res.status(200).json(getideal);
  } catch (error) {
    console.log(error);
  }

};

exports.getBestmatch = async (req, res) => {
  const id = req.decoded.id;
  const idealCat = await User.findById(id).select('idealCat');
  console.log(idealCat);
  const getData = await FindHome.find({
    $and: [
      { "generalInfo.characteristic.hair": idealCat.idealCat[0].answer },
      { "generalInfo.neutered": idealCat.idealCat[1].answer },
      { "generalInfo.characteristic.sandbox": idealCat.idealCat[2].answer },
      { "generalInfo.vaccination": idealCat.idealCat[3].answer },
    ]
  });
  return res.status(200).json(getData);

};

exports.resetEmail = async (req, res) => {
  const id = req.decoded.id;
  const getEmail = await User.findById(id).select('email');

  let code = Math.floor(100000 + Math.random() * 900000);
  let expiry = Date.now() + 60 * 1000 * 15;

  const sendCode = await sendEmail(getEmail.email, code);
  if (sendCode.error) {
    return res.status(500).json({
      error: true,
      message: "Couldn't send verification email.",
    });
  }

  const data = await User.findByIdAndUpdate(id,
    {
      emailResetToken: code,
      emailResetTokenExpires: expiry
    })
  if (!data) {
    return res.status(404).send({
      message: `There is no user data in the database.`
    });
  }
  res.status(201).send({
    message: 'The OTP code has been sent to your registered email address. Please bring the code to verify your identity.',
  });

};

exports.verifyIdentityEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.json({
        error: true,
        status: 400,
        message: "Please make a valid request",
      });
    }
    const user = await User.findOne({
      email: email,
      emailResetToken: code,
      emailResetTokenExpires: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid details",
      });
    } else {

      user.emailResetToken = "";
      user.emailResetTokenExpires = null;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Account reset email.",
      });
    }
  } catch (error) {
    console.error("activation-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.editEmail = async (req, res) => {
  const id = req.decoded.id;
  const result = emailSchema.validate(req.body);
  try {
    if (result.error) {
      console.log(result.error.message);
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }
    var user = await User.findOne({
      email: result.value.email,
    });
    if (user) {
      return res.status(401).json({
        error: true,
        message: "Email is already in use",
      });
    } else {
      await User.findByIdAndUpdate(id,
        {
          email: result.value.email,
        })
      return res.status(200).json({
        success: true,
        message: "Update Success",
      });
    }
  } catch (error) {

    return res.status(500).json({
      error: true,
      message: "Cannot Update",
    });
  }


};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Cannot authorize user.",
      });
    }

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found",
      });
    }

    if (!user.active) {
      const result = await User.findOne({ email: req.body.email });
      let code = Math.floor(100000 + Math.random() * 900000);
      let expiry = Date.now() + 60 * 1000 * 15;
      const sendCode = await sendEmail(result.email, code);
      if (sendCode.error) {
        return res.status(500).json({
          error: true,
          message: "Couldn't send verification email.",
        });
      }

      result.emailToken = code;
      result.emailTokenExpires = new Date(expiry);

      const newAgainOTP = new User(result);
      await newAgainOTP.save();

      return res.status(400).json({
        error: true,
        message: "You must verify your email to activate your account",
        active: user.active,
        _id: user.id,
      });
    }
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid Email or Password.",
      });
    }

    const { error, token } = await generateJwt(user.email, user._id);
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }
    const user_body = await User.findOne({
      email: req.body.email,
    });

    user.accessToken = token;
    user.bodyUser = user_body;

    await user.save();

    return res.send({
      success: true,
      message: "User logged in successfully",
      accessToken: token,
      bodyUser: user_body,
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later.",
    });
  }
};

exports.getAdmin = async (req, res) => {
  const id = req.decoded.id;
  const result = await Admin.findById(id).select([
    'firstName', 'lastName', 'tel', 'email', 'role']);

  try {
    if (!result) {
      return res.status(404).json({
        error: "Admin not found",
      });
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

exports.AgainOTPEmail = async (req, res) => {
  const id = req.query.id;
  const data = await User.findById(id);
  try {
    const result = userSchema.validate(data);
    var user = await User.findOne({
      email: result.value.email,
    });
    let code = Math.floor(100000 + Math.random() * 900000);
    let expiry = Date.now() + 60 * 1000 * 15;
    const sendCode = await sendEmail(result.value.email, code);
    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send verification email.",
      });
    }
    result.value.emailResetToken = code;
    result.value.emailResetTokenExpires = new Date(expiry);
    const newUser = new User(result.value);
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "Send OTP Success",
    });
  } catch (error) {
    console.error("signup-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot Register",
    });
  }
}
