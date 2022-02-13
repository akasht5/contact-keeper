const express = require('express');
const { check,validationResult } = require('express-validator');
const User = require('../models/User');
const Contact = require('../models/Contacts');
const auth = require('../middleware/auth');
const router = express.Router();

//@route        GET api/contacts
//@desc         Get all contacts
//@access       Private
router.get('/',auth,async (req,res) => {
    try {
        const contacts = await Contact.find({ user:req.user.id }).sort({date :-1 });
        res.json(contacts); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Cant find user contacts!');
    }
});

//@route        POST api/contact
//@desc         Add a contact
//@access       Public
router.post('/',[ auth, [
    check('name','Name is required !').not().isEmpty()
] ],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors : errors.array() });
    }
    const { name,email,phone,type } = req.body;
    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user:req.user.id
        })
        const contact = await newContact.save();
        res.send(contact);

    } catch (error) {
        console.log(error);
    }
});

//@route        POST api/contact/:id
//@desc         Update a contact
//@access       Public
router.put('/:id',auth,async (req,res) => {
    const { name,email,phone,type } = req.body;

    let contactFields = {};
    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id);
        if(!contact){
            return res.status(404).json({ msg : "Contact Not Found!"})
        }
        
        //Make sure user contact change others content 
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg : "Not Authorised!"});
        }
        contact = await Contact.findByIdAndUpdate(req.params.id,
            { $set : contactFields },
            { new: true }
            );
        res.json(contact);

    } catch (error) {
        

    }
    
});

//@route        DELETE api/contact/:id
//@desc         Delete a contact
//@access       Public
router.delete('/:id',auth,async (req,res) => {
    try {
        let contact = await Contact.findById(req.params.id);
    
    if(!contact){
        return res.status(404).json({ msg : "User not found !"});
    }

    if(contact.user.toString()!==req.user.id){
        console.log();
        console.log();
        return res.status(401).json({ msg : "Not Authorized! "});
    }

    await Contact.findByIdAndDelete(req.params.id);

    //Check that the loggedIn user-id is equal to the user-id whose contact we are deleting
    //Check that the contact(req.user.id) we are deleting is associated with the contact.user
    res.json({ msg : "Contact Deleted !",Contactuser : contact.user.toString() ,Requserid : req.user.id});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error!');
    }
    

});

module.exports = router;
