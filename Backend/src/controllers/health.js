const redisClient = require("../config/redis");

const checkHealth = async (req, res) => {
    try {
        const now = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: false,
        });
        await redisClient.ping();
        console.log("CRON RUNN:", now);
        
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
