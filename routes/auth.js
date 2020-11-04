const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//Validation
const Joi = require('joi');
const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

router.post('/register', async (req, res) => {

    //Lets validate the data before we created a user
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error);

    //Checking if the user is already in the satabase
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists.');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or password is wrong.');

    //Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('invalid Password');

    res.send('Logged in');
});

module.exports = router;