const {Router} = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = Router();

router.get('/login', async (req, res) =>{
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    });
});

router.get('/logout', async (req, res) =>{
    req.session.destroy(() => {
    res.redirect('/auth/login#login');
    });
});

router.post('/login', async (req, res) => {
    try{
        const{email, password} = req.body;
        const candidate = await User.findOne({email});

        if(candidate) {
            // if found a user

            // comparison of passwords
            const areSame = await bcrypt.compare(password, candidate.password)
            if(areSame) {
                //if passwords are same
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if(err) {
                        throw err
                    }
                    res.redirect('/');
                });
            }else{
                // passwords aren't a same
                req.flash('loginError', `Passwords aren't same`);
                res.redirect('/auth/login#login');
            }
        } else {
            // user is not found
            req.flash('loginError', 'This user is not found');
            res.redirect('/auth/login#login');
        }
    } catch(err){
        console.log(err);
    }
})

router.post('/register', async (req, res) => {
    try{
        const {email, password, repeat, name} = req.body;
        const candidate = await User.findOne({email});

        if (candidate) {
            req.flash('registerError', 'User with this email already exist');
            res.redirect('/auth/login#register')
        }else{
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch(err){
        console.log(err);
    }
})

module.exports = router;