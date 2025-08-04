const express = require('express');
const authRouter = express.Router();
const {register, login, logout, adminRegister, deleteProfile} = require('../controllers/userAuth');
const User = require('../models/user');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const Problem = require('../models/problem');


//register
authRouter.post('/register', register);

//admin register
authRouter.post('/admin/register', adminMiddleware, adminRegister);

//login
authRouter.post('/login',login);

//logout
authRouter.post('/logout', userMiddleware, logout);

//getProfile
authRouter.get('/getprofile', userMiddleware, async (req,res) => {
    // const result = await User.find({});
    const result = await Problem.find({});
    res.send(result);
});

//delete profile
authRouter.delete('/deleteprofile', userMiddleware, deleteProfile);

authRouter.get('/check', userMiddleware, (req,res) => {
    const reply = {
        _id: req.data._id,
        firstName: req.data.firstName,
        emailId: req.data.emailId,
        role: req.data.role
    }

    res.status(200).json({
        user: reply,
        message: 'Valid User'
    });
})

module.exports = authRouter;
