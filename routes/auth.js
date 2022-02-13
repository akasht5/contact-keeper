const express = require('express');
const { check,validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const router = express.Router();

//@route        GET api/auth
//@desc         Get a loggedIn User
//@access       Private
router.get('/',auth,async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error : '+error.message);
        res.status(500).send('Cant find a user with this credantials!')
    }
});

//@route        POST api/auth
//@desc         Login a User
//@access       Public
router.post('/',[
    check('email','Invalid Email').isEmail(),
    check('password','Invalid Password').exists()
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({errors : errors.array()});
    }

    const { email,password } = req.body;
    try {

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg : "User Not Found!"})
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg : "Invalid Crediantials!(Password doesnt match with email!)"})
        }
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
            res.json({ id:user.id,token });
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error!')
    }

});

module.exports = router;
