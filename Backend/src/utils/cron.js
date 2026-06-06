const cron = require('node-cron');
const axios = require('axios');

const cronTaskKey = Symbol.for('littcode.healthCheckCronTask');

let isRunning = false;

const runHealthCheck = async (healthUrl) => {
    if (isRunning) {
        console.log('Health check cron skipped because the previous run is still active');
        return;
    }

    isRunning = true;

    try {
        const response = await axios.get(healthUrl, { timeout: 8000 });
        // console.log(`Health check cron succeeded: ${response.status}`);
    } catch (err) {
        console.error('Health check cron failed:', err.message);
    } finally {
        isRunning = false;
    }
};

const startHealthCheckCron = (port = process.env.PORT || 5000) => {
    const healthUrl = process.env.HEALTH_CHECK_URL || `http://127.0.0.1:${port}/health`;

    if (globalThis[cronTaskKey]) {
        globalThis[cronTaskKey].stop();
        if (typeof globalThis[cronTaskKey].destroy === 'function') {
            globalThis[cronTaskKey].destroy();
        }
    }

    const healthCheckTask = cron.schedule('0 */10 * * * *', () => { //runs on every 10 minute at 0 second
        void runHealthCheck(healthUrl);
    });

    globalThis[cronTaskKey] = healthCheckTask;

    void runHealthCheck(healthUrl);

    console.log(`Health check cron started for ${healthUrl}`);

    return healthCheckTask;
};

module.exports = {
    startHealthCheckCron,
};