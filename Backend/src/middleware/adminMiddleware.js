const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const adminMiddleware = async (req,res,next) => {

    try {

        const {token} = req.cookies;
        if (!token) 
            throw new Error("Authentication required");

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked)
            throw new Error('Session expired. Please login again');

        const {_id, role} = payload;
        if (!_id || role!='admin') //verifying admin
            throw new Error('Admin access required');

        const result = await User.findById(_id);
        if (!result) 
            throw new Error("User account not found");

        req.data = result;
        
        next();
    }
    catch(err) {
        if (err.name === 'JsonWebTokenError') {
            res.status(401).send("Session expired. Please login again");
        } else if (err.name === 'TokenExpiredError') {
            res.status(401).send("Session expired. Please login again");
        } else {
            res.status(401).send(err.message);
        }
    }
}

module.exports = adminMiddleware;
