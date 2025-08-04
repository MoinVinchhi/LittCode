const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const userMiddleware = async (req,res,next) => {

    try {

        const {token} = req.cookies;
        if (!token) 
            throw new Error("Token Doesn't Exist");

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked)
            throw new Error('Invalid Token');

        const {_id} = payload;
        if (!_id) 
            throw new Error('Invalid Token');

        const result = await User.findById(_id);
        if (!result) 
            throw new Error("User Doesn't Exist");

        req.data = result;
        
        next();
    }
    catch(err) {
        res.status(401).send("Error(usermidd): " + err.message);
    }
}

module.exports = userMiddleware;
