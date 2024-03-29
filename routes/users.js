const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//custom imports
const User = require('../models/User');
const verify = require("../middleware/verify");

//custom functions
const {signupValidation} = require('../functions/validation');

//check for existing username
const doesUsernameExist = reqUsername => {
  return User.findOne({ username: reqUsername });
};

//check for existing email
const checkEmail = userEmail => {
  return User.findOne({ email: userEmail });
};

//signup
router.post("/register", async (req, res) => {
  const { error } = signupValidation(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  // validation
  const isUsernameTaken = await doesUsernameExist(req.body.username);
  if (isUsernameTaken) {
    return res.status(409).send({ error: "This username is taken." });
  }

  try {
    let user = await checkEmail(req.body.email);
    if (user) {
      return res
        .status(409)
        .send({ error: "The email you entered is already in use." });
    }

    //encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //lowercase username for easy querying
    const lowercaseUsername = req.body.username.toLowerCase();

    user = new User({
      username: lowercaseUsername,
      displayName: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();

    const payload = {
      user: {
        id: user._id
      }
    };

    //json web token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) throw err;
        res.send({
          token: token
        });
      }
    );
  } catch (error) {
    res.status(500).send("Oops! Something went wrong.");
  }
});

module.exports = router;