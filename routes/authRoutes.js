/* Modules */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


// Rendering Signup page
router.get('/register', (req, res) => {
    res.render('signup');
})

// register the new user to the database
router.post('/register', async(req, res) => {
    /* Checking password and confirm password value */
    if(req.body.password != req.body.confirmPassword) {
        /* Showing error in flash */
        req.flash('error', 'Enter correct password');
        return res.redirect('/register');
    }
    try{
        const {username, email, password} = req.body;

        const user = new User({
            username: username,
            email: email        
        });
                                               
        const newUser = await User.register(user, password); 
        
        /* Success flash alert */
        req.flash('success', 'Account created');
    
        res.redirect('/login');
}

    catch(e) {
        req.flash('error', 'Account already exists with same username or email');
        res.redirect('/register');
    }

});



//rendering the login page
router.get('/login', (req, res) => {
    res.render('login')
})

/* Username variable */
var usern="";

/* Login page information */
router.post('/login', 
    passport.authenticate('local', 
        { 
            failureRedirect: '/login', 
            failureFlash: true 
        }), 
        
    (req, res) => {

        const { username } = req.user;
        usern = username;
        req.flash('success', `Welcome ${username} to Chat.com`)
        
        res.redirect('/chat');

    });


    /* Rendering chat page */
    router.get('/chat', (req, res) => {
        if(usern == "") {
            return res.redirect('/login');
        }
        res.render('chat', {
            user: usern
        });
    });
    


/* rendering logout page */
router.get('/logout', (req, res) => {
    req.logout();
    usern = "";
    req.flash('success', 'Account Logged Out');
    res.redirect('/');
})


/* Rendering home page */
router.get('/', (req, res) => {
    res.render('home');
});


/* Exporting routes */
module.exports = router;