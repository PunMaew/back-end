const bcrypt = require("bcryptjs/dist/bcrypt");
const Joi = require("joi");
const { sendEmail } = require("../helpers/mailer");
const User = require("../model/userModel");
const { generateJwt } = require("../helpers/generateJwt");
const jwt = require("jsonwebtoken");

const userSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  address: {
    province: Joi.string().required(),
    zipCode: Joi.string().required(),
  },

});

//--------------------- User ---------------------
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Cannot authorize user.",
      });
    }
    //1. Find if any account with that email exists in DB
    const user = await User.findOne({
      email: email,
    });
    // NOT FOUND - Throw error
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found",
      });
    }
    //2. Throw error if account is not activated
    if (!user.active) {
      return res.status(400).json({
        error: true,
        message: "You must verify your email to activate your account",
      });
    }
    //3. Verify the password is valid
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid Email or Password.",
      });
    }

    //Generate Access token
    //const { error, token } = await generateJwt(user.email, user.userId); // user._id
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

    //Success
    return res.send({
      success: true,
      message: "User logged in successfully",
      accessToken: token, //Send it to the client
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

exports.EditProfile = (req, res) => {
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
    try {
      req.body.authorAdmin = new mongoose.Types.ObjectId(req.decoded.id);
      const result = userSchema.validate(req.body);
      const newArticle = new Article(result.value);
      console.log(newArticle);
      await newArticle.save();

      return res.status(200).json({
          success: true,
          message: "Create Success",
      });
  } catch (error) {
      console.log(error);
      return res.status(500).send(error)
  }
};

//--------------------- User and Admin ---------------------
exports.Signup = async (req, res) => {
  try {
    const result = userSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }
    //Check if the email has been already registered.
    var user = await User.findOne({
      email: result.value.email,
    });
    if (user) {
      return res.status(401).json({
        error: true,
        message: "Email is already in use",
      });
    }
    const hash = await User.hashPassword(result.value.password);

    //    remove the confirmPassword field from the result as we dont need to save this in the db.
    delete result.value.confirmPassword;
    result.value.password = hash;
    let code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    let expiry = Date.now() + 60 * 1000 * 15; //Set expiry 15 mins ahead from now
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
    //let user = await User.findOne({ userId: id });
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
    return res.stat(500).json({
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
      }, // check if the code is expired
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
        message:
          "If that email address is in our database, we will send you an email to reset your password",
      });
    }
    let code = Math.floor(100000 + Math.random() * 900000);
    let response = await sendEmail(user.email, code);
    if (response.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send mail. Please try again later.",
      });
    }
    let expiry = Date.now() + 60 * 1000 * 15;
    user.resetPasswordToken = code;
    user.resetPasswordExpires = expiry; // 15 minutes
    await user.save();
    return res.send({
      success: true,
      message:
        "If that email address is in our database, we will send you an email to reset your password",
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
    //console.log(result);
    var user = await User.findOne({
      email: result.value.email,
    });
    //console.log(user);
    let code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    let expiry = Date.now() + 60 * 1000 * 15; //Set expiry 15 mins ahead from now
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

//--------------------- Admin ---------------------
exports.LoginAdminPunmeaw = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Cannot authorize user.",
      });
    }
    //1. Find if any account with that email exists in DB
    const user = await User.findOne({
      email: email,
    });
    // NOT FOUND - Throw error
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found",
      });
    }
    //2. Throw error if account is not activated
    if (!user.active) {
      return res.status(400).json({
        error: true,
        message: "You must verify your email to activate your account",
      });
    }
    //3. Verify the password is valid
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid Email or Password.",
      });
    }

    //Generate Access token
    //const { error, token } = await generateJwt(user.email, user.userId); // user._id
    const { error, token } = await generateJwt(user.email, user._id);
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }

    user.accessToken = token;

    await user.save();

    //Success
    return res.send({
      success: true,
      message: "User logged in successfully",
      accessToken: token, //Send it to the client
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later.",
    });
  }
};

exports.GetAllUsers = async (req, res) => {
  let users = await User.find();
  try {
    if (users.length < 1) {
      return res.status(404).json({
        error: "No users was found in DB",
      });
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
    // Fetch the user by id
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