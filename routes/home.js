const express = require('express');
const router = express.Router();
const path = require('path');
const UserStaff = require('../models/userStaff');
const md5 = require('md5');
const sendMail = require('../utils/mail');
// Email in below one
const registeredMail = require('../utils/Registration Mail/index');
// Name and Password in below one
const verifiedMail = require('../utils/Verification Mail/index');
// Name and Message
const contactMail = require('../utils/Contact/index');

// Link
const home = 'https://schoolutils.herokuapp.com/';
// const home = 'http://localhost:3000/';

// Home Page
router.get('/', (req, res) => {
    if(req.session.user) {
        res.redirect('/evaluations/');
    }else{
        res.sendFile(path.resolve(__dirname, '../views/index.html'));
    }
});


// Registration route
router.post('/signup', async (req, res) => {
    const {name, email, password} = req.body;
    const userExists = await UserStaff.findOne({email: email});
    if(userExists){
        res.send('User already exists');
    }else{
        let temp = name + Math.random()*100000;
        const otp = md5(temp);
        const link = home + 'verify/' + otp;
        const user = new UserStaff({
            name: name,
            email: email,
            password: password,
            link: otp
        });
        await user.save();
        // Send Email
        sendMail(email, 'Registration Successful', registeredMail(link));
        res.render('registered', {name: name, email: email});
    }
});

router.get('/verify/:otp', async (req, res) => {
    const otp = req.params.otp;
    if(otp.length >= 24){
        const user = await UserStaff.findOne({link: otp});
        if(user){
            user.status = true;
            await user.save();
            // Send Email
            sendMail(user.email, 'Account Verified | Account Details', verifiedMail(user.name, user.password));
            res.render('verified', {name: user.name});
        }else{
            res.status(500).send('Invalid Link, Please try again with other link or go back to home page <a href="/">Home Link</a>');
        }
    }else{
        res.status(500).send('Invalid Link, Please try again with other link or go back to home page <a href="/">Home Link</a>');
    }
    
});

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    const user = await UserStaff.findOne({email: email, password: password});
    if(user){
        if(user.status){
            req.session.user = user;
            res.redirect('/evaluations/');
        }else{
            res.status(400).render('error', {message: 'Your account is not verified yet, Please verify your account first'});
        }
    }else{
        res.status(400).render('error', {message: 'Invalid Credentials'});
    }
});

router.get('/evaluations/', (req, res) => {
    if(req.session.user){
    res.render('evaluations', {user: req.session.user});
    }else{
        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/contact', (req, res) => {
    const {name, email, message} = req.body;
    if(name && email && message){
        sendMail(email, "School Utils | Developer Connect", contactMail(name, message));
        sendMail("19btc037@ietdavv.edu.in", "#copy mail via School Utils from " + name + " | " + Date.now() , contactMail(name, message));
        res.render('contact', {message: 'Your message has been sent successfully'});
    }else{
        res.status(400).render('error', {message: 'Please fill all the fields'});
    }
});

module.exports = router;