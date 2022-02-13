const express = require('express');
const { check,validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();

//@route        POST api/users
//@desc         Register a user
//@access       Public
router.post('/',[
    check('name','Please include a valid name!').not().isEmpty(),
    check('email','Please include a valid email!').isEmail(),
    check('password','Please enter a valid password with min 8 characters!').isLength({min:8})
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() })
    }
    const {name,email,password } = req.body;

    try {
        let user = await User.findOne({ email });

        if(user){
            return res.status(400).json({msg:'User already exist!'});
        }

        user = new User({
            name,email,password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();

        const payload = {
            user : {
                id : user.id
            }
        }
        //Generating a token 
        /* It takes 4 values
            payload ,secret,opt obj,callback  
        
        */
        jwt.sign(payload,config.get('jwtSecret'),{
            expiresIn : 360000
        },(err,token) => {
            if(err) throw err; 
            res.json({ token });
        })


    } catch (error) {   
        console.log(error.message);
        res.status(400).send('Server Error!');
    }
});

module.exports = router;
