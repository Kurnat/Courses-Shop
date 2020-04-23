const {check} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    check('email','Enter correct email')
        .isEmail()
        .custom(async (value, {req}) => {
            try{
                const user = await User.findOne({ email: value});
                if(user){
                    return Promise.reject('This email is already in use')
                }
            } catch(err) {
                console.log(err);

            }
        }).normalizeEmail(),
    check('password', 'Password must have minimum 6 symbols')
        .isLength({min:6, max:60})
        .isAlphanumeric()
        .trim(),
    check('confirm')
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error('Passwords must be the same');
            }
            return true;
        }).trim(),
    check('name', 'Name must have min 3 symbols')
        .isLength({min: 3})
        .trim()
]; 


exports.courseValidators = [
    check('title', 'Minimal length is 3 simbols').isLength({min: 3}).trim(),
    check('price', 'Write correct price').isNumeric(),
    check('img', 'Write correct Url of image').isURL(),
];