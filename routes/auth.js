const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const validator = require("validator");
const bcrypt = require("bcryptjs");

//models
const User = require('../models/User');

//custom methods
const verify = require("../middleware/verify");
const { loginValidation } = require("../functions/validation");


//user login
router.post('/user/auth', async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) return res.status(401).send({error: error.details[0].message});

    try {
        let user;

        if (req.body.email) user = await User.findOne({email: req.body.email});
        if (req.body.username) user = await User.findOne({username: req.body.username});

        if (!user) return res.status(401).send({error: "Unauthorized login attempt."})

        const isAuthenticated = await bcrypt.compare(req.body.password, user.password);

        if (!isAuthenticated) return res.status(401).send({error: "Invalid credentials."});

        const payload = {
            user: {
                id: user._id
            }
        }
        
        jwt.sign(payload, process.env.JWT_SECRET, 
            {expiresIn: "7 days"}, (err, token) => {
                if (err) throw err;
                res.status(200).send({token: token});
            })
            
    } catch (error) {
        res.status(500).send({error: "Something went wrong."})
    }
})

//token verification
// router.get('/user/auth', verify, async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select("-password -__v")
//         res.status(200).send(user);
//     } catch (error) {
//         res.status(401).send({error: "Invalid token."})
//     }
// })

module.exports = router;
