const redisClient = require("../config/redis");

const submitCodeRateLimiter = async (req,res,next) => {
    const userId = req.data._id;
    const redisKey = `submit_cooldown:${userId}`;

    try {
        //check if user has a recent submission
        const exists = await redisClient.exists(redisKey);
        
        if (exists) {
            return res.status(429).send('Please Wait For 10 Seconds Before Submitting Next Problem');
        }

        //set cool down period
        await redisClient.set(redisKey, 'cooldown_active', {
            expiration: {
                type: 'EX',
                value: 10
            }, //expire after 10 sec
            condition: 'NX', //only set if not exists
        })

        next();
    }
    catch (err) {
        res.status(500).send('Internal Server Error: ' + err.message);
    }
}

module.exports = submitCodeRateLimiter;
