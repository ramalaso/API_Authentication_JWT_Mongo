const router = require('express').Router();
const User = require('../models/User');

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

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login');

module.exports = router;