const redisClient = require("../config/redis");

const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
});

const checkHealth = async (req, res) => {
    try {
        await redisClient.ping();
        console.log("RESS:", now);
        
        res.status(200).json({
            app: 'ok',
            redis: 'ok'
        });
    } catch (err) {
        res.status(500).json({
            app: 'ok',
            redis: 'down'
        });
    }
};

module.exports = {
    checkHealth
}
